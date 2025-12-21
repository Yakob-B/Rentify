import React, { useState, useRef, useEffect } from 'react'
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useLocation } from 'react-router-dom'
import { chatWithAI } from '../utils/api'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/errors'

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi! I\'m your Rentify Assistant. How can I help you today?' }
    ])
    const [newMessage, setNewMessage] = useState('')
    const [sending, setSending] = useState(false)
    const messagesEndRef = useRef(null)

    // Determine context based on current route
    const location = useLocation()
    const isListingPage = location.pathname.startsWith('/listings/') && !location.pathname.endsWith('/edit') && !location.pathname.endsWith('/new')

    const listingId = isListingPage ? location.pathname.split('/listings/')[1] : null

    useEffect(() => {
        scrollToBottom()
    }, [messages, isOpen])

    // Reset chat when switching contexts (optional, but good for clarity)
    // For now, we keep history but maybe add a system note or just let the user chat
    useEffect(() => {
        if (listingId) {
            // Maybe add a small pill indicating listing context?
        }
    }, [listingId])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || sending) return

        const userMsg = newMessage.trim()
        setMessages(prev => [...prev, { role: 'user', content: userMsg }])
        setNewMessage('')
        setSending(true)

        try {
            // Call AI Chat API
            const response = await chatWithAI({
                message: userMsg,
                listingId: listingId // Pass listing ID if on a listing page
            })

            if (response.data?.reply) {
                setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }])
            }
        } catch (error) {
            console.error('Chat Error:', error)
            const errorMsg = getErrorMessage(error, "I'm having trouble connecting right now.")
            setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }])
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-600 hover:bg-primary-700'} text-white p-4 rounded-full shadow-lg transition-colors flex items-center justify-center`}
                title={isOpen ? "Close Chat" : "Open Rentify Assistant"}
            >
                {isOpen ? (
                    <XMarkIcon className="w-6 h-6" />
                ) : (
                    <ChatBubbleLeftRightIcon className="w-6 h-6" />
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-80 sm:w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden" style={{ height: '500px', maxHeight: '80vh' }}>

                    {/* Header */}
                    <div className="bg-primary-600 text-white p-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <ChatBubbleLeftRightIcon className="w-5 h-5" />
                            Rentify Assistant
                        </h3>
                        <p className="text-xs text-primary-100 mt-1">
                            {isListingPage ? 'Listing Mode' : 'Platform Support'}
                        </p>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black/50">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${msg.role === 'user'
                                        ? 'bg-primary-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-tl-none'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {sending && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-none border border-gray-200 dark:border-gray-700">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={isListingPage ? "Ask about this listing..." : "Ask me anything..."}
                                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                disabled={sending}
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim() || sending}
                                className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AIChatWidget
