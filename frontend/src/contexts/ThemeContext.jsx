import React, { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    return false
  })

  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    
    if (dark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  const toggleTheme = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setDark(!dark)
      setIsAnimating(false)
    }, 150)
  }

  const value = {
    dark,
    toggleTheme,
    isAnimating
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
