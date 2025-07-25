import { Fragment, useState, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

const toastTypes = {
  success: {
    icon: CheckCircleIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  error: {
    icon: XCircleIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    borderColor: 'border-red-200 dark:border-red-800',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
  },
  info: {
    icon: InformationCircleIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
}

// Individual Toast Component
function Toast({ toast, onDismiss }) {
  const [isVisible, setIsVisible] = useState(true)
  const type = toastTypes[toast.type] || toastTypes.info
  const Icon = type.icon

  useEffect(() => {
    if (toast.autoClose !== false) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onDismiss(toast.id), 300) // Wait for animation
      }, toast.duration || 5000)

      return () => clearTimeout(timer)
    }
  }, [toast.id, toast.autoClose, toast.duration, onDismiss])

  return (
    <Transition
      show={isVisible}
      as={Fragment}
      enter="transform ease-out duration-300 transition"
      enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enterTo="translate-y-0 opacity-100 sm:translate-x-0"
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.95 }}
        className={`
          w-full max-w-sm mx-auto bg-white dark:bg-accent-800 rounded-lg shadow-lg border
          ${type.bgColor} ${type.borderColor}
        `}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Icon className={`h-6 w-6 ${type.color}`} />
            </div>
            <div className="ml-3 w-0 flex-1">
              {toast.title && (
                <p className="text-sm font-medium text-accent-900 dark:text-accent-100">
                  {toast.title}
                </p>
              )}
              <p className={`text-sm ${toast.title ? 'mt-1' : ''} text-accent-600 dark:text-accent-400`}>
                {toast.message}
              </p>
              {toast.action && (
                <div className="mt-3">
                  <button
                    onClick={toast.action.onClick}
                    className={`text-sm font-medium ${type.color} hover:underline`}
                  >
                    {toast.action.label}
                  </button>
                </div>
              )}
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={() => {
                  setIsVisible(false)
                  setTimeout(() => onDismiss(toast.id), 300)
                }}
                className="inline-flex text-accent-400 hover:text-accent-500 dark:text-accent-500 dark:hover:text-accent-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          {toast.progress && (
            <div className="mt-2 w-full bg-accent-200 dark:bg-accent-700 rounded-full h-1">
              <motion.div
                className={`h-1 rounded-full ${type.color.replace('text-', 'bg-')}`}
                initial={{ width: 0 }}
                animate={{ width: `${toast.progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </Transition>
  )
}

// Toast Container Component
export default function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="fixed top-0 right-0 z-50 p-6 space-y-4 pointer-events-none">
      <div className="w-full max-w-sm pointer-events-auto">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              toast={toast}
              onDismiss={onDismiss}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Toast Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState([])

  const addToast = (toast) => {
    const id = Date.now() + Math.random()
    const newToast = {
      id,
      type: 'info',
      autoClose: true,
      duration: 5000,
      ...toast,
    }
    setToasts(prev => [...prev, newToast])
    return id
  }

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const updateToast = (id, updates) => {
    setToasts(prev => prev.map(toast => 
      toast.id === id ? { ...toast, ...updates } : toast
    ))
  }

  const clearAll = () => {
    setToasts([])
  }

  // Convenience methods
  const success = (message, options = {}) => 
    addToast({ type: 'success', message, ...options })

  const error = (message, options = {}) => 
    addToast({ type: 'error', message, ...options })

  const warning = (message, options = {}) => 
    addToast({ type: 'warning', message, ...options })

  const info = (message, options = {}) => 
    addToast({ type: 'info', message, ...options })

  const loading = (message, options = {}) => 
    addToast({ 
      type: 'info', 
      message, 
      autoClose: false,
      progress: 0,
      ...options 
    })

  return {
    toasts,
    addToast,
    removeToast,
    updateToast,
    clearAll,
    success,
    error,
    warning,
    info,
    loading,
  }
}

// Toast Provider Component (optional, for global toast management)
export function ToastProvider({ children }) {
  const toast = useToast()

  return (
    <>
      {children}
      <ToastContainer toasts={toast.toasts} onDismiss={toast.removeToast} />
    </>
  )
}