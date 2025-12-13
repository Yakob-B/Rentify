import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { login } from '../utils/api'
import { getErrorMessage } from '../utils/errors'

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await login(formData)

      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response))

      toast.success('Login successful!')

      if (response.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error(getErrorMessage(error, 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
      <div className="flex w-full max-w-5xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden min-h-[600px]">
        {/* Left Side - Illustration */}
        <div className="hidden md:flex w-1/2 bg-emerald-500 relative flex-col items-center justify-center p-12">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-64 h-64 rounded-full bg-emerald-400 opacity-30 blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 rounded-full bg-emerald-600 opacity-30 blur-3xl"></div>
          </div>

          <div className="relative z-10 w-full max-w-sm">
            <img
              src="/login-hero.png"
              alt="Login Illustration"
              className="w-full h-auto drop-shadow-xl transform hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="relative z-10 mt-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
            <p className="text-emerald-100">Access your dashboard to manage your rentals seamlessly.</p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-gray-900 relative">

          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
              <UserIcon className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-wider">WELCOME</h2>
          </div>

          <form className="space-y-6 w-full max-w-sm mx-auto" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Username/Email Input */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1 group-focus-within:text-emerald-500 transition-colors">
                  Username
                </label>
                <div className="relative flex items-center border-b-2 border-gray-300 dark:border-gray-700 group-focus-within:border-emerald-500 transition-colors py-2">
                  <UserIcon className="h-5 w-5 text-emerald-500 mr-3" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none bg-transparent border-none w-full text-gray-700 dark:text-gray-200 mr-3 py-1 px-2 leading-tight focus:outline-none font-bold placeholder-gray-400"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 ml-1 group-focus-within:text-emerald-500 transition-colors">
                  Password
                </label>
                <div className="relative flex items-center border-b-2 border-gray-300 dark:border-gray-700 group-focus-within:border-emerald-500 transition-colors py-2">
                  <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors mr-3" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none bg-transparent border-none w-full text-gray-700 dark:text-gray-200 mr-3 py-1 px-2 leading-tight focus:outline-none font-bold placeholder-gray-400"
                    placeholder="Enter your password"
                  />
                  {/* Forgot Password Link inside container or below? Ref suggests below. */}
                </div>
              </div>
            </div>

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-gray-400 hover:text-emerald-500 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-emerald-400 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-emerald-500 hover:text-emerald-600">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

