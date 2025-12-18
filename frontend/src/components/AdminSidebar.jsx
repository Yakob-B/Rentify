import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    ChartBarIcon,
    CalendarIcon,
    UsersIcon,
    UserPlusIcon,
    Squares2X2Icon,
    XMarkIcon,
    Bars3Icon
} from '@heroicons/react/24/outline'

const AdminSidebar = ({ isOpen, onClose }) => {
    const location = useLocation()

    const menuItems = [
        {
            id: 'overview',
            name: 'Dashboard',
            icon: ChartBarIcon,
            path: '/admin',
            color: 'text-blue-500'
        },
        {
            id: 'bookings',
            name: 'Bookings',
            icon: CalendarIcon,
            path: '/admin?tab=bookings',
            color: 'text-green-500'
        },
        {
            id: 'users',
            name: 'Users',
            icon: UsersIcon,
            path: '/admin?tab=users',
            color: 'text-purple-500'
        },
        {
            id: 'invitations',
            name: 'Admin Invitations',
            icon: UserPlusIcon,
            path: '/admin?tab=invitations',
            color: 'text-yellow-500'
        },
        {
            id: 'categories',
            name: 'Categories',
            icon: Squares2X2Icon,
            path: '/admin?tab=categories',
            color: 'text-pink-500'
        }
    ]

    const isActive = (item) => {
        const params = new URLSearchParams(location.search)
        const tab = params.get('tab')

        if (!tab && item.id === 'overview') return true
        return tab === item.id
    }

    return (
        <>
            {/* Mobile overlay - Darker for better contrast */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 z-40 lg:hidden transition-opacity duration-200"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-200 ease-out shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0`}
            >
                {/* Header */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">R</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 dark:text-white">Rentify</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item)

                        return (
                            <Link
                                key={item.id}
                                to={item.path}
                                onClick={() => {
                                    if (window.innerWidth < 1024) {
                                        onClose()
                                    }
                                }}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-150 group ${active
                                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-md'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <Icon
                                    className={`w-5 h-5 transition-colors ${active ? 'text-primary-600 dark:text-primary-400' : item.color
                                        }`}
                                />
                                <span className={`font-medium ${active ? 'font-semibold' : ''}`}>
                                    {item.name}
                                </span>
                                {active && (
                                    <div className="ml-auto w-1.5 h-1.5 bg-primary-600 dark:bg-primary-400 rounded-full animate-pulse" />
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        Admin Panel v1.0
                    </div>
                </div>
            </aside>
        </>
    )
}

// Mobile Menu Toggle Button
export const MobileMenuButton = ({ onClick }) => (
    <button
        onClick={onClick}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
        <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
    </button>
)

export default AdminSidebar
