import { motion } from 'framer-motion'

const spinVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

const pulseVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export default function LoadingSpinner({ 
  size = 'md', 
  variant = 'spin',
  color = 'primary',
  text = null,
  className = ''
}) {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    accent: 'text-accent-600',
    white: 'text-white',
    current: 'text-current'
  }

  const SpinnerIcon = ({ className }) => (
    <motion.div
      className={`border-2 border-current border-t-transparent rounded-full ${className}`}
      variants={variant === 'spin' ? spinVariants : pulseVariants}
      animate="animate"
    />
  )

  const DotsSpinner = ({ className }) => (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-current rounded-full"
          animate={{
            y: [0, -8, 0],
            transition: {
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1
            }
          }}
        />
      ))}
    </div>
  )

  const PulseSpinner = ({ className }) => (
    <motion.div
      className={`bg-current rounded-full ${className}`}
      variants={pulseVariants}
      animate="animate"
    />
  )

  const renderSpinner = () => {
    const spinnerClass = `${sizeClasses[size]} ${colorClasses[color]} ${className}`

    switch (variant) {
      case 'dots':
        return <DotsSpinner className={spinnerClass} />
      case 'pulse':
        return <PulseSpinner className={spinnerClass} />
      default:
        return <SpinnerIcon className={spinnerClass} />
    }
  }

  if (text) {
    return (
      <div className="flex flex-col items-center space-y-3">
        {renderSpinner()}
        <motion.p
          className={`text-sm ${colorClasses[color]} font-medium`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      </div>
    )
  }

  return renderSpinner()
}

// Page-level loading component
export function PageLoading({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center min-h-96">
      <LoadingSpinner 
        size="lg" 
        variant="spin" 
        color="primary" 
        text={message}
      />
    </div>
  )
}

// Overlay loading component
export function OverlayLoading({ message = "Processing..." }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-accent-800 rounded-xl p-8 shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <LoadingSpinner 
          size="lg" 
          variant="spin" 
          color="primary" 
          text={message}
        />
      </motion.div>
    </motion.div>
  )
}

// Button loading state
export function ButtonLoading({ size = 'sm' }) {
  return (
    <LoadingSpinner 
      size={size} 
      variant="spin" 
      color="current"
      className="mr-2"
    />
  )
}