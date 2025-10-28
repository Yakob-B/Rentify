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
  XMarkIcon,
  BuildingOfficeIcon,
  ScissorsIcon,
  ComputerDesktopIcon,
  SparklesIcon,
  FilmIcon,
  CubeIcon,
  ShoppingBagIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null)
  
  // Icon and color mapping for different categories
  const categoryConfig = {
    'Home': { 
      icon: HomeIcon, 
      colors: { 
        bg: 'from-blue-50 to-blue-100', 
        border: 'border-blue-500', 
        text: 'text-blue-700', 
        icon: 'text-blue-600',
        hoverBorder: 'hover:border-blue-300',
        hoverBg: 'hover:from-blue-50 hover:to-blue-100',
        shadow: 'shadow-blue-500/25'
      }
    },
    'Property': { 
      icon: BuildingOfficeIcon, 
      colors: { 
        bg: 'from-indigo-50 to-indigo-100', 
        border: 'border-indigo-500', 
        text: 'text-indigo-700', 
        icon: 'text-indigo-600',
        hoverBorder: 'hover:border-indigo-300',
        hoverBg: 'hover:from-indigo-50 hover:to-indigo-100',
        shadow: 'shadow-indigo-500/25'
      }
    },
    'Vehicle': { 
      icon: TruckIcon, 
      colors: { 
        bg: 'from-red-50 to-red-100', 
        border: 'border-red-500', 
        text: 'text-red-700', 
        icon: 'text-red-600',
        hoverBorder: 'hover:border-red-300',
        hoverBg: 'hover:from-red-50 hover:to-red-100',
        shadow: 'shadow-red-500/25'
      }
    },
    'Tool': { 
      icon: WrenchScrewdriverIcon, 
      colors: { 
        bg: 'from-orange-50 to-orange-100', 
        border: 'border-orange-500', 
        text: 'text-orange-700', 
        icon: 'text-orange-600',
        hoverBorder: 'hover:border-orange-300',
        hoverBg: 'hover:from-orange-50 hover:to-orange-100',
        shadow: 'shadow-orange-500/25'
      }
    },
    'Tools': { 
      icon: WrenchScrewdriverIcon, 
      colors: { 
        bg: 'from-orange-50 to-orange-100', 
        border: 'border-orange-500', 
        text: 'text-orange-700', 
        icon: 'text-orange-600',
        hoverBorder: 'hover:border-orange-300',
        hoverBg: 'hover:from-orange-50 hover:to-orange-100',
        shadow: 'shadow-orange-500/25'
      }
    },
    'Electronics': { 
      icon: DevicePhoneMobileIcon, 
      colors: { 
        bg: 'from-purple-50 to-purple-100', 
        border: 'border-purple-500', 
        text: 'text-purple-700', 
        icon: 'text-purple-600',
        hoverBorder: 'hover:border-purple-300',
        hoverBg: 'hover:from-purple-50 hover:to-purple-100',
        shadow: 'shadow-purple-500/25'
      }
    },
    'Computer': { 
      icon: ComputerDesktopIcon, 
      colors: { 
        bg: 'from-violet-50 to-violet-100', 
        border: 'border-violet-500', 
        text: 'text-violet-700', 
        icon: 'text-violet-600',
        hoverBorder: 'hover:border-violet-300',
        hoverBg: 'hover:from-violet-50 hover:to-violet-100',
        shadow: 'shadow-violet-500/25'
      }
    },
    'Music': { 
      icon: MusicalNoteIcon, 
      colors: { 
        bg: 'from-pink-50 to-pink-100', 
        border: 'border-pink-500', 
        text: 'text-pink-700', 
        icon: 'text-pink-600',
        hoverBorder: 'hover:border-pink-300',
        hoverBg: 'hover:from-pink-50 hover:to-pink-100',
        shadow: 'shadow-pink-500/25'
      }
    },
    'Photography': { 
      icon: CameraIcon, 
      colors: { 
        bg: 'from-teal-50 to-teal-100', 
        border: 'border-teal-500', 
        text: 'text-teal-700', 
        icon: 'text-teal-600',
        hoverBorder: 'hover:border-teal-300',
        hoverBg: 'hover:from-teal-50 hover:to-teal-100',
        shadow: 'shadow-teal-500/25'
      }
    },
    'Camera': { 
      icon: CameraIcon, 
      colors: { 
        bg: 'from-teal-50 to-teal-100', 
        border: 'border-teal-500', 
        text: 'text-teal-700', 
        icon: 'text-teal-600',
        hoverBorder: 'hover:border-teal-300',
        hoverBg: 'hover:from-teal-50 hover:to-teal-100',
        shadow: 'shadow-teal-500/25'
      }
    },
    'Books': { 
      icon: BookOpenIcon, 
      colors: { 
        bg: 'from-amber-50 to-amber-100', 
        border: 'border-amber-500', 
        text: 'text-amber-700', 
        icon: 'text-amber-600',
        hoverBorder: 'hover:border-amber-300',
        hoverBg: 'hover:from-amber-50 hover:to-amber-100',
        shadow: 'shadow-amber-500/25'
      }
    },
    'Education': { 
      icon: AcademicCapIcon, 
      colors: { 
        bg: 'from-cyan-50 to-cyan-100', 
        border: 'border-cyan-500', 
        text: 'text-cyan-700', 
        icon: 'text-cyan-600',
        hoverBorder: 'hover:border-cyan-300',
        hoverBg: 'hover:from-cyan-50 hover:to-cyan-100',
        shadow: 'shadow-cyan-500/25'
      }
    },
    'Fashion': { 
      icon: ScissorsIcon, 
      colors: { 
        bg: 'from-rose-50 to-rose-100', 
        border: 'border-rose-500', 
        text: 'text-rose-700', 
        icon: 'text-rose-600',
        hoverBorder: 'hover:border-rose-300',
        hoverBg: 'hover:from-rose-50 hover:to-rose-100',
        shadow: 'shadow-rose-500/25'
      }
    },
    'Entertainment': { 
      icon: FilmIcon, 
      colors: { 
        bg: 'from-fuchsia-50 to-fuchsia-100', 
        border: 'border-fuchsia-500', 
        text: 'text-fuchsia-700', 
        icon: 'text-fuchsia-600',
        hoverBorder: 'hover:border-fuchsia-300',
        hoverBg: 'hover:from-fuchsia-50 hover:to-fuchsia-100',
        shadow: 'shadow-fuchsia-500/25'
      }
    },
    'Sports': { 
      icon: SparklesIcon, 
      colors: { 
        bg: 'from-green-50 to-green-100', 
        border: 'border-green-500', 
        text: 'text-green-700', 
        icon: 'text-green-600',
        hoverBorder: 'hover:border-green-300',
        hoverBg: 'hover:from-green-50 hover:to-green-100',
        shadow: 'shadow-green-500/25'
      }
    },
    'Shopping': { 
      icon: ShoppingBagIcon, 
      colors: { 
        bg: 'from-lime-50 to-lime-100', 
        border: 'border-lime-500', 
        text: 'text-lime-700', 
        icon: 'text-lime-600',
        hoverBorder: 'hover:border-lime-300',
        hoverBg: 'hover:from-lime-50 hover:to-lime-100',
        shadow: 'shadow-lime-500/25'
      }
    },
    'Other': { 
      icon: CubeIcon, 
      colors: { 
        bg: 'from-gray-50 to-gray-100', 
        border: 'border-gray-500', 
        text: 'text-gray-700', 
        icon: 'text-gray-600',
        hoverBorder: 'hover:border-gray-300',
        hoverBg: 'hover:from-gray-50 hover:to-gray-100',
        shadow: 'shadow-gray-500/25'
      }
    }
  }
  
  // Default fallback
  const defaultConfig = {
    icon: HeartIcon,
    colors: {
      bg: 'from-primary-50 to-primary-100',
      border: 'border-primary-500',
      text: 'text-primary-700',
      icon: 'text-primary-600',
      hoverBorder: 'hover:border-primary-300',
      hoverBg: 'hover:from-primary-50 hover:to-primary-100',
      shadow: 'shadow-primary-500/25'
    }
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
          const config = categoryConfig[category.name] || defaultConfig
          const IconComponent = config.icon
          const colors = config.colors
          const isSelected = selectedCategory === category._id
          const isHovered = hoveredCategory === category._id
          
          return (
            <button
              key={category._id}
              onClick={() => onCategorySelect(category._id)}
              onMouseEnter={() => setHoveredCategory(category._id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`group relative flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 active:scale-95 ${
                isSelected
                  ? `${colors.border} bg-gradient-to-br ${colors.bg} ${colors.text} shadow-lg ${colors.shadow}`
                  : `border-gray-200 ${colors.hoverBorder} hover:bg-gradient-to-br ${colors.hoverBg} hover:shadow-md`
              }`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <div className={`relative mb-3 transition-all duration-300 ${
                isSelected || isHovered ? 'scale-110 rotate-6' : 'scale-100'
              }`}>
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  isSelected || isHovered ? colors.bg.replace('from-', 'bg-').split(' ')[0] : 'bg-transparent'
                }`}>
                  <IconComponent className={`w-10 h-10 transition-all duration-300 ${
                    isSelected 
                      ? colors.icon 
                      : isHovered 
                        ? colors.icon
                        : 'text-gray-500'
                  }`} />
                </div>
                {(isSelected || isHovered) && (
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping ${
                    colors.border.replace('border-', 'bg-')
                  }`}></div>
                )}
              </div>
              
              <span className={`text-sm font-semibold transition-all duration-300 ${
                isSelected 
                  ? colors.text
                  : isHovered 
                    ? colors.text
                    : 'text-gray-700'
              }`}>
                {category.name}
              </span>
              
              {/* Animated background effect */}
              <div className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
                isSelected 
                  ? 'bg-gradient-to-br opacity-10'
                  : isHovered 
                    ? 'bg-gradient-to-br opacity-5'
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
