import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import CategoryFilter from '../components/CategoryFilter'
import ListingCard from '../components/ListingCard'
import { getCategories, getListings } from '../utils/api'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/errors'

const HomePage = () => {
  const [categories, setCategories] = useState([])
  const [listings, setListings] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, listingsData] = await Promise.all([
          getCategories(),
          getListings({ limit: 8 })
        ])
        setCategories(categoriesData)
        setListings(listingsData.listings || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error(getErrorMessage(error, 'Failed to load homepage data'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = async () => {
    setLoading(true)
    try {
      const params = {
        limit: 8,
        ...(selectedCategory && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm }),
        ...(location && { location })
      }
      const data = await getListings(params)
      setListings(data.listings || [])
    } catch (error) {
      console.error('Error searching listings:', error)
      toast.error(getErrorMessage(error, 'Search failed'))
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySelect = async (categoryId) => {
    setSelectedCategory(categoryId)
    setLoading(true)
    try {
      const params = {
        limit: 8,
        ...(categoryId && { category: categoryId })
      }
      const data = await getListings(params)
      setListings(data.listings || [])
    } catch (error) {
      console.error('Error filtering by category:', error)
      toast.error(getErrorMessage(error, 'Failed to filter by category'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-yellow-300 blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 md:mb-6">
              Rent Anything, 
              <span className="block text-yellow-300">Anytime, Anywhere</span>
            </h1>
            <p className="text-base md:text-xl mb-8 md:mb-10 text-primary-100">
              Discover and rent items from your community. From homes and vehicles to tools and electronics.
            </p>
            
            {/* Search Bar */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSearch() }}
              className="max-w-4xl mx-auto bg-white/95 backdrop-blur rounded-xl p-2 shadow-lg ring-1 ring-black/5"
              role="search"
              aria-label="Search listings"
            >
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 relative">
                  <label htmlFor="search-input" className="sr-only">Search items</label>
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="search-input"
                    name="q"
                    type="text"
                    placeholder="What are you looking for? (e.g. camera, car, drill)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    autoComplete="off"
                    className="w-full pl-10 pr-4 py-3.5 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <div className="flex-1 relative">
                  <label htmlFor="location-input" className="sr-only">Location</label>
                  <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="location-input"
                    name="loc"
                    type="text"
                    placeholder="City or State"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    autoComplete="off"
                    className="w-full pl-10 pr-4 py-3.5 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <span>Search</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Categories</h2>
            <p className="text-lg text-gray-600">Find exactly what you need</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              ))}
            </div>
          ) : (
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          )}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Listings</h2>
              <p className="text-lg text-gray-600">Discover popular items in your area</p>
            </div>
            <Link 
              to="/listings" 
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-2"
            >
              <span>View All</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}
            </div>
          )}

          {!loading && listings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <MagnifyingGlassIcon className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or browse all categories.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Renting?</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already earning money by renting out their items.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Get Started
            </Link>
            <Link 
              to="/listings/new" 
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              List Your Item
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
