import React from 'react'

const Skeleton = ({ 
  className = '', 
  variant = 'default',
  lines = 1,
  animated = true 
}) => {
  const baseClasses = `bg-gray-200 rounded ${animated ? 'animate-pulse' : ''}`
  
  const variants = {
    default: 'h-4',
    card: 'h-48',
    avatar: 'w-12 h-12 rounded-full',
    text: 'h-4',
    button: 'h-10 w-24',
    image: 'h-32 w-full',
    list: 'h-16 w-full'
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div 
            key={index}
            className={`${baseClasses} ${variants[variant]} ${
              index === lines - 1 ? 'w-3/4' : 'w-full'
            } ${className}`}
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={`${baseClasses} ${className} overflow-hidden`}>
        <div className="h-48 bg-gray-200 animate-pulse"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, index) => (
          <div 
            key={index}
            className={`${baseClasses} h-16 w-full ${className}`}
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}
      </div>
    )
  }

  return (
    <div 
      className={`${baseClasses} ${variants[variant] || variants.default} ${className}`}
    />
  )
}

export default Skeleton


