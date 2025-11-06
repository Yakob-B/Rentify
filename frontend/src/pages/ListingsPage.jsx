import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getCategories, getListings } from '../utils/api'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/errors'
import ListingCard from '../components/ListingCard'
import Skeleton from '../components/Skeleton'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const ListingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [listings, setListings] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const page = Number(searchParams.get('page') || 1)
  const category = searchParams.get('category') || ''
  const location = searchParams.get('location') || ''
  const search = searchParams.get('search') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''
  const minRating = searchParams.get('minRating') || ''
  const priceUnit = searchParams.get('priceUnit') || ''
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const sortOrder = searchParams.get('sortOrder') || 'desc'

  useEffect(() => {
    const fetchBase = async () => {
      try {
        const [cats] = await Promise.all([
          getCategories()
        ])
        setCategories(cats)
      } catch (e) {
        toast.error(getErrorMessage(e, 'Failed to load categories'))
      }
    }
    fetchBase()
  }, [])

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      try {
        const params = {
          page,
          category,
          location,
          search,
          minPrice,
          maxPrice,
          startDate,
          endDate,
          minRating,
          priceUnit,
          sortBy,
          sortOrder,
          limit: 12
        }
        // Remove empty params
        Object.keys(params).forEach(key => {
          if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key]
          }
        })
        const data = await getListings(params)
        setListings(data.listings || [])
        setTotalPages(data.totalPages || 1)
      } catch (e) {
        setListings([])
        toast.error(getErrorMessage(e, 'Failed to load listings'))
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [page, category, location, search, minPrice, maxPrice, startDate, endDate, minRating, priceUnit, sortBy, sortOrder])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    next.set('page', '1')
    setSearchParams(next)
  }

  const changePage = (p) => {
    const next = new URLSearchParams(searchParams)
    next.set('page', String(p))
    setSearchParams(next)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Browse Listings</h1>
          <p className="text-gray-600">Find items by category, price and location.</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 space-y-4">
          {/* Main Search Bar */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search listings by title or description..."
              value={search}
              onChange={(e) => updateParam('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Basic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select
              value={category}
              onChange={(e) => updateParam('category', e.target.value)}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
            <input
              placeholder="Location (city/state)"
              value={location}
              onChange={(e) => updateParam('location', e.target.value)}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => updateParam('minPrice', e.target.value)}
              className="input-field"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => updateParam('maxPrice', e.target.value)}
              className="input-field"
            />
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>{showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters</span>
            </button>
            <button
              onClick={() => {
                const next = new URLSearchParams()
                setSearchParams(next)
                setShowAdvancedFilters(false)
              }}
              className="btn-secondary text-sm"
            >
              Reset All
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="border-t border-gray-200 pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => updateParam('startDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => updateParam('endDate', e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
                  <select
                    value={minRating}
                    onChange={(e) => updateParam('minRating', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="1">1+ Stars</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Unit</label>
                  <select
                    value={priceUnit}
                    onChange={(e) => updateParam('priceUnit', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Any Unit</option>
                    <option value="hour">Per Hour</option>
                    <option value="day">Per Day</option>
                    <option value="week">Per Week</option>
                    <option value="month">Per Month</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => updateParam('sortBy', e.target.value)}
                    className="input-field"
                  >
                    <option value="createdAt">Date Added</option>
                    <option value="price">Price</option>
                    <option value="rating.average">Rating</option>
                    <option value="views">Views</option>
                    <option value="title">Title</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => updateParam('sortOrder', e.target.value)}
                    className="input-field"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {(category || location || search || minPrice || maxPrice || startDate || endDate || minRating || priceUnit) && (
            <div className="border-t border-gray-200 pt-4">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                {search && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                    Search: {search}
                    <button
                      onClick={() => updateParam('search', '')}
                      className="ml-2 hover:text-primary-600"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {category && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                    Category: {categories.find(c => c._id === category)?.name || category}
                    <button
                      onClick={() => updateParam('category', '')}
                      className="ml-2 hover:text-primary-600"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {location && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                    Location: {location}
                    <button
                      onClick={() => updateParam('location', '')}
                      className="ml-2 hover:text-primary-600"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {(minPrice || maxPrice) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                    Price: ${minPrice || '0'} - ${maxPrice || '∞'}
                    <button
                      onClick={() => {
                        updateParam('minPrice', '')
                        updateParam('maxPrice', '')
                      }}
                      className="ml-2 hover:text-primary-600"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {(startDate || endDate) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                    Dates: {startDate || 'Any'} - {endDate || 'Any'}
                    <button
                      onClick={() => {
                        updateParam('startDate', '')
                        updateParam('endDate', '')
                      }}
                      className="ml-2 hover:text-primary-600"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {minRating && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                    Rating: {minRating}+
                    <button
                      onClick={() => updateParam('minRating', '')}
                      className="ml-2 hover:text-primary-600"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {priceUnit && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                    Unit: {priceUnit}
                    <button
                      onClick={() => updateParam('priceUnit', '')}
                      className="ml-2 hover:text-primary-600"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card">
                <Skeleton className="w-full h-48" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map(l => (
              <ListingCard key={l._id} listing={l} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600">No listings found. Try different filters.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              disabled={page <= 1}
              onClick={() => changePage(page - 1)}
              className="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <div className="px-4 py-2 text-sm text-gray-700">
              Page {page} of {totalPages}
            </div>
            <button
              disabled={page >= totalPages}
              onClick={() => changePage(page + 1)}
              className="btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ListingsPage


