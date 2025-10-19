import React, { useState } from 'react'
import { 
  HomeIcon, 
  TruckIcon, 
  WrenchScrewdriverIcon, 
  DevicePhoneMobileIcon,
  MusicalNoteIcon,
  CameraIcon,
  BookOpenIcon,
  HeartIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null)
  
  const categoryIcons = {
    'Home': HomeIcon,
    'Vehicle': TruckIcon,
    'Tool': WrenchScrewdriverIcon,
    'Electronics': DevicePhoneMobileIcon,
    'Music': MusicalNoteIcon,
    'Photography': CameraIcon,
    'Books': BookOpenIcon,
    'Other': HeartIcon
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Browse Categories</h3>
        {selectedCategory && (
          <button
            onClick={() => onCategorySelect(null)}
            className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-all duration-300 hover:scale-105 group"
          >
            <XMarkIcon className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span>Clear filter</span>
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category, index) => {
          const IconComponent = categoryIcons[category.name] || HeartIcon
          const isSelected = selectedCategory === category._id
          const isHovered = hoveredCategory === category._id
          
          return (
            <button
              key={category._id}
              onClick={() => onCategorySelect(category._id)}
              onMouseEnter={() => setHoveredCategory(category._id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`group flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 active:scale-95 ${
                isSelected
                  ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 text-primary-700 shadow-lg shadow-primary-500/25'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-primary-50 hover:shadow-md'
              }`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className={`relative mb-3 transition-all duration-300 ${
                isSelected || isHovered ? 'scale-110' : 'scale-100'
              }`}>
                <IconComponent className={`w-10 h-10 transition-all duration-300 ${
                  isSelected 
                    ? 'text-primary-600' 
                    : isHovered 
                      ? 'text-primary-500' 
                      : 'text-gray-500'
                }`} />
                {(isSelected || isHovered) && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-ping"></div>
                )}
              </div>
              
              <span className={`text-sm font-semibold transition-all duration-300 ${
                isSelected 
                  ? 'text-primary-700' 
                  : isHovered 
                    ? 'text-primary-600' 
                    : 'text-gray-700'
              }`}>
                {category.name}
              </span>
              
              {/* Animated background effect */}
              <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                isSelected 
                  ? 'bg-gradient-to-br from-primary-500/10 to-primary-600/10' 
                  : isHovered 
                    ? 'bg-gradient-to-br from-primary-500/5 to-primary-600/5' 
                    : 'bg-transparent'
              }`}></div>
            </button>
          )
        })}
      </div>
      
      {selectedCategory && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 text-primary-600">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Filter active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryFilter
