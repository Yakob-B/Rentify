import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/errors'
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  HomeIcon,
  PlusIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      navigate('/')
      window.location.reload()
      toast.success('Logged out')
    } catch (e) {
      toast.error(getErrorMessage(e, 'Logout failed'))
    }
  }

  const user = JSON.parse(localStorage.getItem('user') || 'null')

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-white shadow-sm border-b border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-lg">R</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors duration-300">
                Rentify
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/" 
              className={({isActive}) => `px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 ${
                isActive 
                  ? 'text-primary-700 bg-primary-50 shadow-sm' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              Home
            </NavLink>
            <NavLink 
              to="/listings" 
              className={({isActive}) => `px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 ${
                isActive 
                  ? 'text-primary-700 bg-primary-50 shadow-sm' 
                  : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
              }`}
            >
              Browse
            </NavLink>
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/listings/new" 
                  className="btn-primary flex items-center space-x-2 hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  <PlusIcon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                  <span>List Item</span>
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105">
                    <UserCircleIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    <span>{user.name}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <Link 
                      to="/dashboard" 
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 hover:translate-x-1"
                    >
                      <HomeIcon className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    {user.role === 'admin' && (
                      <Link 
                        to="/admin" 
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 hover:translate-x-1"
                      >
                        <Cog6ToothIcon className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200 hover:translate-x-1"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 p-2 rounded-md transition-all duration-300 hover:scale-110"
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6 rotate-180 transition-transform duration-300" />
              ) : (
                <Bars3Icon className="w-6 h-6 rotate-0 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${
        isOpen 
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-md border-t border-gray-200">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:translate-x-2 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/listings" 
              className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:translate-x-2 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Browse
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/listings/new" 
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:translate-x-2 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  List Item
                </Link>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:translate-x-2 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:translate-x-2 hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button 
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="text-gray-700 hover:text-red-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-all duration-300 hover:translate-x-2 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:translate-x-2 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:translate-x-2 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
    </nav>
  )
}

export default Navbar
