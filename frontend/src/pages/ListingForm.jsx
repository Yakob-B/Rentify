import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { 
  PhotoIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { getCategories, createListing, updateListing, getListingById, uploadListingImages } from '../utils/api'
import { getErrorMessage } from '../utils/errors'

const ListingForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      price: '',
      priceUnit: 'day',
      location: {
        address: '',
        city: '',
        state: '',
        zipCode: ''
      },
      availability: {
        startDate: '',
        endDate: ''
      },
      features: []
    }
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await getCategories()
        setCategories(categoriesData)
        
        if (isEdit) {
          const listing = await getListingById(id)
          setValue('title', listing.title)
          setValue('description', listing.description)
          setValue('category', listing.category._id)
          setValue('price', listing.price)
          setValue('priceUnit', listing.priceUnit)
          setValue('location.address', listing.location.address)
          setValue('location.city', listing.location.city)
          setValue('location.state', listing.location.state)
          setValue('location.zipCode', listing.location.zipCode)
          setValue('availability.startDate', new Date(listing.availability.startDate).toISOString().split('T')[0])
          setValue('availability.endDate', new Date(listing.availability.endDate).toISOString().split('T')[0])
          setValue('features', listing.features.join(', '))
          setImages(listing.images || [])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error(getErrorMessage(error, 'Error loading form data'))
      }
    }

    fetchData()
  }, [id, isEdit, setValue])

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    try {
      setUploading(true)
      const result = await uploadListingImages(files)
      const uploadedUrls = (result.images || []).map(img => img.url)
      setImages(prev => [...prev, ...uploadedUrls])
      toast.success('Images uploaded')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to upload images'))
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    
    try {
      const listingData = {
        ...data,
        images: images.filter(img => typeof img === 'string'),
        features: data.features.split(',').map(f => f.trim()).filter(f => f)
      }

      if (isEdit) {
        await updateListing(id, listingData)
        toast.success('Listing updated successfully!')
      } else {
        await createListing(listingData)
        toast.success('Listing created successfully!')
      }
      
      navigate('/dashboard')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Error saving listing'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Listing' : 'Create New Listing'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Update your listing details' : 'Share your item with the community'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  {...register('title', { required: 'Title is required' })}
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? 'title-error' : undefined}
                  className={`input-field ${errors.title ? 'border-red-500 focus:ring-red-500' : ''} dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100`}
                  placeholder="Enter a descriptive title"
                />
                {errors.title && (
                  <p id="title-error" className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={4}
                  aria-invalid={!!errors.description}
                  aria-describedby={errors.description ? 'desc-error' : undefined}
                  className={`input-field ${errors.description ? 'border-red-500 focus:ring-red-500' : ''} dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100`}
                  placeholder="Describe your item in detail"
                />
                {errors.description && (
                  <p id="desc-error" className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  aria-invalid={!!errors.category}
                  className={`input-field ${errors.category ? 'border-red-500 focus:ring-red-500' : ''} dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <input
                    {...register('price', { 
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' }
                    })}
                    type="number"
                    step="0.01"
                    aria-invalid={!!errors.price}
                    className={`input-field ${errors.price ? 'border-red-500 focus:ring-red-500' : ''} dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100`}
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    {...register('priceUnit')}
                    className="input-field dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                  >
                    <option value="hour">Hour</option>
                    <option value="day">Day</option>
                    <option value="week">Week</option>
                    <option value="month">Month</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  {...register('location.address', { required: 'Address is required' })}
                  aria-invalid={!!errors.location?.address}
                  className={`input-field ${errors.location?.address ? 'border-red-500 focus:ring-red-500' : ''} dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100`}
                  placeholder="Street address"
                />
                {errors.location?.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  {...register('location.city', { required: 'City is required' })}
                  aria-invalid={!!errors.location?.city}
                  className={`input-field ${errors.location?.city ? 'border-red-500 focus:ring-red-500' : ''} dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100`}
                  placeholder="City"
                />
                {errors.location?.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  {...register('location.state', { required: 'State is required' })}
                  aria-invalid={!!errors.location?.state}
                  className={`input-field ${errors.location?.state ? 'border-red-500 focus:ring-red-500' : ''} dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100`}
                  placeholder="State"
                />
                {errors.location?.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.state.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code *
                </label>
                <input
                  {...register('location.zipCode', { required: 'ZIP code is required' })}
                  aria-invalid={!!errors.location?.zipCode}
                  className={`input-field ${errors.location?.zipCode ? 'border-red-500 focus:ring-red-500' : ''} dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100`}
                  placeholder="12345"
                />
                {errors.location?.zipCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.zipCode.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available From *
                </label>
                <input
                  {...register('availability.startDate', { required: 'Start date is required' })}
                  type="date"
                  aria-invalid={!!errors.availability?.startDate}
                  className={`input-field ${errors.availability?.startDate ? 'border-red-500 focus:ring-red-500' : ''} dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100`}
                />
                {errors.availability?.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.availability.startDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Until *
                </label>
                <input
                  {...register('availability.endDate', { required: 'End date is required' })}
                  type="date"
                  aria-invalid={!!errors.availability?.endDate}
                  className={`input-field ${errors.availability?.endDate ? 'border-red-500 focus:ring-red-500' : ''} dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100`}
                />
                {errors.availability?.endDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.availability.endDate.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Images</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <PhotoIcon className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> images
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB each)</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Features</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Features
              </label>
              <input
                {...register('features')}
                className="input-field dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                placeholder="Separate features with commas (e.g., WiFi, Parking, Pet-friendly)"
              />
              <p className="mt-1 text-sm text-gray-500">
                List the key features or amenities of your item
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{isEdit ? 'Updating...' : 'Creating...'}</span>
                </>
              ) : (
                <span>{isEdit ? 'Update Listing' : 'Create Listing'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ListingForm
