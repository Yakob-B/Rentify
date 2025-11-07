import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/errors'
import {
  getUserConversations,
  getConversationById,
  getConversationMessages,
  sendMessage,
  markConversationAsRead
} from '../utils/api'
import {
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  UserIcon
} from '@heroicons/react/24/outline'

const MessagesPage = () => {
  const { conversationId } = useParams()
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getUserConversations()
        setConversations(data)
      } catch (error) {
        console.error('Error fetching conversations:', error)
        toast.error(getErrorMessage(error, 'Failed to load conversations'))
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId)
    }
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadConversation = async (id) => {
    try {
      const [conversationData, messagesData] = await Promise.all([
        getConversationById(id),
        getConversationMessages(id)
      ])
      setSelectedConversation(conversationData)
      setMessages(messagesData.messages || [])
      
      // Mark as read
      await markConversationAsRead(id)
      
      // Update unread count in conversations list
      setConversations(prev => prev.map(conv => 
        conv._id === id ? { ...conv, unreadCount: 0 } : conv
      ))
    } catch (error) {
      console.error('Error loading conversation:', error)
      toast.error(getErrorMessage(error, 'Failed to load conversation'))
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    setSending(true)
    try {
      const sentMessage = await sendMessage(selectedConversation._id, newMessage)
      setMessages(prev => [...prev, sentMessage])
      setNewMessage('')
      
      // Update conversation in list
      setConversations(prev => prev.map(conv => 
        conv._id === selectedConversation._id 
          ? { ...conv, lastMessageAt: new Date(), lastMessage: sentMessage }
          : conv
      ))
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to send message'))
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getOtherParticipant = (conversation) => {
    if (!conversation.participants) return null
    return conversation.participants.find(p => p._id !== user._id)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p className="text-gray-600 dark:text-gray-300">Chat with other users</p>
        </div>

        <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 dark:border-gray-800 flex flex-col">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Conversations</h2>
              </div>
              <div className="flex-1 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-2 text-gray-400 dark:text-gray-600" />
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  conversations.map((conversation) => {
                    const otherUser = getOtherParticipant(conversation)
                    const isSelected = selectedConversation?._id === conversation._id
                    
                    return (
                      <Link
                        key={conversation._id}
                        to={`/messages/${conversation._id}`}
                        className={`block p-4 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${
                          isSelected ? 'bg-primary-50 dark:bg-gray-900 border-primary-200 dark:border-gray-700' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {otherUser?.avatar ? (
                              <img
                                src={otherUser.avatar}
                                alt={otherUser.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                <UserIcon className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {otherUser?.name || 'Unknown User'}
                              </p>
                              {conversation.unreadCount > 0 && (
                                <span className="flex-shrink-0 bg-primary-600 dark:bg-white dark:text-black text-white text-xs font-semibold rounded-full px-2 py-1">
                                  {conversation.unreadCount}
                                </span>
                              )}
                            </div>
                            {conversation.listing && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {conversation.listing.title}
                              </p>
                            )}
                            {conversation.lastMessage && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                                {conversation.lastMessage.content}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                              {conversation.lastMessageAt 
                                ? new Date(conversation.lastMessageAt).toLocaleDateString()
                                : ''}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  })
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Conversation Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black">
                    {(() => {
                      const otherUser = getOtherParticipant(selectedConversation)
                      return (
                        <div className="flex items-center space-x-3">
                          {otherUser?.avatar ? (
                            <img
                              src={otherUser.avatar}
                              alt={otherUser.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {otherUser?.name || 'Unknown User'}
                            </h3>
                            {selectedConversation.listing && selectedConversation.listing._id && (
                              <Link
                                to={`/listings/${selectedConversation.listing._id}`}
                                className="text-sm text-primary-600 dark:text-white hover:text-primary-700 dark:hover:text-gray-300"
                              >
                                View Listing: {selectedConversation.listing.title}
                              </Link>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-black">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isOwn = message.sender._id === user._id
                        return (
                          <div
                            key={message._id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                isOwn
                                  ? 'bg-primary-600 dark:bg-white text-white dark:text-black'
                                  : 'bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white'
                              }`}
                            >
                              {!isOwn && (
                                <p className="text-xs font-semibold mb-1 opacity-75">
                                  {message.sender.name}
                                </p>
                              )}
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${isOwn ? 'text-primary-100 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>
                                {new Date(message.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        )
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-black dark:text-white dark:placeholder-gray-500"
                        disabled={sending}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <PaperAirplaneIcon className="w-5 h-5" />
                        <span>Send</span>
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  <div className="text-center">
                    <ChatBubbleLeftRightIcon className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MessagesPage

