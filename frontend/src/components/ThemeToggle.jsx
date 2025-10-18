import React, { useEffect, useState } from 'react'

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  })

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

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => setDark(!dark)}
      className="ml-2 inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 p-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {dark ? (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M21.64 13a1 1 0 0 0-1.05-.14 8 8 0 0 1-10.45-10.45 1 1 0 0 0-1.19-1.32A10 10 0 1 0 22 14.19a1 1 0 0 0-.36-1.19Z"/></svg>
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zm10.45-1.79l-1.79 1.8 1.41 1.41 1.8-1.79-1.42-1.42zM12 4V1h-2v3h2zm7 8h3v-2h-3v2zM4 12H1v-2h3v2zm8 9v-3h-2v3h2zm6.24-1.84l1.8 1.79 1.41-1.41-1.79-1.8-1.42 1.42zM4.22 18.36l-1.8 1.79 1.41 1.41 1.79-1.8-1.4-1.4z"/></svg>
      )}
    </button>
  )
}

export default ThemeToggle


