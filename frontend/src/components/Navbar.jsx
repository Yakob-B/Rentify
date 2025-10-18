import React, { useState } from 'react'
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
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

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
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Rentify</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={({isActive}) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-600'}`}>
              Home
            </NavLink>
            <NavLink to="/listings" className={({isActive}) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-primary-700 bg-primary-50' : 'text-gray-700 hover:text-primary-600'}`}>
              Browse
            </NavLink>
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/listings/new" 
                  className="btn-primary flex items-center space-x-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>List Item</span>
                </Link>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    <UserCircleIcon className="w-6 h-6" />
                    <span>{user.name}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/dashboard" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <HomeIcon className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Cog6ToothIcon className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 p-2 rounded-md"
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/listings" 
              className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Browse
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/listings/new" 
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  List Item
                </Link>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
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
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
