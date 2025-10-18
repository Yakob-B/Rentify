import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getListingById, createBooking } from '../utils/api'
import { getErrorMessage } from '../utils/errors'

const BookingPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      startDate: '',
      endDate: '',
      message: ''
    }
  })

  const startDate = watch('startDate')
  const endDate = watch('endDate')

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingData = await getListingById(id)
        setListing(listingData)
      } catch (error) {
        console.error('Error fetching listing:', error)
        toast.error(getErrorMessage(error, 'Error loading listing details'))
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [id])

  const calculateTotal = () => {
    if (!startDate || !endDate || !listing) return 0
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays * listing.price
  }

  const onSubmit = async (data) => {
    if (!listing) return
    
    setBookingLoading(true)
    
    try {
      await createBooking({
        listingId: id,
        startDate: data.startDate,
        endDate: data.endDate,
        message: data.message
      })
      
      toast.success('Booking request sent successfully!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Error creating booking'))
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing not found</h2>
          <p className="text-gray-600 mb-6">The listing you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Listing Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={listing.images[0] || '/placeholder-image.jpg'}
                  alt={listing.title}
                  className="w-full h-64 object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                    <p className="text-gray-600">{listing.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary-600">
                      ${listing.price}/{listing.priceUnit}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">
                      {listing.location.city}, {listing.location.state}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{listing.owner.name}</span>
                  </div>
                </div>

                {listing.features && listing.features.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {listing.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Availability</h3>
                  <div className="flex items-center space-x-3">
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">
                      Available until {new Date(listing.availability.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Request Booking</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      {...register('startDate', { 
                        required: 'Start date is required',
                        validate: value => {
                          const today = new Date().toISOString().split('T')[0]
                          return value >= today || 'Start date must be today or later'
                        }
                      })}
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      className="input-field"
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      {...register('endDate', { 
                        required: 'End date is required',
                        validate: value => {
                          if (!startDate) return true
                          return value > startDate || 'End date must be after start date'
                        }
                      })}
                      type="date"
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className="input-field"
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message to Owner
                  </label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    className="input-field"
                    placeholder="Tell the owner why you want to rent this item..."
                  />
                </div>

                {/* Booking Summary */}
                {startDate && endDate && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">
                          {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))} days
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price per {listing.priceUnit}:</span>
                        <span className="font-medium">${listing.price}</span>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Total:</span>
                          <span className="text-primary-600">${calculateTotal()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={bookingLoading || !startDate || !endDate}
                    className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bookingLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Sending Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Booking Request</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-full btn-secondary"
                  >
                    Back to Listing
                  </button>
                </div>
              </form>
            </div>

            {/* Important Notes */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Notes</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your booking request will be sent to the owner for approval</li>
                <li>• Payment will be processed once the owner approves your request</li>
                <li>• You can cancel your booking up to 24 hours before the start date</li>
                <li>• Contact the owner directly for any questions about the item</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage
