import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import {
  PlusIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  BanknotesIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

const quickActions = [
  {
    name: 'Create Invoice',
    description: 'Generate a new invoice',
    href: '/invoices/create',
    icon: DocumentTextIcon,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    name: 'New Purchase Order',
    description: 'Create purchase order',
    href: '/purchaseorders/create',
    icon: ShoppingBagIcon,
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    name: 'Apply for Loan',
    description: 'Request financing',
    href: '/loans/create',
    icon: BanknotesIcon,
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    name: 'Deploy Contract',
    description: 'Create smart contract',
    href: '/contracts/create',
    icon: DocumentCheckIcon,
    color: 'bg-orange-500 hover:bg-orange-600',
  },
]

const metrics = [
  {
    name: 'Total Revenue',
    value: '$45,231.89',
    change: '+20.1%',
    changeType: 'positive',
    icon: BanknotesIcon,
  },
  {
    name: 'Active Contracts',
    value: '12',
    change: '+2',
    changeType: 'positive',
    icon: DocumentCheckIcon,
  },
  {
    name: 'Pending Invoices',
    value: '8',
    change: '-3',
    changeType: 'negative',
    icon: DocumentTextIcon,
  },
  {
    name: 'Loan Portfolio',
    value: '$12,405.00',
    change: '+5.2%',
    changeType: 'positive',
    icon: ChartBarIcon,
  },
]

const recentActivity = [
  {
    id: 1,
    type: 'invoice',
    title: 'Invoice #INV-2024-001 paid',
    description: 'Payment received from Acme Corp',
    time: '2 hours ago',
    status: 'completed',
    amount: '$2,500.00',
  },
  {
    id: 2,
    type: 'loan',
    title: 'Loan application approved',
    description: 'DeFi loan for working capital',
    time: '4 hours ago',
    status: 'approved',
    amount: '$15,000.00',
  },
  {
    id: 3,
    type: 'contract',
    title: 'Smart contract deployed',
    description: 'Supply chain contract activated',
    time: '1 day ago',
    status: 'active',
    amount: null,
  },
  {
    id: 4,
    type: 'purchase_order',
    title: 'Purchase Order #PO-2024-001',
    description: 'New order from supplier',
    time: '2 days ago',
    status: 'pending',
    amount: '$8,750.00',
  },
]

const statusColors = {
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  active: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
}

const statusIcons = {
  completed: CheckCircleIcon,
  approved: CheckCircleIcon,
  active: EyeIcon,
  pending: ClockIcon,
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="spinner w-8 h-8" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Head>
        <title>Dashboard - StateSet Zone</title>
      </Head>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-accent-900 dark:text-accent-100">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="mt-1 text-sm text-accent-600 dark:text-accent-400">
              Here's what's happening with your business operations today.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="btn-outline">
              <ChartBarIcon className="h-4 w-4 mr-2" />
              Export Data
            </button>
            <button className="btn-primary">
              <PlusIcon className="h-4 w-4 mr-2" />
              Quick Action
            </button>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-accent-600 dark:text-accent-400">
                      {metric.name}
                    </p>
                    <p className="text-2xl font-semibold text-accent-900 dark:text-accent-100">
                      {metric.value}
                    </p>
                  </div>
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                    <metric.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {metric.changeType === 'positive' ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={classNames(
                    metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600',
                    'text-sm font-medium'
                  )}>
                    {metric.change}
                  </span>
                  <span className="text-sm text-accent-500 ml-1">from last month</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-accent-900 dark:text-accent-100">
              Quick Actions
            </h2>
            <p className="text-sm text-accent-600 dark:text-accent-400">
              Start your most common tasks
            </p>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={action.href}
                    className="group relative block p-6 border border-accent-200 dark:border-accent-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className={classNames(action.color, 'p-3 rounded-lg transition-colors')}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-accent-900 dark:text-accent-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                          {action.name}
                        </h3>
                        <p className="text-xs text-accent-600 dark:text-accent-400">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity and Summary */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-accent-900 dark:text-accent-100">
                  Recent Activity
                </h2>
                <Link href="/activity" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                  View all
                </Link>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="divide-y divide-accent-200 dark:divide-accent-700">
                {recentActivity.map((activity, index) => {
                  const StatusIcon = statusIcons[activity.status]
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-6 hover:bg-accent-50 dark:hover:bg-accent-800/50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <StatusIcon className="h-5 w-5 text-accent-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-accent-900 dark:text-accent-100">
                            {activity.title}
                          </p>
                          <p className="text-sm text-accent-600 dark:text-accent-400">
                            {activity.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          {activity.amount && (
                            <p className="text-sm font-medium text-accent-900 dark:text-accent-100">
                              {activity.amount}
                            </p>
                          )}
                          <p className="text-xs text-accent-500">{activity.time}</p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={classNames(
                            statusColors[activity.status],
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
                          )}>
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="space-y-6">
            {/* Blockchain Status */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-sm font-medium text-accent-900 dark:text-accent-100">
                  Network Status
                </h3>
              </div>
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-sm text-accent-600 dark:text-accent-400">StateSet Network</span>
                  </div>
                  <span className="text-sm font-medium text-green-600">Online</span>
                </div>
                <div className="mt-3 text-xs text-accent-500">
                  Block Height: 1,234,567
                </div>
              </div>
            </div>

            {/* Wallet Summary */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-sm font-medium text-accent-900 dark:text-accent-100">
                  Wallet Summary
                </h3>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-accent-600 dark:text-accent-400">STATE Balance</span>
                    <span className="text-sm font-medium text-accent-900 dark:text-accent-100">1,250.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-accent-600 dark:text-accent-400">USD Value</span>
                    <span className="text-sm font-medium text-accent-900 dark:text-accent-100">$3,126.25</span>
                  </div>
                  <div className="pt-2 border-t border-accent-200 dark:border-accent-700">
                    <Link href="/wallet" className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                      Manage Wallet →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-sm font-medium text-accent-900 dark:text-accent-100">
                  Quick Links
                </h3>
              </div>
              <div className="card-body">
                <div className="space-y-2">
                  <Link href="/analytics" className="block text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                    View Analytics
                  </Link>
                  <Link href="/vote" className="block text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                    Governance Voting
                  </Link>
                  <Link href="/stake" className="block text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                    Stake Tokens
                  </Link>
                  <Link href="/support" className="block text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                    Get Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

Dashboard.displayName = 'Dashboard'
