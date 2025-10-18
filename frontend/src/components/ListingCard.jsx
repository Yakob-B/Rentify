import React from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPinIcon, 
  StarIcon, 
  EyeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

const ListingCard = ({ listing }) => {
  const formatPrice = (price, unit) => {
    return `$${price}/${unit}`
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="card hover:shadow-md transition-all duration-200">
      <Link to={`/listings/${listing._id}`} className="block">
        <div className="relative">
          <img
            src={(listing.images && listing.images[0]) || '/placeholder-image.jpg'}
            alt={listing.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {listing.category?.name && (
              <span className="px-2 py-1 rounded-md text-xs font-medium bg-white/90 text-gray-800">
                {listing.category.name}
              </span>
            )}
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
              listing.status === 'active' ? 'bg-green-100 text-green-800' :
              listing.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {listing.status || 'active'}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
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

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {listing.title}
            </h3>
            <span className="shrink-0 px-2 py-1 rounded-md text-xs font-medium bg-primary-50 text-primary-700">
              {formatPrice(listing.price, listing.priceUnit)}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {listing.description}
          </p>
          
          <div className="flex items-center text-gray-500 text-sm mb-3">
            <MapPinIcon className="w-4 h-4 mr-1" />
            <span>{listing.location?.city || '—'}, {listing.location?.state || '—'}</span>
          </div>
          
          <div className="flex items-center text-gray-500 text-xs mt-2">
            <CalendarIcon className="w-3 h-3 mr-1" />
            <span>Available until {formatDate(listing.availability?.endDate)}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ListingCard
