import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header / Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-yellow-300 blur-3xl animate-pulse"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl transition-all duration-1000 ease-out translate-y-3 opacity-0 [animation-delay:200ms] animate-[fadeInUp_0.8s_forwards]">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">About Rentify</h1>
            <p className="text-base md:text-xl text-primary-100 leading-relaxed">
              Rentify simplifies property and rental management for owners and renters. Discover, list, and book securely with tools designed for modern communities.
            </p>
          </div>
        </div>
        {/* Simple keyframes using tailwind arbitrary values */}
        <style>{`@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}`}</style>
      </section>

      {/* Problem & Solution */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">The Problem We Solve</h2>
            <p className="text-gray-600 leading-relaxed">
              Managing rentals can be fragmented and time-consuming. Owners juggle listings, inquiries, and bookings across different channels, while renters struggle to find trusted listings nearby.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Rentify brings everything together—secure listings, streamlined booking, and location-based discovery—so both sides save time and gain confidence.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Core Features</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start"><span className="mt-1 mr-3 h-2 w-2 rounded-full bg-primary-500"></span> Secure listing creation with images and rich details</li>
              <li className="flex items-start"><span className="mt-1 mr-3 h-2 w-2 rounded-full bg-primary-500"></span> Fast, reliable booking and management</li>
              <li className="flex items-start"><span className="mt-1 mr-3 h-2 w-2 rounded-full bg-primary-500"></span> Location-based recommendations to find nearby listings</li>
              <li className="flex items-start"><span className="mt-1 mr-3 h-2 w-2 rounded-full bg-primary-500"></span> Reviews, ratings, and user verification for trust</li>
              <li className="flex items-start"><span className="mt-1 mr-3 h-2 w-2 rounded-full bg-primary-500"></span> Admin tools for invitations, user management, and analytics</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stack / Technologies */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Technologies We Use</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {[
              {
                name: 'MongoDB',
                icon: (
                  <svg viewBox="0 0 128 128" className="w-8 h-8" aria-hidden="true">
                    <path fill="#10B981" d="M64 8c18 22 34 40 34 62 0 25-18 38-34 50-16-12-34-25-34-50C30 48 46 30 64 8z"/>
                  </svg>
                )
              },
              {
                name: 'Express',
                icon: (
                  <svg viewBox="0 0 128 32" className="w-16 h-8" aria-hidden="true">
                    <text x="0" y="24" fontFamily="system-ui, sans-serif" fontSize="24" fill="#111827">express</text>
                  </svg>
                )
              },
              {
                name: 'React',
                icon: (
                  <svg viewBox="0 0 256 256" className="w-8 h-8" aria-hidden="true">
                    <circle cx="128" cy="128" r="12" fill="#61DAFB"/>
                    <g fill="none" stroke="#61DAFB" strokeWidth="8">
                      <ellipse cx="128" cy="128" rx="80" ry="32"/>
                      <ellipse cx="128" cy="128" rx="80" ry="32" transform="rotate(60 128 128)"/>
                      <ellipse cx="128" cy="128" rx="80" ry="32" transform="rotate(120 128 128)"/>
                    </g>
                  </svg>
                )
              },
              {
                name: 'Node.js',
                icon: (
                  <svg viewBox="0 0 128 128" className="w-8 h-8" aria-hidden="true">
                    <path fill="#68A063" d="M64 8l48 28v56L64 120 16 92V36z"/>
                  </svg>
                )
              },
              {
                name: 'TailwindCSS',
                icon: (
                  <svg viewBox="0 0 128 64" className="w-10 h-8" aria-hidden="true">
                    <path fill="#38BDF8" d="M32 16c8-16 24-16 32 0 4 8 12 12 32 8-8 16-24 16-32 0-4-8-12-12-32-8zM0 48c8-16 24-16 32 0 4 8 12 12 32 8-8 16-24 16-32 0-4-8-12-12-32-8z"/>
                  </svg>
                )
              },
              {
                name: 'Cloudinary',
                icon: (
                  <svg viewBox="0 0 128 64" className="w-10 h-8" aria-hidden="true">
                    <circle cx="28" cy="36" r="12" fill="#3F8EFC"/>
                    <circle cx="48" cy="28" r="16" fill="#3F8EFC"/>
                    <rect x="28" y="36" width="60" height="12" rx="6" fill="#3F8EFC"/>
                  </svg>
                )
              }
            ].map((tech) => (
              <div 
                key={tech.name} 
                className="group bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-center text-gray-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:ring-2 hover:ring-primary-200"
              >
                <div className="mx-auto mb-2 flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 group-hover:bg-primary-50 transition-colors duration-300">
                  {tech.icon}
                </div>
                <div className="font-medium">{tech.name}</div>
              </div>
            ))}
          </div>
          <p className="text-gray-600 mt-6 max-w-3xl">
            Built on the MERN stack with TailwindCSS for styling, Cloudinary for media, and modern tooling for performance and scalability.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 shadow-sm p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              Our mission is to empower communities to share resources effortlessly and securely. We envision a world where access matters more than ownership, powered by transparent tools and trusted connections.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link 
            to="/" 
            className="inline-block bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </div>
  )
}

export default About


