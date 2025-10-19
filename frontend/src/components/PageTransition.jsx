import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const PageTransition = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // Reset animation state on route change
    setIsExiting(false)
    setIsVisible(false)
    
    // Trigger entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [location.pathname])

  useEffect(() => {
    // Handle exit animation
    const handleBeforeUnload = () => {
      setIsExiting(true)
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  return (
    <div 
      className={`transition-all duration-500 ease-in-out ${
        isVisible && !isExiting 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      }`}
    >
      {children}
    </div>
  )
}

export default PageTransition
