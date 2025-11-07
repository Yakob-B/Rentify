import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { resetPassword } from '../utils/api'
import { getErrorMessage } from '../utils/errors'

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasNumber: false,
    hasLetter: false
  })

  useEffect(() => {
    if (!token) {
      toast.error('Invalid reset token. Please request a new password reset.')
      navigate('/forgot-password')
    }
  }, [token, navigate])

  useEffect(() => {
    // Check password requirements
    setPasswordRequirements({
      minLength: formData.password.length >= 6,
      hasNumber: /\d/.test(formData.password),
      hasLetter: /[a-zA-Z]/.test(formData.password)
    })
  }, [formData.password])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!token) {
      toast.error('Invalid reset token')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setLoading(true)

    try {
      await resetPassword(token, formData.password)
      setSuccess(true)
      toast.success('Password reset successful! Redirecting to login...')
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to reset password'))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
            Password Reset Successful!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Your password has been reset. You can now login with your new password.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-black py-8 px-4 shadow sm:rounded-lg sm:px-10 border dark:border-gray-800">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Redirecting to login page...
              </p>
              <Link
                to="/login"
                className="w-full flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!token) {
    return null
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
          Reset Your Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          Enter your new password below
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-black py-8 px-4 shadow sm:rounded-lg sm:px-10 border dark:border-gray-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-white">
                New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pr-10 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              
              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className={`flex items-center text-xs ${passwordRequirements.minLength ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {passwordRequirements.minLength ? (
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircleIcon className="h-4 w-4 mr-1" />
                    )}
                    At least 6 characters
                  </div>
                  <div className={`flex items-center text-xs ${passwordRequirements.hasLetter ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {passwordRequirements.hasLetter ? (
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircleIcon className="h-4 w-4 mr-1" />
                    )}
                    Contains a letter
                  </div>
                  <div className={`flex items-center text-xs ${passwordRequirements.hasNumber ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {passwordRequirements.hasNumber ? (
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <XCircleIcon className="h-4 w-4 mr-1" />
                    )}
                    Contains a number
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-white">
                Confirm New Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input-field pr-10 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  Passwords do not match
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || formData.password !== formData.confirmPassword || !passwordRequirements.minLength}
                className="w-full btn-primary flex justify-center items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Resetting...</span>
                  </>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="text-center text-sm">
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage

