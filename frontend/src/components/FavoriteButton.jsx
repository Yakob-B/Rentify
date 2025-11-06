import React, { useState, useEffect } from 'react'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { addFavorite, removeFavorite, checkFavorite } from '../utils/api'
import { getErrorMessage } from '../utils/errors'
import toast from 'react-hot-toast'

const FavoriteButton = ({ listingId, className = '' }) => {
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    if (user && listingId) {
      checkFavoriteStatus()
    } else {
      setChecking(false)
    }
  }, [listingId, user])

  const checkFavoriteStatus = async () => {
    if (!user) {
      setChecking(false)
      return
    }

    try {
      const { isFavorited: favorited } = await checkFavorite(listingId)
      setIsFavorited(favorited)
    } catch (error) {
      console.error('Error checking favorite status:', error)
    } finally {
      setChecking(false)
    }
  }

  const handleToggleFavorite = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast.error('Please login to add favorites')
      return
    }

    setLoading(true)
    try {
      if (isFavorited) {
        await removeFavorite(listingId)
        setIsFavorited(false)
        toast.success('Removed from favorites')
      } else {
        await addFavorite(listingId)
        setIsFavorited(true)
        toast.success('Added to favorites')
      }
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to update favorite'))
    } finally {
      setLoading(false)
    }
  }

  if (!user || checking) {
    return null
  }

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 ${
        isFavorited
          ? 'bg-red-100 text-red-600 hover:bg-red-200'
          : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-600 shadow-md'
      } ${className}`}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorited ? (
        <HeartIconSolid className="w-5 h-5" />
      ) : (
        <HeartIcon className="w-5 h-5" />
      )}
    </button>
  )
}

export default FavoriteButton

