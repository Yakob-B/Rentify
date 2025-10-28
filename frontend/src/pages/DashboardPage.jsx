import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/errors'
import { 
  PlusIcon,
  EyeIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { getUserListings, getUserBookings, deleteListing, updateBookingStatus, cancelBooking, createCheckoutSession } from '../utils/api'

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [listings, setListings] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoadingId, setActionLoadingId] = useState(null)
  const [bookingView, setBookingView] = useState('owner') // 'owner' | 'renter'
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsData, bookingsData] = await Promise.all([
          getUserListings(),
          getUserBookings({ type: bookingView === 'owner' ? 'as-owner' : 'as-renter' })
        ])
        setListings(listingsData || [])
        setBookings(bookingsData || [])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast.error(getErrorMessage(error, 'Failed to load dashboard data'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user._id, bookingView])

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'listings', name: 'My Listings', icon: EyeIcon },
    { id: 'bookings', name: 'Bookings', icon: CalendarIcon },
  ]

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="p-2 bg-primary-100 rounded-lg">
            <EyeIcon className="w-6 h-6 text-primary-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Listings</p>
            <p className="text-2xl font-semibold text-gray-900">{listings.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg">
            <CalendarIcon className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Active Bookings</p>
            <p className="text-2xl font-semibold text-gray-900">
              {bookings.filter(b => b.status === 'approved').length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <CurrencyDollarIcon className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-semibold text-gray-900">
              ${bookings
                .filter(b => b.status === 'approved' || b.status === 'completed')
                .reduce((sum, b) => sum + b.totalAmount, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className="p-2 bg-blue-100 rounded-lg">
            <UserGroupIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pending Requests</p>
            <p className="text-2xl font-semibold text-gray-900">
              {bookings.filter(b => b.status === 'pending').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const handleDeleteListing = async (listingId) => {
    const confirmed = window.confirm('Delete this listing? This action cannot be undone.')
    if (!confirmed) return
    try {
      setActionLoadingId(listingId)
      await deleteListing(listingId)
      setListings(prev => prev.filter(l => l._id !== listingId))
      toast.success('Listing deleted')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to delete listing'))
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleApproveReject = async (bookingId, status) => {
    try {
      setActionLoadingId(bookingId)
      const updated = await updateBookingStatus(bookingId, { status })
      setBookings(prev => prev.map(b => (b._id === bookingId ? updated : b)))
      toast.success(status === 'approved' ? 'Booking approved' : 'Booking rejected')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Action failed'))
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    const reason = window.prompt('Reason for cancellation (optional):') || ''
    try {
      setActionLoadingId(bookingId)
      const updated = await cancelBooking(bookingId, reason)
      setBookings(prev => prev.map(b => (b._id === bookingId ? updated : b)))
      toast.success('Booking cancelled')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Cancel failed'))
    } finally {
      setActionLoadingId(null)
    }
  }

  const renderListings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">My Listings</h3>
        <Link
          to="/listings/new"
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Add New Listing</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={listing.images[0] || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="system-ui, sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ENo Image%3C/text%3E%3C/svg%3E'}
                  alt={listing.title}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{listing.title}</h4>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary-600">
                    ${listing.price}/{listing.priceUnit}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    listing.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {listing.status}
                  </span>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Link
                    to={`/listings/${listing._id}/edit`}
                    className="flex-1 btn-secondary text-center"
                  >
                    Edit
                  </Link>
                  <Link
                    to={`/listings/${listing._id}`}
                    className="flex-1 btn-outline text-center"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDeleteListing(listing._id)}
                    disabled={actionLoadingId === listing._id}
                    className="flex-1 btn-danger text-center disabled:opacity-50"
                  >
                    {actionLoadingId === listing._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <EyeIcon className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h3>
          <p className="text-gray-600 mb-6">Start earning by listing your items for rent.</p>
          <Link
            to="/listings/new"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Create Your First Listing</span>
          </Link>
        </div>
      )}
    </div>
  )

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Bookings</h3>
        <div className="inline-flex rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => setBookingView('owner')}
            className={`px-3 py-1 text-sm ${bookingView === 'owner' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}`}
          >
            As Owner
          </button>
          <button
            onClick={() => setBookingView('renter')}
            className={`px-3 py-1 text-sm ${bookingView === 'renter' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700'}`}
          >
            As Renter
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-900">{booking.listing.title}</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  booking.status === 'approved' 
                    ? 'bg-green-100 text-green-800'
                    : booking.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : booking.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Renter</p>
                  <p className="font-medium text-gray-900">{booking.renter.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Dates</p>
                  <p className="font-medium text-gray-900">
                    {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-medium text-gray-900">${booking.totalAmount}</p>
                </div>
              </div>
              
              {booking.message && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">Message</p>
                  <p className="text-gray-900">{booking.message}</p>
                </div>
              )}
              
                <div className="flex space-x-2">
                <Link
                  to={`/bookings/${booking._id}`}
                  className="btn-outline"
                >
                  View Details
                </Link>
                {bookingView === 'owner' && booking.status === 'pending' && user._id === booking.owner._id && (
                  <>
                    <button
                      onClick={() => handleApproveReject(booking._id, 'approved')}
                      disabled={actionLoadingId === booking._id}
                      className="btn-primary disabled:opacity-50"
                    >
                      {actionLoadingId === booking._id ? 'Approving...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleApproveReject(booking._id, 'rejected')}
                      disabled={actionLoadingId === booking._id}
                      className="btn-secondary disabled:opacity-50"
                    >
                      {actionLoadingId === booking._id ? 'Rejecting...' : 'Reject'}
                    </button>
                  </>
                )}
                {bookingView === 'renter' && user._id === booking.renter._id && (
                  <>
                    {booking.status === 'approved' && booking.paymentStatus !== 'paid' && (
                      <button
                        onClick={async () => {
                          try {
                            setActionLoadingId(booking._id)
                            const { url } = await createCheckoutSession(booking._id)
                            window.location.href = url
                          } catch (err) {
                            toast.error(getErrorMessage(err, 'Failed to start checkout'))
                          } finally {
                            setActionLoadingId(null)
                          }
                        }}
                        disabled={actionLoadingId === booking._id}
                        className="btn-primary disabled:opacity-50"
                      >
                        {actionLoadingId === booking._id ? 'Redirecting...' : 'Pay Now'}
                      </button>
                    )}
                    {!['cancelled', 'completed'].includes(booking.status) && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={actionLoadingId === booking._id}
                        className="btn-danger disabled:opacity-50"
                      >
                        {actionLoadingId === booking._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <CalendarIcon className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings yet</h3>
          <p className="text-gray-600">Your booking requests will appear here.</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'listings' && renderListings()}
          {activeTab === 'bookings' && renderBookings()}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
