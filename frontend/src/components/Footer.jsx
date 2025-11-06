import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  HeartIcon, 
  ArrowUpIcon
} from '@heroicons/react/24/outline'

const Footer = () => {
  const [currentYear] = useState(new Date().getFullYear())

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-gray-900 dark:bg-black text-white border-t dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Rentify</h2>
                  <p className="text-sm text-gray-400">Universal Rent Platform</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                Connect owners and renters. Rent anything from homes to tools.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/listings', label: 'Browse Listings' },
                  { to: '/listings/new', label: 'List Your Item' },
                  { to: '/dashboard', label: 'Dashboard' }
                ].map((link) => (
                  <li key={link.to}>
                    <Link 
                      to={link.to} 
                      className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Support</h3>
              <ul className="space-y-2">
                {[
                  { href: '#', label: 'Help Center' },
                  { href: '#', label: 'Contact Us' },
                  { href: '#', label: 'Privacy Policy' },
                  { href: '#', label: 'Terms of Service' }
                ].map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href} 
                      className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <HeartIcon className="w-4 h-4 text-red-400" />
              <span className="text-sm">© {currentYear} Rentify. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-6">
              {['Privacy', 'Terms', 'Cookies'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
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
        className="fixed bottom-6 right-6 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
        aria-label="Scroll to top"
      >
        <ArrowUpIcon className="w-5 h-5" />
      </button>
    </footer>
  )
}

export default Footer
