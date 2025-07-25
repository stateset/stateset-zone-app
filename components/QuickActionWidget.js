import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  PlusIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  BanknotesIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

const quickActions = [
  {
    id: 'create-invoice',
    name: 'Create Invoice',
    description: 'Generate a new invoice for your clients',
    href: '/invoices/create',
    icon: DocumentTextIcon,
    color: 'bg-gradient-to-r from-blue-500 to-blue-600',
    hoverColor: 'hover:from-blue-600 hover:to-blue-700',
    shortcut: 'I',
  },
  {
    id: 'new-order',
    name: 'Purchase Order',
    description: 'Create a new purchase order',
    href: '/orders/create',
    icon: ShoppingBagIcon,
    color: 'bg-gradient-to-r from-green-500 to-green-600',
    hoverColor: 'hover:from-green-600 hover:to-green-700',
    shortcut: 'P',
  },
  {
    id: 'apply-loan',
    name: 'Apply for Loan',
    description: 'Submit a new loan application',
    href: '/loans/create',
    icon: BanknotesIcon,
    color: 'bg-gradient-to-r from-purple-500 to-purple-600',
    hoverColor: 'hover:from-purple-600 hover:to-purple-700',
    shortcut: 'L',
  },
  {
    id: 'deploy-contract',
    name: 'Smart Contract',
    description: 'Deploy a new smart contract',
    href: '/contracts/create',
    icon: DocumentCheckIcon,
    color: 'bg-gradient-to-r from-orange-500 to-orange-600',
    hoverColor: 'hover:from-orange-600 hover:to-orange-700',
    shortcut: 'C',
  },
  {
    id: 'view-analytics',
    name: 'Analytics',
    description: 'View business insights and reports',
    href: '/analytics',
    icon: ChartBarIcon,
    color: 'bg-gradient-to-r from-indigo-500 to-indigo-600',
    hoverColor: 'hover:from-indigo-600 hover:to-indigo-700',
    shortcut: 'A',
  },
  {
    id: 'manage-team',
    name: 'Team Management',
    description: 'Manage team members and permissions',
    href: '/users',
    icon: UserGroupIcon,
    color: 'bg-gradient-to-r from-pink-500 to-pink-600',
    hoverColor: 'hover:from-pink-600 hover:to-pink-700',
    shortcut: 'T',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function QuickActionWidget({ title = "Quick Actions", showAll = false }) {
  const actionsToShow = showAll ? quickActions : quickActions.slice(0, 4)

  return (
    <div className="bg-white dark:bg-accent-800 rounded-xl shadow-sm border border-accent-200 dark:border-accent-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-accent-900 dark:text-accent-100">
          {title}
        </h3>
        {!showAll && quickActions.length > 4 && (
          <Link
            href="/dashboard/actions"
            className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center"
          >
            View all
            <ArrowRightIcon className="h-4 w-4 ml-1" />
          </Link>
        )}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {actionsToShow.map((action) => (
          <motion.div key={action.id} variants={itemVariants}>
            <Link href={action.href}>
              <div className={`
                group relative overflow-hidden rounded-lg ${action.color} ${action.hoverColor} 
                text-white p-4 transition-all duration-200 transform hover:scale-105 
                hover:shadow-lg cursor-pointer
              `}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <action.icon className="h-6 w-6 mr-2" />
                      <h4 className="font-semibold text-sm">{action.name}</h4>
                    </div>
                    <p className="text-xs opacity-90 line-clamp-2">
                      {action.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <kbd className="hidden sm:block bg-white/20 backdrop-blur-sm rounded px-2 py-1 text-xs font-mono">
                      {action.shortcut}
                    </kbd>
                    <ArrowRightIcon className="h-4 w-4 mt-2 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                
                {/* Decorative background pattern */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-white/10 rounded-full"></div>
                <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-12 h-12 bg-black/10 rounded-full"></div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Add keyboard shortcut listener hint */}
      <div className="mt-4 text-xs text-accent-500 text-center">
        <span className="hidden sm:inline">
          Use keyboard shortcuts or click to access actions quickly
        </span>
        <span className="sm:hidden">
          Tap to access actions quickly
        </span>
      </div>
    </div>
  )
}

// Compact version for sidebars or mobile
export function CompactQuickActions({ maxItems = 3 }) {
  const compactActions = quickActions.slice(0, maxItems)

  return (
    <div className="space-y-2">
      {compactActions.map((action) => (
        <Link key={action.id} href={action.href}>
          <div className="flex items-center p-3 rounded-lg bg-accent-50 dark:bg-accent-700 hover:bg-accent-100 dark:hover:bg-accent-600 transition-colors group">
            <div className={`p-2 rounded-lg ${action.color} mr-3`}>
              <action.icon className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-accent-900 dark:text-accent-100 truncate">
                {action.name}
              </p>
              <p className="text-xs text-accent-500 truncate">
                {action.description}
              </p>
            </div>
            <ArrowRightIcon className="h-4 w-4 text-accent-400 group-hover:text-accent-600 dark:group-hover:text-accent-300 transform group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      ))}
    </div>
  )
}

// Floating action button for mobile
export function FloatingActionButton() {
  return (
    <div className="fixed bottom-6 right-6 z-40 sm:hidden">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="bg-primary-500 hover:bg-primary-600 text-white rounded-full p-4 shadow-lg"
      >
        <PlusIcon className="h-6 w-6" />
      </motion.button>
    </div>
  )
}