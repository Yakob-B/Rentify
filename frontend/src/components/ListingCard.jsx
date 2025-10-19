import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPinIcon, 
  StarIcon, 
  EyeIcon,
  CalendarIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

const ListingCard = ({ listing }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const formatPrice = (price, unit) => {
    return `$${price}/${unit}`
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString()
  }

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  return (
    <div className="card-hover group relative overflow-hidden">
      <Link to={`/listings/${listing._id}`} className="block">
        <div className="relative overflow-hidden">
          <div className="relative">
            <img
              src={(listing.images && listing.images[0]) || '/placeholder-image.jpg'}
              alt={listing.title}
              className={`w-full h-48 object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Like button */}
            <button
              onClick={handleLike}
              className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 hover:scale-110 z-10"
            >
              {isLiked ? (
                <HeartIconSolid className="w-4 h-4 text-red-500" />
              ) : (
                <HeartIcon className="w-4 h-4 text-gray-600" />
              )}
            </button>

            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {listing.category?.name && (
                <span className="px-2 py-1 rounded-md text-xs font-medium bg-white/90 text-gray-800 backdrop-blur-sm group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                  {listing.category.name}
                </span>
              )}
              <span className={`px-2 py-1 rounded-md text-xs font-medium backdrop-blur-sm transition-all duration-300 ${
                listing.status === 'active' ? 'bg-green-100 text-green-800 group-hover:bg-green-500 group-hover:text-white' :
                listing.status === 'inactive' ? 'bg-gray-100 text-gray-800 group-hover:bg-gray-500 group-hover:text-white' :
                'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-500 group-hover:text-white'
              }`}>
                {listing.status || 'active'}
              </span>
            </div>
            
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex items-center gap-1 text-sm">
                <StarIconSolid className="w-4 h-4 text-yellow-400" />
                <span>{listing.rating?.average?.toFixed(1) || '0.0'} ({listing.rating?.count || 0})</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <EyeIcon className="w-4 h-4" />
                <span>{listing.views ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-700 transition-colors duration-300">
              {listing.title}
            </h3>
            <span className="shrink-0 px-3 py-1 rounded-lg text-sm font-bold bg-primary-50 text-primary-700 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
              {formatPrice(listing.price, listing.priceUnit)}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
            {listing.description}
          </p>
          
          <div className="flex items-center text-gray-500 text-sm group-hover:text-gray-700 transition-colors duration-300">
            <MapPinIcon className="w-4 h-4 mr-2 text-primary-500" />
            <span>{listing.location?.city || '—'}, {listing.location?.state || '—'}</span>
          </div>
          
          <div className="flex items-center text-gray-500 text-xs group-hover:text-gray-600 transition-colors duration-300">
            <CalendarIcon className="w-3 h-3 mr-2 text-primary-500" />
            <span>Available until {formatDate(listing.availability?.endDate)}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ListingCard
