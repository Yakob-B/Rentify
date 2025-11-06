import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/errors'
import { getUserFavorites, removeFavorite } from '../utils/api'
import ListingCard from '../components/ListingCard'
import { HeartIcon } from '@heroicons/react/24/solid'

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      const data = await getUserFavorites()
      setFavorites(data.favorites || [])
    } catch (error) {
      console.error('Error fetching favorites:', error)
      toast.error(getErrorMessage(error, 'Failed to load favorites'))
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (listingId) => {
    try {
      await removeFavorite(listingId)
      setFavorites(prev => prev.filter(listing => listing._id !== listingId))
      toast.success('Removed from favorites')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to remove favorite'))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <HeartIcon className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Favorites</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Your saved listings</p>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-12 text-center">
            <HeartIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No favorites yet</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Start exploring and save listings you like!</p>
            <Link
              to="/listings"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>Browse Listings</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((listing) => (
              <div key={listing._id} className="relative">
                <ListingCard listing={listing} />
                <button
                  onClick={() => handleRemoveFavorite(listing._id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-red-600 transition-all duration-300 hover:scale-110"
                  aria-label="Remove from favorites"
                >
                  <HeartIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FavoritesPage

