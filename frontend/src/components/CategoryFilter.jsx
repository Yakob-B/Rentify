import React from 'react'
import { 
  HomeIcon, 
  TruckIcon, 
  WrenchScrewdriverIcon, 
  DevicePhoneMobileIcon,
  MusicalNoteIcon,
  CameraIcon,
  BookOpenIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }) => {
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => {
          const IconComponent = categoryIcons[category.name] || HeartIcon
          const isSelected = selectedCategory === category._id
          
          return (
            <button
              key={category._id}
              onClick={() => onCategorySelect(category._id)}
              className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <IconComponent className={`w-8 h-8 mb-2 ${
                isSelected ? 'text-primary-600' : 'text-gray-500'
              }`} />
              <span className={`text-sm font-medium ${
                isSelected ? 'text-primary-700' : 'text-gray-700'
              }`}>
                {category.name}
              </span>
            </button>
          )
        })}
      </div>
      
      {selectedCategory && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onCategorySelect(null)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>
  )
}

export default CategoryFilter
