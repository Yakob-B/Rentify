import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import { register } from '../utils/api'
import { getErrorMessage } from '../utils/errors'

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '', // Added username field if needed, otherwise name maps to it? Original didn't have username, but ref does. Sticking to original logic for now? 
    // Wait, original has name, but API might expect name. I'll stick to name and treat "Username" in UI as "Full Name" or "Username" depending on backend.
    // Original backend likely uses 'name'. I will add a 'username' field to UI but map it or ignore if backend doesn't support.
    // Actually, looking at previous file, it only had 'name'. The reference has 'name' AND 'username'.
    // I will stick to the fields available in the original file to avoid backend errors, unless I see backend code.
    // Original: name, email, role, password, confirmPassword.
    // Reference: Name, Username, Email, Password, Confirm Password.
    // I'll keep 'name' as "Full Name" and maybe use email as username?
    // Let's just stick to the fields we have: Name, Email, Role, Password.
    password: '',
    confirmPassword: '',
    role: 'renter'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { confirmPassword, ...registerData } = formData
      const response = await register(registerData)

      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response))

      toast.success('Registration successful!')

      if (response.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error(getErrorMessage(error, 'Registration failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-stretch">
      {/* Left Side - Abstract Background */}
      <div className="hidden md:flex w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('/register-bg.png')" }}>
        <div className="absolute inset-0 bg-cyan-900 bg-opacity-20 flex items-center justify-center">
          {/* Hexagon Logo Placeholder */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-white transform rotate-45"></div>
            <div className="text-center text-white z-10 p-6">
              <h1 className="text-4xl font-bold tracking-widest">RENTIFY</h1>
              <p className="text-sm tracking-wide mt-2">RENT ANYTHING</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Dark Theme Form */}
      <div className="w-full md:w-1/2 bg-slate-800 flex flex-col justify-center p-8 md:p-16 text-white">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-light tracking-wide mb-2">REGISTER</h2>
            <p className="text-xs text-cyan-400 font-bold tracking-[0.2em]">IT'S COMPLETELY FREE</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="group">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-slate-600 focus:border-cyan-400 py-2 text-white placeholder-slate-500 outline-none transition-colors"
                placeholder="Your full name"
              />
            </div>

            {/* Account Type (Role) - Keeping this functional requirement */}
            <div className="group">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Account Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-slate-600 focus:border-cyan-400 py-2 text-white outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="renter" className="bg-slate-800">Renter - I want to rent items</option>
                <option value="owner" className="bg-slate-800">Owner - I want to rent out my items</option>
              </select>
            </div>

            {/* Email */}
            <div className="group">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-slate-600 focus:border-cyan-400 py-2 text-white placeholder-slate-500 outline-none transition-colors"
                placeholder="Email address"
              />
            </div>

            {/* Password */}
            <div className="group">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-slate-600 focus:border-cyan-400 py-2 text-white placeholder-slate-500 outline-none transition-colors pr-10"
                  placeholder="Create password"
                />
                <button
                  type="button"
                  className="absolute right-0 top-2 text-slate-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="group">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-slate-600 focus:border-cyan-400 py-2 text-white placeholder-slate-500 outline-none transition-colors pr-10"
                  placeholder="Repeat password"
                />
                <button
                  type="button"
                  className="absolute right-0 top-2 text-slate-400 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-center mt-4">
              <div className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="agree-terms"
                    name="agree-terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 bg-transparent border-slate-500 rounded text-cyan-400 focus:ring-cyan-400 focus:ring-offset-slate-800"
                  />
                </div>
                <div className="ml-3 text-xs">
                  <label htmlFor="agree-terms" className="text-slate-400">
                    I agree to the <a href="#" className="text-cyan-400 hover:text-cyan-300">Terms of Service</a> and <a href="#" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</a>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-3 px-4 bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-bold text-sm uppercase tracking-widest shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>

            <div className="text-center mt-6">
              <p className="text-xs text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold">
                  I'm already a member
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

