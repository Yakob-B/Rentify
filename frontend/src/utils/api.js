import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,

})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Handle JSON by default; for FormData, let browser set boundary
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json'
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const register = (userData) => api.post('/auth/register', userData)
export const login = (credentials) => api.post('/auth/login', credentials)
export const getProfile = () => api.get('/auth/profile')
export const updateProfile = (userData) => api.put('/auth/profile', userData)
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email })
export const resetPassword = (token, password) => api.post('/auth/reset-password', { token, password })

// Categories API
export const getCategories = () => api.get('/categories')
export const getCategoryById = (id) => api.get(`/categories/${id}`)
export const createCategory = (categoryData) => api.post('/categories', categoryData)
export const updateCategory = (id, categoryData) => api.put(`/categories/${id}`, categoryData)
export const deleteCategory = (id) => api.delete(`/categories/${id}`)

// Listings API
export const getListings = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString()
  return api.get(`/listings${queryParams ? `?${queryParams}` : ''}`)
}
export const getListingById = (id) => api.get(`/listings/${id}`)
export const createListing = (listingData) => api.post('/listings', listingData)
export const updateListing = (id, listingData) => api.put(`/listings/${id}`, listingData)
export const deleteListing = (id) => api.delete(`/listings/${id}`)
export const getUserListings = () => api.get('/listings/user/my-listings')

// Nearby Listings API
export const getNearbyListings = ({ lat, lng, distance, limit } = {}) => {
  const params = new URLSearchParams()
  if (lat !== undefined) params.append('lat', lat)
  if (lng !== undefined) params.append('lng', lng)
  if (distance !== undefined) params.append('distance', distance)
  if (limit !== undefined) params.append('limit', limit)
  return api.get(`/listings/nearby${params.toString() ? `?${params.toString()}` : ''}`)
}

// Uploads
export const uploadListingImages = (files) => {
  const formData = new FormData()
  files.forEach((file) => formData.append('images', file))
  return api.post('/listings/upload', formData)
}

// Bookings API
export const createBooking = (bookingData) => api.post('/bookings', bookingData)
export const getUserBookings = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString()
  return api.get(`/bookings${queryParams ? `?${queryParams}` : ''}`)
}
export const getBookingById = (id) => api.get(`/bookings/${id}`)
export const updateBookingStatus = (id, statusData) => api.put(`/bookings/${id}/status`, statusData)
export const cancelBooking = (id, reason) => api.put(`/bookings/${id}/cancel`, { reason })
export const completeBooking = (id) => api.put(`/bookings/${id}/complete`)
export const getAllBookings = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString()
  return api.get(`/bookings/admin/all${queryParams ? `?${queryParams}` : ''}`)
}

// Reviews API
export const getListingReviews = (listingId) => api.get(`/reviews/listing/${listingId}`)
export const upsertReview = (listingId, review) => api.post(`/reviews/listing/${listingId}`, review)

// Payments API
export const createCheckoutSession = (bookingId) => api.post('/payments/checkout', { bookingId })

// Telebirr Payments API
export const initiateTelebirrPayment = (bookingId) => api.post('/payments/telebirr/initiate', { bookingId })
export const queryTelebirrPaymentStatus = (bookingId) => api.get(`/payments/telebirr/status/${bookingId}`)
export const refundTelebirrPayment = (bookingId, reason) => api.post('/payments/telebirr/refund', { bookingId, reason })

// Admin Stats API
export const getAdminStats = () => api.get('/admin/stats')

// Admin Invitation API
export const createAdminInvitation = (invitationData) => api.post('/admin/invitations', invitationData)
export const getAdminInvitations = () => api.get('/admin/invitations')
export const revokeAdminInvitation = (invitationId) => api.delete(`/admin/invitations/${invitationId}`)
export const registerAdmin = (adminData) => api.post('/admin/register-admin', adminData)
export const validateInvitationToken = (token) => api.get(`/admin/validate-invitation/${token}`)

// User Management API (Admin only)
export const getAllUsers = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString()
  return api.get(`/admin/users${queryParams ? `?${queryParams}` : ''}`)
}
export const getUserById = (id) => api.get(`/admin/users/${id}`)
export const updateUser = (id, userData) => api.put(`/admin/users/${id}`, userData)
export const deleteUser = (id) => api.delete(`/admin/users/${id}`)
export const suspendUser = (id, suspensionData) => api.put(`/admin/users/${id}/suspend`, suspensionData)
export const getUserAnalytics = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString()
  return api.get(`/admin/users/analytics${queryParams ? `?${queryParams}` : ''}`)
}

// Messages API
export const getOrCreateConversation = (data) => api.post('/messages/conversations', data)
export const getUserConversations = () => api.get('/messages/conversations')
export const getConversationById = (id) => api.get(`/messages/conversations/${id}`)
export const getConversationMessages = (id, params = {}) => {
  const queryParams = new URLSearchParams(params).toString()
  return api.get(`/messages/conversations/${id}/messages${queryParams ? `?${queryParams}` : ''}`)
}
export const sendMessage = (conversationId, content) => api.post(`/messages/conversations/${conversationId}/messages`, { content })
export const markConversationAsRead = (conversationId) => api.put(`/messages/conversations/${conversationId}/read`)

// Favorites API
export const addFavorite = (listingId) => api.post('/favorites', { listingId })
export const removeFavorite = (listingId) => api.delete(`/favorites/${listingId}`)
export const getUserFavorites = (params = {}) => {
  const queryParams = new URLSearchParams(params).toString()
  return api.get(`/favorites${queryParams ? `?${queryParams}` : ''}`)
}
export const checkFavorite = (listingId) => api.get(`/favorites/check/${listingId}`)
export const checkMultipleFavorites = (listingIds) => api.post('/favorites/check-multiple', { listingIds })

export default api
