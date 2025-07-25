import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BellIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  BanknotesIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

const mockNotifications = [
  {
    id: 1,
    type: 'invoice',
    title: 'Invoice Payment Received',
    message: 'Payment of $2,500 received for Invoice #INV-001',
    time: '2 minutes ago',
    read: false,
    priority: 'high',
    icon: DocumentTextIcon,
    color: 'text-green-600 bg-green-100',
  },
  {
    id: 2,
    type: 'order',
    title: 'Purchase Order Approved',
    message: 'PO-142 has been approved and is ready for processing',
    time: '15 minutes ago',
    read: false,
    priority: 'medium',
    icon: ShoppingBagIcon,
    color: 'text-blue-600 bg-blue-100',
  },
  {
    id: 3,
    type: 'loan',
    title: 'Loan Application Update',
    message: 'Your loan application #LN-089 requires additional documentation',
    time: '1 hour ago',
    read: true,
    priority: 'medium',
    icon: BanknotesIcon,
    color: 'text-orange-600 bg-orange-100',
  },
  {
    id: 4,
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight at 2:00 AM EST',
    time: '3 hours ago',
    read: true,
    priority: 'low',
    icon: InformationCircleIcon,
    color: 'text-gray-600 bg-gray-100',
  },
]

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const count = notifications.filter(n => !n.read).length
    setUnreadCount(count)
  }, [notifications])

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-gray-500'
      default: return 'border-l-gray-500'
    }
  }

  return (
    <>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-accent-600 dark:text-accent-300 hover:text-accent-900 dark:hover:text-accent-100 transition-colors duration-200"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Notification Panel */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col bg-white dark:bg-accent-900 shadow-xl">
                      {/* Header */}
                      <div className="border-b border-accent-200 dark:border-accent-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-lg font-semibold text-accent-900 dark:text-accent-100">
                            Notifications
                          </Dialog.Title>
                          <div className="flex items-center space-x-2">
                            {unreadCount > 0 && (
                              <button
                                onClick={markAllAsRead}
                                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                              >
                                Mark all read
                              </button>
                            )}
                            <button
                              onClick={() => setIsOpen(false)}
                              className="rounded-md text-accent-400 hover:text-accent-500 dark:text-accent-500 dark:hover:text-accent-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <XMarkIcon className="h-6 w-6" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Notification List */}
                      <div className="flex-1 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
                            <BellIcon className="h-12 w-12 text-accent-300 dark:text-accent-600 mb-4" />
                            <h3 className="text-lg font-medium text-accent-900 dark:text-accent-100 mb-2">
                              No notifications
                            </h3>
                            <p className="text-accent-500">
                              You're all caught up! New notifications will appear here.
                            </p>
                          </div>
                        ) : (
                          <div className="divide-y divide-accent-200 dark:divide-accent-700">
                            <AnimatePresence>
                              {notifications.map((notification) => (
                                <motion.div
                                  key={notification.id}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  className={`relative px-6 py-4 hover:bg-accent-50 dark:hover:bg-accent-800 border-l-4 ${getPriorityColor(notification.priority)} ${
                                    !notification.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                                  }`}
                                >
                                  <div className="flex items-start space-x-3">
                                    <div className={`flex-shrink-0 p-2 rounded-full ${notification.color}`}>
                                      <notification.icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <p className={`text-sm font-medium ${
                                            !notification.read 
                                              ? 'text-accent-900 dark:text-accent-100' 
                                              : 'text-accent-700 dark:text-accent-300'
                                          }`}>
                                            {notification.title}
                                          </p>
                                          <p className={`mt-1 text-sm ${
                                            !notification.read 
                                              ? 'text-accent-700 dark:text-accent-300' 
                                              : 'text-accent-500'
                                          }`}>
                                            {notification.message}
                                          </p>
                                          <div className="mt-2 flex items-center space-x-4">
                                            <span className="flex items-center text-xs text-accent-500">
                                              <ClockIcon className="h-3 w-3 mr-1" />
                                              {notification.time}
                                            </span>
                                            {!notification.read && (
                                              <span className="flex items-center text-xs text-primary-600 dark:text-primary-400">
                                                <div className="w-2 h-2 bg-primary-500 rounded-full mr-1"></div>
                                                New
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-1 ml-2">
                                          {!notification.read && (
                                            <button
                                              onClick={() => markAsRead(notification.id)}
                                              className="p-1 rounded text-accent-400 hover:text-accent-600 dark:text-accent-500 dark:hover:text-accent-300"
                                              title="Mark as read"
                                            >
                                              <CheckIcon className="h-4 w-4" />
                                            </button>
                                          )}
                                          <button
                                            onClick={() => deleteNotification(notification.id)}
                                            className="p-1 rounded text-accent-400 hover:text-red-600 dark:text-accent-500 dark:hover:text-red-400"
                                            title="Delete"
                                          >
                                            <XMarkIcon className="h-4 w-4" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      {notifications.length > 0 && (
                        <div className="border-t border-accent-200 dark:border-accent-700 px-6 py-4">
                          <button className="w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                            View all notifications
                          </button>
                        </div>
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}