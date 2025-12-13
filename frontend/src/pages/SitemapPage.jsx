import React from 'react'
import PageHeader from '../components/PageHeader'
import { Link } from 'react-router-dom'
import {
    HomeIcon,
    ShoppingBagIcon,
    UserGroupIcon,
    InformationCircleIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline'

const SitemapSection = ({ title, icon: Icon, links }) => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-lg text-emerald-600 dark:text-emerald-400">
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        </div>
        <ul className="space-y-3">
            {links.map((link) => (
                <li key={link.to}>
                    <Link
                        to={link.to}
                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors group"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 group-hover:bg-emerald-500 mr-3 transition-colors"></span>
                        {link.label}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
)

const SitemapPage = () => {
    const sections = [
        {
            title: "Main",
            icon: HomeIcon,
            links: [
                { to: "/", label: "Home" },
                { to: "/listings", label: "Explore Listings" },
                { to: "/dashboard", label: "Dashboard" },
                { to: "/listings/new", label: "List an Item" }
            ]
        },
        {
            title: "Account",
            icon: UserGroupIcon,
            links: [
                { to: "/login", label: "Login" },
                { to: "/register", label: "Register" },
                { to: "/forgot-password", label: "Forgot Password" },
                { to: "/favorites", label: "My Favorites" }
            ]
        },
        {
            title: "Company",
            icon: InformationCircleIcon,
            links: [
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact Us" },
                { to: "/faq", label: "FAQ / Help Center" }
                // Careers and Team map to About for now as per previous task
            ]
        },
        {
            title: "Legal",
            icon: ShieldCheckIcon,
            links: [
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/terms", label: "Terms of Service" },
                { to: "/cookies", label: "Cookie Policy" }
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
            <PageHeader title="Sitemap" subtitle="Overview of all pages on Rentify." />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sections.map((section) => (
                        <SitemapSection key={section.title} {...section} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SitemapPage
