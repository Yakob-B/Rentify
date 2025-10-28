import React from 'react'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header / Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="absolute inset-0 opacity-10 pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-yellow-300 blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">About Rentify</h1>
            <p className="text-base md:text-xl text-primary-100 leading-relaxed">
              Rentify simplifies property and rental management for owners and renters. Discover, list, and book securely with tools designed for modern communities.
            </p>
          </div>
        </div>
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
              'MongoDB', 'Express', 'React', 'Node.js', 'TailwindCSS', 'Cloudinary'
            ].map((tech) => (
              <div key={tech} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 text-center text-gray-800">
                {tech}
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


