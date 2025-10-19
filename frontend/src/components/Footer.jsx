import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  HeartIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  ArrowUpIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500 rounded-full blur-3xl animate-pulse delay-200"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-xl">R</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Rentify
                  </h2>
                  <p className="text-sm text-gray-400">Universal Rent Platform</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed max-w-md">
                The universal rent service platform that connects owners and renters. 
                Rent anything from homes and vehicles to tools and electronics.
              </p>

              {/* Newsletter Signup */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold flex items-center space-x-2">
                  <SparklesIcon className="w-5 h-5 text-primary-400" />
                  <span>Stay Updated</span>
                </h4>
                <div className="flex space-x-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                  />
                  <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {[
                  { name: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                  { name: 'Twitter', icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' },
                  { name: 'Instagram', icon: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781h-1.68c-.928 0-1.68-.752-1.68-1.68V3.846c0-.928.752-1.68 1.68-1.68h1.68c.928 0 1.68.752 1.68 1.68v1.681c0 .928-.752 1.68-1.68 1.68z' },
                  { name: 'LinkedIn', icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' }
                ].map((social, index) => (
                  <a
                    key={social.name}
                    href="#"
                    className={`group relative p-3 bg-gray-700 hover:bg-primary-600 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-3 transform`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                    <span className="sr-only">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/listings', label: 'Browse Listings' },
                  { to: '/listings/new', label: 'List Your Item' },
                  { to: '/dashboard', label: 'Dashboard' }
                ].map((link, index) => (
                  <li key={link.to} className="group">
                    <Link 
                      to={link.to} 
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 group-hover:translate-x-1"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support & Contact */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Support</h3>
              <ul className="space-y-3">
                {[
                  { href: '#', label: 'Help Center' },
                  { href: '#', label: 'Contact Us' },
                  { href: '#', label: 'Privacy Policy' },
                  { href: '#', label: 'Terms of Service' }
                ].map((link, index) => (
                  <li key={link.label} className="group">
                    <a 
                      href={link.href} 
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 group-hover:translate-x-1"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>

              {/* Contact Info */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <EnvelopeIcon className="w-5 h-5 text-primary-400" />
                  <span className="text-sm">support@rentify.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <PhoneIcon className="w-5 h-5 text-primary-400" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPinIcon className="w-5 h-5 text-primary-400" />
                  <span className="text-sm">San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className={`border-t border-gray-700 py-8 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <HeartIcon className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-sm">© {currentYear} Rentify. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-6">
              {['Privacy', 'Terms', 'Cookies'].map((item, index) => (
                <a 
                  key={item}
                  href="#" 
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200 hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 z-50 group"
        aria-label="Scroll to top"
      >
        <ArrowUpIcon className="w-6 h-6 group-hover:animate-bounce" />
      </button>
    </footer>
  )
}

export default Footer
