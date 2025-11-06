import React from 'react'
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../contexts/ThemeContext'

const FloatingThemeToggle = () => {
  const { dark, toggleTheme, isAnimating } = useTheme()

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className="fixed bottom-6 left-6 z-50 inline-flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 p-3 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg hover:shadow-xl bg-white dark:bg-black backdrop-blur-sm"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
      
      {/* Icons with animation */}
      <div className="relative">
        <SunIcon 
          className={`w-5 h-5 transition-all duration-300 ${
            dark 
              ? 'rotate-90 scale-0 opacity-0' 
              : 'rotate-0 scale-100 opacity-100'
          } ${isAnimating ? 'animate-spin' : ''}`}
        />
        <MoonIcon 
          className={`w-5 h-5 absolute top-0 left-0 transition-all duration-300 ${
            dark 
              ? 'rotate-0 scale-100 opacity-100' 
              : '-rotate-90 scale-0 opacity-0'
          } ${isAnimating ? 'animate-pulse' : ''}`}
        />
      </div>
      
      {/* Ripple effect */}
      {isAnimating && (
        <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-ping"></div>
      )}
    </button>
  )
}

export default FloatingThemeToggle
