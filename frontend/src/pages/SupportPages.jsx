import React, { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline'

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="border-b border-gray-200 dark:border-gray-800 last:border-0">
            <button
                className="w-full py-6 text-left flex items-center justify-between focus:outline-none group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                    {question}
                </span>
                <span className="ml-6 flex-shrink-0">
                    {isOpen ? (
                        <MinusIcon className="h-6 w-6 text-emerald-500" />
                    ) : (
                        <PlusIcon className="h-6 w-6 text-gray-400 group-hover:text-emerald-500" />
                    )}
                </span>
            </button>
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {answer}
                </p>
            </div>
        </div>
    )
}

export const FAQPage = () => {
    const faqs = [
        {
            question: "How does Rentify work?",
            answer: "Rentify connects owners with renters. Owners list their items with photos and descriptions. Renters browse listings, request bookings, and pay through our secure platform. Once approved, the renter picks up the item and returns it by the due date."
        },
        {
            question: "Is insurance included?",
            answer: "We offer basic protection for both owners and renters. However, we recommend owners have their own insurance for high-value items. Renters are responsible for any damage occurring during the rental period."
        },
        {
            question: "How do payments work?",
            answer: "We use Stripe for secure payment processing. Renters are charged upon booking or approval. Owners receive payouts to their connected bank accounts after the rental period ends."
        },
        {
            question: "What if an item is damaged?",
            answer: "If an item is damaged, please document it immediately with photos and report it through the dashboard. We will mediate the dispute and facilitate reimbursement according to our policies."
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
            <PageHeader title="Frequently Asked Questions" subtitle="Everything you need to know about renting on Rentify." />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
                    {faqs.map((faq, index) => (
                        <FAQItem key={index} {...faq} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export const ContactPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-20">
            <PageHeader title="Contact Us" subtitle="We're here to help. Reach out to us for any queries." />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
                        <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Send us a message</h3>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                <input type="text" className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-emerald-500 focus:border-emerald-500" placeholder="Your Name" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input type="email" className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-emerald-500 focus:border-emerald-500" placeholder="you@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                <textarea rows={4} className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-emerald-500 focus:border-emerald-500" placeholder="How can we help?"></textarea>
                            </div>
                            <button type="submit" className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg transition-colors">
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-emerald-900 text-white rounded-2xl shadow-xl p-8 flex flex-col justify-between overflow-hidden relative">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-emerald-200 text-sm font-bold uppercase tracking-wider">Email</p>
                                    <p className="text-lg">support@rentify.com</p>
                                </div>
                                <div>
                                    <p className="text-emerald-200 text-sm font-bold uppercase tracking-wider">Phone</p>
                                    <p className="text-lg">+1 (555) 123-4567</p>
                                </div>
                                <div>
                                    <p className="text-emerald-200 text-sm font-bold uppercase tracking-wider">Address</p>
                                    <p className="text-lg">123 Innovation Dr,</p>
                                    <p className="text-lg">Tech City, TC 90210</p>
                                </div>
                            </div>
                        </div>

                        {/* Decoration */}
                        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
