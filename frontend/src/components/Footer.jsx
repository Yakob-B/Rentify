import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  HeartIcon,
  ArrowUpIcon,
  MapPinIcon,
  ClockIcon,
  TruckIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

const Footer = () => {
  const [currentYear] = useState(new Date().getFullYear())

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-emerald-500 text-white relative overflow-hidden">
      {/* Decorative Dashed Line - CSS/SVG */}
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none hidden lg:block overflow-hidden">
        <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M 100,0 Q 80,50 100,100" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" fill="none" opacity="0.5" />
          <path d="M 100,20 Q 70,60 100,90" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" fill="none" opacity="0.5" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Top Info Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <MapPinIcon className="h-6 w-6" />
            <div>
              <p className="font-bold text-sm">Find a Rental</p>
              <p className="text-xs text-emerald-100">Local Listings</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ClockIcon className="h-6 w-6" />
            <div>
              <p className="font-bold text-sm">24/7 Support</p>
              <p className="text-xs text-emerald-100">Always here</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <TruckIcon className="h-6 w-6" />
            <div>
              <p className="font-bold text-sm">Secure Delivery</p>
              <p className="text-xs text-emerald-100">Trusted Partners</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <PhoneIcon className="h-6 w-6" />
            <div>
              <p className="font-bold text-sm">Contact Us</p>
              <p className="text-xs text-emerald-100">+251 900 0000</p>
            </div>
          </div>
        </div>


        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Left Side: Brand & Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1 space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">Rentify</h2>
              <p className="text-sm text-emerald-50 leading-relaxed">
                We are a universal platform connecting owners and renters. Rent anything, anytime.
              </p>
              <div className="flex space-x-4 mt-6">
                {/* Facebook */}
                <a href="#" className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-emerald-500 transition-colors cursor-pointer group">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a href="#" className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-emerald-500 transition-colors cursor-pointer group">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                {/* Twitter */}
                <a href="#" className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-emerald-500 transition-colors cursor-pointer group">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Links Columns */}
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Quick Link</h3>
              <ul className="space-y-2 text-sm text-emerald-50">
                <li><Link to="/" className="hover:text-white hover:underline">Home</Link></li>
                <li><Link to="/listings" className="hover:text-white hover:underline">Explore</Link></li>
                <li><Link to="/listings/new" className="hover:text-white hover:underline">List Item</Link></li>
                <li><Link to="/dashboard" className="hover:text-white hover:underline">Dashboard</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">Help</h3>
              <ul className="space-y-2 text-sm text-emerald-50">
                <li><Link to="/support" className="hover:text-white hover:underline">Support</Link></li>
                <li><Link to="/terms" className="hover:text-white hover:underline">Terms</Link></li>
                <li><Link to="/privacy" className="hover:text-white hover:underline">Privacy</Link></li>
                <li><Link to="/faq" className="hover:text-white hover:underline">FAQ</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">About Us</h3>
              <ul className="space-y-2 text-sm text-emerald-50">
                <li><Link to="/about" className="hover:text-white hover:underline">Our Story</Link></li>
                <li><Link to="/about" className="hover:text-white hover:underline">Team</Link></li>
                <li><a href="#" className="hover:text-white hover:underline">Careers</a></li>
                <li><Link to="/contact" className="hover:text-white hover:underline">Contact</Link></li>
              </ul>
            </div>
          </div>

          {/* Right Side: Decorative Image */}
          <div className="hidden lg:flex items-center justify-center relative">
            {/* Dashed curved line leading to image */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 border-2 border-dashed border-white/40 rounded-full translate-x-12"></div>

            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-2xl z-10 bg-white">
              <img
                src="/footer-decoration.png"
                alt="Rental Items"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>

        {/* Bottom section */}
        <div className="border-t border-white/20 py-6 text-xs text-emerald-100 flex flex-col md:flex-row justify-between items-center">
          <p>© {currentYear} Rentify. All Right Resolved</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms & Conditions</Link>
            <Link to="/cookies" className="hover:text-white">Cookie Policy</Link>
            <Link to="/sitemap" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 bg-white text-emerald-600 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50 hover:bg-gray-100"
        aria-label="Scroll to top"
      >
        <ArrowUpIcon className="w-5 h-5" />
      </button>
    </footer>
  )
}

export default Footer
