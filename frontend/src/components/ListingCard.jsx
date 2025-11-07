import React from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPinIcon, 
  StarIcon, 
  EyeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import FavoriteButton from './FavoriteButton'
import LazyImage from './LazyImage'

const ListingCard = ({ listing }) => {
  // Validate listing and ID
  if (!listing || !listing._id) {
    return null
  }

  const formatPrice = (price, unit) => {
    return `$${price}/${unit}`
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="card-hover group relative overflow-hidden">
      <Link to={`/listings/${listing._id}`} className="block">
        <div className="relative overflow-hidden">
          <div className="relative h-48">
            <LazyImage
              src={listing.images && listing.images[0]}
              alt={listing.title}
              className="w-full h-full group-hover:scale-110 transition-transform duration-500"
              placeholder='data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3C/svg%3E'
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            
            {/* Favorite button */}
            <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
              <FavoriteButton listingId={listing._id} />
            </div>

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

        <div className="p-4 space-y-3 bg-white dark:bg-black">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-primary-700 dark:group-hover:text-white transition-colors duration-300">
              {listing.title}
            </h3>
            <span className="shrink-0 px-3 py-1 rounded-lg text-sm font-bold bg-primary-50 dark:bg-gray-900 text-primary-700 dark:text-white group-hover:bg-primary-500 dark:group-hover:bg-white dark:group-hover:text-black group-hover:text-white transition-all duration-300 border dark:border-gray-800">
              {formatPrice(listing.price, listing.priceUnit)}
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-white transition-colors duration-300">
            {listing.description}
          </p>
          
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm group-hover:text-gray-700 dark:group-hover:text-white transition-colors duration-300">
            <MapPinIcon className="w-4 h-4 mr-2 text-primary-500 dark:text-white" />
            <span>{listing.location?.city || '—'}, {listing.location?.state || '—'}</span>
          </div>
          
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300">
            <CalendarIcon className="w-3 h-3 mr-2 text-primary-500 dark:text-white" />
            <span>Available until {formatDate(listing.availability?.endDate)}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ListingCard
