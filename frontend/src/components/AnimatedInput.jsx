import React, { useState, useRef } from 'react'

const AnimatedInput = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  success,
  disabled = false,
  icon,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(!!value)
  const inputRef = useRef(null)

  const handleFocus = () => setIsFocused(true)
  const handleBlur = () => {
    setIsFocused(false)
    setHasValue(!!inputRef.current?.value)
  }

  const handleChange = (e) => {
    setHasValue(!!e.target.value)
    onChange?.(e)
  }

  const isActive = isFocused || hasValue

  return (
    <div className={`relative ${className}`}>
      {/* Input container */}
      <div className={`
        relative border-2 rounded-lg transition-all duration-300
        ${error 
          ? 'border-red-500 bg-red-50' 
          : success 
            ? 'border-green-500 bg-green-50' 
            : isFocused 
              ? 'border-primary-500 bg-white shadow-lg' 
              : 'border-gray-300 bg-white hover:border-gray-400'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}>
        {/* Label */}
        {label && (
          <label className={`
            absolute left-3 transition-all duration-300 pointer-events-none
            ${isActive 
              ? 'top-2 text-xs text-primary-600 font-medium' 
              : 'top-1/2 -translate-y-1/2 text-gray-500'
            }
            ${error ? 'text-red-600' : success ? 'text-green-600' : ''}
          `}>
            {label}
          </label>
        )}

        {/* Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isActive ? placeholder : ''}
          disabled={disabled}
          className={`
            w-full px-3 py-3 bg-transparent border-0 outline-none
            ${icon ? 'pl-10' : ''}
            ${label ? 'pt-4' : ''}
            text-gray-900 placeholder-gray-400
            disabled:cursor-not-allowed
          `}
          {...props}
        />

        {/* Success/Error icons */}
        {success && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* Focus ring */}
        {isFocused && (
          <div className="absolute inset-0 rounded-lg ring-2 ring-primary-500/20 pointer-events-none"></div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600 animate-fadeIn">
          {error}
        </p>
      )}

      {/* Success message */}
      {success && (
        <p className="mt-1 text-sm text-green-600 animate-fadeIn">
          {success}
        </p>
      )}
    </div>
  )
}

export default AnimatedInput
