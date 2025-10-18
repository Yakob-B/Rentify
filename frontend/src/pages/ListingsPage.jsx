import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getCategories, getListings } from '../utils/api'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/errors'
import ListingCard from '../components/ListingCard'
import Skeleton from '../components/Skeleton'

const ListingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [categories, setCategories] = useState([])
  const [listings, setListings] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const page = Number(searchParams.get('page') || 1)
  const category = searchParams.get('category') || ''
  const location = searchParams.get('location') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

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
        const data = await getListings({ page, category, location, minPrice, maxPrice, limit: 12 })
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
  }, [page, category, location, minPrice, maxPrice])

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

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
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
            <button
              onClick={() => {
                const next = new URLSearchParams()
                setSearchParams(next)
              }}
              className="btn-secondary"
            >
              Reset
            </button>
          </div>
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


