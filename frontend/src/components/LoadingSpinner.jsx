import React from 'react'

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary', 
  text = '',
  variant = 'spinner'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colorClasses = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-gray-600'
  }

  const SpinnerIcon = () => (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-spin`}>
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )

  const DotsIcon = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`w-2 h-2 bg-current rounded-full animate-bounce`}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  )

  const PulseIcon = () => (
    <div className={`${sizeClasses[size]} ${colorClasses[color]} animate-pulse`}>
      <div className="w-full h-full bg-current rounded-full"></div>
    </div>
  )

  const renderIcon = () => {
    switch (variant) {
      case 'dots':
        return <DotsIcon />
      case 'pulse':
        return <PulseIcon />
      default:
        return <SpinnerIcon />
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      {renderIcon()}
      {text && (
        <p className={`text-sm ${colorClasses[color]} animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  )
}

export default LoadingSpinner
