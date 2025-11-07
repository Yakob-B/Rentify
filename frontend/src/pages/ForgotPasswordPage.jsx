import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { forgotPassword } from '../utils/api'
import { getErrorMessage } from '../utils/errors'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await forgotPassword(email)
      setEmailSent(true)
      toast.success('If an account exists, a password reset link has been sent to your email.')
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to send reset email'))
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Check Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            We've sent a password reset link to <strong>{email}</strong>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-black py-8 px-4 shadow sm:rounded-lg sm:px-10 border dark:border-gray-800">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900">
                <EnvelopeIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                Email Sent!
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Click the link in the email to reset your password. The link will expire in 1 hour.
              </p>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={() => setEmailSent(false)}
                  className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  try again
                </button>
              </p>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">R</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Forgot your password?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          No worries! Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-black py-8 px-4 shadow sm:rounded-lg sm:px-10 border dark:border-gray-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex justify-center items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <EnvelopeIcon className="h-5 w-5" />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center text-sm">
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage

