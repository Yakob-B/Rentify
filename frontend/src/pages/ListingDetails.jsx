import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getListingById, getListingReviews, upsertReview } from '../utils/api'
import { getErrorMessage } from '../utils/errors'
import Skeleton from '../components/Skeleton'
import { MapPinIcon, StarIcon } from '@heroicons/react/24/outline'

const ListingDetails = () => {
  const { id } = useParams()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [reviewLoading, setReviewLoading] = useState(false)
  const [myRating, setMyRating] = useState(0)
  const [myComment, setMyComment] = useState('')

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const data = await getListingById(id)
        setListing(data)
        try {
          const revs = await getListingReviews(id)
          setReviews(revs)
        } catch (err) {
          // non-blocking
        }
      } catch (e) {
        setListing(null)
        toast.error(getErrorMessage(e, 'Failed to load listing'))
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [id])

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!myRating) {
      toast.error('Please select a rating')
      return
    }
    setReviewLoading(true)
    try {
      const created = await upsertReview(id, { rating: Number(myRating), comment: myComment })
      // Update local list (replace if same reviewer exists)
      setReviews(prev => {
        const idx = prev.findIndex(r => r.reviewer?._id === created.reviewer?._id)
        if (idx >= 0) {
          const copy = [...prev]
          copy[idx] = created
          return copy
        }
        return [created, ...prev]
      })
      toast.success('Review submitted')
      setMyComment('')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to submit review'))
    } finally {
      setReviewLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Skeleton className="h-64 w-full mb-4" />
        <Skeleton className="h-8 w-2/3 mb-2" />
        <Skeleton className="h-5 w-1/2 mb-6" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center">
        <p className="text-gray-600">Listing not found.</p>
        <Link to="/listings" className="btn-primary mt-4 inline-block">Back to listings</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <img
            src={listing.images?.[0] || '/placeholder-image.jpg'}
            alt={listing.title}
            className="w-full h-80 object-cover"
          />
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
                <div className="mt-2 flex items-center gap-3 text-gray-600">
                  <span className="inline-flex items-center gap-1">
                    <MapPinIcon className="w-4 h-4" />
                    {listing.location?.city}, {listing.location?.state}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <StarIcon className="w-4 h-4" />
                    {listing.rating?.average?.toFixed(1) || '0.0'} ({listing.rating?.count || 0})
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary-600">
                  ${listing.price}/{listing.priceUnit}
                </div>
                <Link to={`/bookings/${listing._id}`} className="btn-primary mt-3 inline-block">Request Booking</Link>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700 leading-relaxed">{listing.description}</p>

                {listing.features?.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {listing.features.map((f, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">{f}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Availability</h3>
                  <p className="text-gray-700">
                    From {new Date(listing.availability?.startDate).toLocaleDateString()} to {new Date(listing.availability?.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Reviews */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mt-6 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews ({reviews.length})</h3>
          {reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r._id} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full" />
                      <div>
                        <p className="font-medium text-gray-900">{r.reviewer?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-yellow-500 font-semibold">{r.rating} / 5</div>
                  </div>
                  {r.comment && <p className="mt-2 text-gray-700">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Submit review (only if not owner) */}
          {listing?.owner && JSON.parse(localStorage.getItem('user') || 'null')?.role && (
            <form onSubmit={handleSubmitReview} className="mt-6 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select value={myRating} onChange={(e) => setMyRating(e.target.value)} className="input-field" required>
                  <option value="">Rate this listing</option>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Terrible</option>
                </select>
                <input
                  value={myComment}
                  onChange={(e) => setMyComment(e.target.value)}
                  placeholder="Optional comment"
                  className="input-field md:col-span-2"
                />
              </div>
              <div>
                <button disabled={reviewLoading} className="btn-primary disabled:opacity-50">
                  {reviewLoading ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ListingDetails


