import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/errors'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../utils/api'
import { 
  UsersIcon,
  EyeIcon,
  CalendarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
  ClipboardDocumentIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline'
import { getAllBookings, createAdminInvitation, getAdminInvitations, resendAdminInvitation, revokeAdminInvitation, updateBookingStatus, getAdminStats } from '../utils/api'
import UserManagement from '../components/UserManagement'

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalListings: 0,
    totalBookings: 0,
    pendingBookings: 0,
    activeBookings: 0,
    completedBookings: 0
  })

  // Admin invitations state
  const [invitations, setInvitations] = useState([])
  const [loadingInvites, setLoadingInvites] = useState(true)
  const [invitationForm, setInvitationForm] = useState({ name: '', email: '' })
  const [savingInvitation, setSavingInvitation] = useState(false)

  // Categories state
  const [categories, setCategories] = useState([])
  const [loadingCats, setLoadingCats] = useState(true)
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', icon: '', image: '' })
  const [editingId, setEditingId] = useState(null)
  const [savingCategory, setSavingCategory] = useState(false)

  // Booking modals state
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [processingBooking, setProcessingBooking] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsData, statsData] = await Promise.all([
          getAllBookings(),
          getAdminStats()
        ])
        setBookings(bookingsData.bookings || [])
        setStats({
          totalUsers: statsData.totalUsers || 0,
          totalListings: statsData.totalListings || 0,
          totalBookings: statsData.totalBookings || 0,
          pendingBookings: statsData.pendingBookings || 0,
          activeBookings: statsData.activeBookings || 0,
          completedBookings: statsData.completedBookings || 0
        })
      } catch (error) {
        console.error('Error fetching admin data:', error)
        toast.error(getErrorMessage(error, 'Failed to load admin statistics'))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Load admin invitations
  useEffect(() => {
    const loadInvitations = async () => {
      try {
        const data = await getAdminInvitations()
        setInvitations(data)
      } catch (e) {
        toast.error(getErrorMessage(e, 'Failed to load invitations'))
      } finally {
        setLoadingInvites(false)
      }
    }
    loadInvitations()
  }, [])

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (e) {
        toast.error(getErrorMessage(e, 'Failed to load categories'))
      } finally {
        setLoadingCats(false)
      }
    }
    loadCategories()
  }, [])

  // Admin invitation functions
  const handleInvitationSubmit = async (e) => {
    e.preventDefault()
    setSavingInvitation(true)
    try {
      const response = await createAdminInvitation(invitationForm)
      setInvitations(prev => [response.invitation, ...prev])
      
      if (response.emailSent) {
        toast.success('Admin invitation created and email sent successfully!')
      } else {
        toast.error(
          response.emailError || 'Email could not be sent. Please share the invitation link manually.',
          { duration: 6000 }
        )
        console.warn('Email sending failed:', response.emailError)
        console.log('Invitation URL:', response.invitation.invitationUrl)
      }
      
      setInvitationForm({ name: '', email: '' })
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to send invitation'))
    } finally {
      setSavingInvitation(false)
    }
  }

  const handleResendInvitation = async (id) => {
    try {
      const response = await resendAdminInvitation(id)
      toast.success('Invitation email resent successfully!')
    } catch (err) {
      const errorMessage = getErrorMessage(err, 'Failed to resend invitation')
      toast.error(errorMessage, { duration: 6000 })
      
      // If email config error, show helpful message
      if (err.response?.data?.message?.includes('not configured')) {
        console.error('Email configuration error. Please check EMAIL_USER and EMAIL_PASSWORD environment variables.')
      }
    }
  }

  const handleCopyInvitationLink = (token) => {
    const invitationUrl = `${window.location.origin}/admin/register/${token}`
    navigator.clipboard.writeText(invitationUrl).then(() => {
      toast.success('Invitation link copied to clipboard!')
    }).catch(() => {
      toast.error('Failed to copy link')
    })
  }

  const handleRevokeInvitation = async (id) => {
    if (!window.confirm('Revoke this invitation?')) return
    try {
      await revokeAdminInvitation(id)
      setInvitations(prev => prev.map(inv => 
        inv._id === id ? { ...inv, status: 'revoked' } : inv
      ))
      toast.success('Invitation revoked')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to revoke invitation'))
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
      case 'used': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
      case 'expired': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
      case 'revoked': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
    }
  }

  // Category functions
  const resetCategoryForm = () => {
    setCategoryForm({ name: '', description: '', icon: '', image: '' })
    setEditingId(null)
  }

  const handleCategorySubmit = async (e) => {
    e.preventDefault()
    setSavingCategory(true)
    try {
      if (editingId) {
        const updated = await updateCategory(editingId, categoryForm)
        setCategories(prev => prev.map(c => (c._id === editingId ? updated : c)))
        toast.success('Category updated')
      } else {
        const created = await createCategory(categoryForm)
        setCategories(prev => [created, ...prev])
        toast.success('Category created')
      }
      resetCategoryForm()
    } catch (err) {
      toast.error(getErrorMessage(err, 'Save failed'))
    } finally {
      setSavingCategory(false)
    }
  }

  const handleCategoryEdit = (cat) => {
    setEditingId(cat._id)
    setCategoryForm({ name: cat.name, description: cat.description, icon: cat.icon || '', image: cat.image || '' })
  }

  const handleCategoryDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return
    try {
      await deleteCategory(id)
      setCategories(prev => prev.filter(c => c._id !== id))
      toast.success('Category deleted')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Delete failed'))
    }
  }

  // Booking action handlers
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking)
    setShowBookingModal(true)
  }

  const handleApproveBooking = async (bookingId) => {
    if (!window.confirm('Approve this booking?')) return
    setProcessingBooking(true)
    try {
      await updateBookingStatus(bookingId, { status: 'approved' })
      const bookingsData = await getAllBookings()
      setBookings(bookingsData.bookings || [])
      toast.success('Booking approved successfully')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to approve booking'))
    } finally {
      setProcessingBooking(false)
    }
  }

  const handleRejectBooking = (booking) => {
    setSelectedBooking(booking)
    setRejectReason('')
    setShowRejectModal(true)
  }

  const handleRejectConfirm = async () => {
    if (!selectedBooking) return
    setProcessingBooking(true)
    try {
      await updateBookingStatus(selectedBooking._id, { 
        status: 'rejected',
        message: rejectReason 
      })
      const bookingsData = await getAllBookings()
      setBookings(bookingsData.bookings || [])
      toast.success('Booking rejected')
      setShowRejectModal(false)
      setSelectedBooking(null)
      setRejectReason('')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to reject booking'))
    } finally {
      setProcessingBooking(false)
    }
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'bookings', name: 'Bookings', icon: CalendarIcon },
    { id: 'users', name: 'Users', icon: UsersIcon },
    { id: 'invitations', name: 'Admin Invitations', icon: UsersIcon },
    { id: 'categories', name: 'Categories', icon: EyeIcon },
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <EyeIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Listings</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalListings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CalendarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircleIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeBookings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <XCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Bookings</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completedBookings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-sm text-gray-600">
                    New user <span className="font-medium text-gray-900">John Doe</span> registered
                  </p>
                  <span className="text-xs text-gray-500 ml-auto">2 minutes ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <p className="text-sm text-gray-600">
                    New listing <span className="font-medium text-gray-900">"Vintage Camera"</span> created
                  </p>
                  <span className="text-xs text-gray-500 ml-auto">15 minutes ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <p className="text-sm text-gray-600">
                    Booking request pending for <span className="font-medium text-gray-900">"Mountain Bike"</span>
                  </p>
                  <span className="text-xs text-gray-500 ml-auto">1 hour ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-sm text-gray-600">
                    Booking approved for <span className="font-medium text-gray-900">"Party Tent"</span>
                  </p>
                  <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                  <p className="text-sm text-gray-600">
                    Listing <span className="font-medium text-gray-900">"Old Furniture"</span> reported
                  </p>
                  <span className="text-xs text-gray-500 ml-auto">3 hours ago</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Listing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Renter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-6 py-4 whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.listing.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.renter.name}</div>
                      <div className="text-sm text-gray-500">{booking.renter.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.owner.name}</div>
                      <div className="text-sm text-gray-500">{booking.owner.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.startDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        to {new Date(booking.endDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${booking.totalAmount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewBooking(booking)}
                        className="text-primary-600 hover:text-primary-900 mr-3 transition-colors"
                      >
                        View
                      </button>
                      {booking.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApproveBooking(booking._id)}
                            disabled={processingBooking}
                            className="text-green-600 hover:text-green-900 mr-3 transition-colors disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleRejectBooking(booking)}
                            disabled={processingBooking}
                            className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderUsers = () => (
    <UserManagement />
  )

  const renderAdminInvitations = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Send Admin Invitation</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Invite a new administrator to join your platform. An email will be sent automatically.
            </p>
          </div>
          <div className="p-6">
            <form onSubmit={handleInvitationSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                value={invitationForm.name}
                onChange={(e) => setInvitationForm({ ...invitationForm, name: e.target.value })}
                placeholder="Full Name"
                required
                className="input-field dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              />
              <input
                value={invitationForm.email}
                onChange={(e) => setInvitationForm({ ...invitationForm, email: e.target.value })}
                placeholder="Email Address"
                type="email"
                required
                className="input-field dark:bg-gray-900 dark:border-gray-700 dark:text-white"
              />
              <button 
                type="submit" 
                disabled={savingInvitation} 
                className="btn-primary whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingInvitation ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <PaperAirplaneIcon className="w-4 h-4" />
                    <span>Send Invitation</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Invitations</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {invitations.length} invitation{invitations.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invited By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expires</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
                {loadingInvites ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Loading...</td>
                  </tr>
                ) : invitations.length ? (
                  invitations.map((inv) => {
                    const isExpired = new Date(inv.expiresAt) < new Date()
                    const invitationUrl = `${window.location.origin}/admin/register/${inv.token}`
                    
                    return (
                      <tr key={inv._id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{inv.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{inv.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(inv.status)}`}>
                            {inv.status}
                            {isExpired && inv.status === 'pending' && ' (Expired)'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{inv.invitedBy?.name || '—'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {new Date(inv.expiresAt).toLocaleDateString()}
                          {isExpired && inv.status === 'pending' && (
                            <span className="ml-1 text-red-500 text-xs">(Expired)</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {inv.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopyInvitationLink(inv.token)}
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                title="Copy invitation link"
                              >
                                <ClipboardDocumentIcon className="w-4 h-4" />
                                Copy Link
                              </button>
                              <button
                                onClick={() => handleResendInvitation(inv._id)}
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
                                title="Resend invitation email"
                              >
                                <PaperAirplaneIcon className="w-4 h-4" />
                                Resend
                              </button>
                              <button
                                onClick={() => handleRevokeInvitation(inv._id)}
                                className="inline-flex items-center gap-1 px-3 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                                title="Revoke invitation"
                              >
                                Revoke
                              </button>
                            </div>
                          )}
                          {inv.status === 'used' && inv.usedBy && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Used by {inv.usedBy.name || 'Admin'}
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No invitations yet. Send your first invitation above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderCategories = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
          </div>
          <div className="p-6">
            <form onSubmit={handleCategorySubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <input
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                placeholder="Name"
                required
                className="input-field"
              />
              <input
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                placeholder="Description"
                required
                className="input-field"
              />
              <input
                value={categoryForm.icon}
                onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                placeholder="Icon (emoji or class)"
                className="input-field"
              />
              <div className="flex space-x-2">
                <input
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  placeholder="Image URL"
                  className="input-field flex-1"
                />
                <button type="submit" disabled={savingCategory} className="btn-primary whitespace-nowrap disabled:opacity-50">
                  {savingCategory ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update' : 'Create')}
                </button>
                {editingId && (
                  <button type="button" onClick={resetCategoryForm} className="btn-secondary whitespace-nowrap">Cancel</button>
                )}
              </div>
            </form>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icon</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loadingCats ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4">Loading...</td>
                    </tr>
                  ) : categories.length ? (
                    categories.map((cat) => (
                      <tr key={cat._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cat.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{cat.icon}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {cat.image ? <img src={cat.image} alt={cat.name} className="h-10 w-16 object-cover rounded" /> : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                          <button onClick={() => handleCategoryEdit(cat)} className="text-primary-600 hover:text-primary-900">Edit</button>
                          <button onClick={() => handleCategoryDelete(cat._id)} className="text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No categories</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Booking View Modal
  const renderBookingModal = () => {
    if (!selectedBooking) return null
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Booking Details</h3>
            <button
              onClick={() => setShowBookingModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Listing Info */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Listing</h4>
              <p className="text-gray-700">{selectedBooking.listing.title}</p>
              {selectedBooking.listing.images?.[0] && (
                <img 
                  src={selectedBooking.listing.images[0]} 
                  alt={selectedBooking.listing.title}
                  className="mt-2 w-full h-48 object-cover rounded-lg"
                />
              )}
            </div>

            {/* Renter Info */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Renter</h4>
              <p className="text-gray-700">{selectedBooking.renter.name}</p>
              <p className="text-gray-600 text-sm">{selectedBooking.renter.email}</p>
              {selectedBooking.renter.phone && (
                <p className="text-gray-600 text-sm">{selectedBooking.renter.phone}</p>
              )}
            </div>

            {/* Owner Info */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Owner</h4>
              <p className="text-gray-700">{selectedBooking.owner.name}</p>
              <p className="text-gray-600 text-sm">{selectedBooking.owner.email}</p>
              {selectedBooking.owner.phone && (
                <p className="text-gray-600 text-sm">{selectedBooking.owner.phone}</p>
              )}
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Start Date</h4>
                <p className="text-gray-700">{new Date(selectedBooking.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">End Date</h4>
                <p className="text-gray-700">{new Date(selectedBooking.endDate).toLocaleDateString()}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Total Days</h4>
                <p className="text-gray-700">{selectedBooking.totalDays}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Total Amount</h4>
                <p className="text-gray-700 font-semibold">${selectedBooking.totalAmount}</p>
              </div>
            </div>

            {/* Status */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Status</h4>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                selectedBooking.status === 'approved' 
                  ? 'bg-green-100 text-green-800'
                  : selectedBooking.status === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : selectedBooking.status === 'rejected'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {selectedBooking.status}
              </span>
            </div>

            {/* Renter Message */}
            {selectedBooking.message && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Renter Message</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedBooking.message}</p>
              </div>
            )}

            {/* Owner Response */}
            {selectedBooking.ownerResponse?.message && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Owner Response</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedBooking.ownerResponse.message}</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => setShowBookingModal(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Reject Booking Modal
  const renderRejectModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Reject Booking</h3>
        </div>
        
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to reject this booking? You can provide a reason below.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
            placeholder="Reason for rejection (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={() => setShowRejectModal(false)}
            disabled={processingBooking}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleRejectConfirm}
            disabled={processingBooking}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {processingBooking ? 'Rejecting...' : 'Reject Booking'}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage your Rentify platform</p>
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
          {activeTab === 'bookings' && renderBookings()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'invitations' && renderAdminInvitations()}
          {activeTab === 'categories' && renderCategories()}
        </div>
      </div>

      {/* Modals */}
      {showBookingModal && renderBookingModal()}
      {showRejectModal && renderRejectModal()}
    </div>
  )
}

export default AdminPanel
