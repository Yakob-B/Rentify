import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  ArrowRightIcon,
  SparklesIcon,
  BoltIcon,
  ShieldCheckIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import CategoryFilter from '../components/CategoryFilter'
import ListingCard from '../components/ListingCard'
import PageTransition from '../components/PageTransition'
import useScrollAnimation from '../hooks/useScrollAnimation'
import SEO from '../components/SEO'
import StructuredData from '../components/StructuredData'
import { getCategories, getListings, getNearbyListings } from '../utils/api'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/errors'

const HomePage = () => {
  const [categories, setCategories] = useState([])
  const [listings, setListings] = useState([])
  const [nearbyListings, setNearbyListings] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [nearbyLoading, setNearbyLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  
  // Scroll animation hooks
  const [heroRef, heroVisible] = useScrollAnimation()
  const [featuresRef, featuresVisible] = useScrollAnimation()
  const [listingsRef, listingsVisible] = useScrollAnimation()
  const [ctaRef, ctaVisible] = useScrollAnimation()

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

  // Geolocation: fetch nearby listings
  useEffect(() => {
    const DEFAULT_COORDS = { lat: 9.005401, lng: 38.763611 } // Addis Ababa fallback

    const fetchNearby = async (coords) => {
      setNearbyLoading(true)
      try {
        const data = await getNearbyListings({ lat: coords.lat, lng: coords.lng, distance: 10, limit: 8 })
        setNearbyListings(data.listings || [])
      } catch (error) {
        console.error('Error fetching nearby listings:', error)
      } finally {
        setNearbyLoading(false)
      }
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          fetchNearby(coords)
        },
        () => {
          fetchNearby(DEFAULT_COORDS)
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      )
    } else {
      fetchNearby(DEFAULT_COORDS)
    }
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

  // Structured data for homepage
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Rentify',
    description: 'Universal Rent Service Platform',
    url: window.location.origin,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${window.location.origin}/listings?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <PageTransition>
      <SEO
        title="Rentify - Universal Rent Service Platform"
        description="Rentify is a universal rent service platform where you can rent or list any kind of item - homes, vehicles, tools, electronics, and more."
        keywords="rent, rental, marketplace, items, property, vehicle, tools, electronics"
      />
      <StructuredData data={structuredData} />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl float"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-yellow-300 blur-3xl float-delayed"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-300 blur-3xl animate-pulse"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className={`text-center max-w-3xl mx-auto transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 md:mb-6 hero-text">
                <span className="text-shimmer">Rent Anything,</span>
                <span className="block text-yellow-300 animate-pulse">Anytime, Anywhere</span>
              </h1>
              <p className="text-base md:text-xl mb-8 md:mb-10 text-primary-100 hero-subtitle">
                Discover and rent items from your community. From homes and vehicles to tools and electronics.
              </p>
            
              {/* Search Bar */}
              <form
                onSubmit={(e) => { e.preventDefault(); handleSearch() }}
                className="max-w-4xl mx-auto bg-white/95 backdrop-blur rounded-xl p-2 shadow-lg ring-1 ring-black/5 hero-cta hover-lift"
                role="search"
                aria-label="Search listings"
              >
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 relative group">
                    <label htmlFor="search-input" className="sr-only">Search items</label>
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors duration-200" />
                    <input
                      id="search-input"
                      name="q"
                      type="text"
                      placeholder="What are you looking for? (e.g. camera, car, drill)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      autoComplete="off"
                      className="w-full pl-10 pr-4 py-3.5 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all duration-300 hover:border-primary-300"
                    />
                  </div>
                  <div className="flex-1 relative group">
                    <label htmlFor="location-input" className="sr-only">Location</label>
                    <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors duration-200" />
                    <input
                      id="location-input"
                      name="loc"
                      type="text"
                      placeholder="City or State"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      autoComplete="off"
                      className="w-full pl-10 pr-4 py-3.5 md:py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder:text-gray-400 transition-all duration-300 hover:border-primary-300"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 btn-magnetic"
                  >
                    <span>Search</span>
                    <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </form>
          </div>
        </div>
      </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`text-center mb-16 transition-all duration-1000 ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Rentify?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">Experience the future of renting with our innovative platform</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: BoltIcon,
                  title: "Lightning Fast",
                  description: "Find and book items in seconds with our optimized search and booking system.",
                  color: "text-yellow-500"
                },
                {
                  icon: ShieldCheckIcon,
                  title: "Secure & Safe",
                  description: "Your transactions are protected with bank-level security and verified users.",
                  color: "text-green-500"
                },
                {
                  icon: HeartIcon,
                  title: "Community Driven",
                  description: "Join a community of trusted renters and owners building the sharing economy.",
                  color: "text-red-500"
                }
              ].map((feature, index) => (
                <div 
                  key={feature.title}
                  className={`text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-primary-50 hover:to-primary-100 transition-all duration-500 hover-lift group ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${feature.color}`}>
                    <feature.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-700 dark:group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-gray-50 dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Browse Categories</h2>
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
        <section ref={listingsRef} className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`flex justify-between items-center mb-8 transition-all duration-1000 ${listingsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Listings</h2>
                <p className="text-lg text-gray-600">Discover popular items in your area</p>
              </div>
              <Link 
                to="/listings" 
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-2 hover-lift group"
              >
                <span>View All</span>
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
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
              {listings.map((listing, index) => (
                <div 
                  key={listing._id}
                  className={`transition-all duration-500 ${listingsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <ListingCard listing={listing} />
                </div>
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

        {/* Nearby Listings */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Nearby Listings</h2>
                <p className="text-lg text-gray-600">Based on your current location</p>
              </div>
              <Link 
                to="/listings" 
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-2 hover-lift group"
              >
                <span>Explore More</span>
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>

            {nearbyLoading ? (
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
            ) : nearbyListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {nearbyListings.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MapPinIcon className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No nearby listings</h3>
                <p className="text-gray-600">Try expanding your search distance or explore all listings.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaRef} className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl float"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl float-delayed"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className={`transition-all duration-1000 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-shimmer">Ready to Start Renting?</span>
              </h2>
              <p className="text-xl text-primary-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                Join thousands of users who are already earning money by renting out their items.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  to="/register" 
                  className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl btn-magnetic"
                >
                  Get Started
                </Link>
                <Link 
                  to="/listings/new" 
                  className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 hover-lift"
                >
                  List Your Item
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

export default HomePage
