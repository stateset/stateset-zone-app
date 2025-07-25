import Head from 'next/head'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '@clerk/nextjs'
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  BanknotesIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'
import Layout from '../components/Layout'

const metrics = [
  {
    name: 'Total Revenue',
    value: '$328,000',
    change: '+12.5%',
    trend: 'up',
    icon: CurrencyDollarIcon,
    color: 'text-green-600',
  },
  {
    name: 'Active Invoices',
    value: '142',
    change: '+8.2%',
    trend: 'up',
    icon: DocumentTextIcon,
    color: 'text-blue-600',
  },
  {
    name: 'Purchase Orders',
    value: '89',
    change: '-2.4%',
    trend: 'down',
    icon: ShoppingBagIcon,
    color: 'text-orange-600',
  },
  {
    name: 'DeFi Loans',
    value: '$125,000',
    change: '+15.8%',
    trend: 'up',
    icon: BanknotesIcon,
    color: 'text-purple-600',
  },
]

const revenueData = [
  { month: 'Jan', amount: 45000 },
  { month: 'Feb', amount: 52000 },
  { month: 'Mar', amount: 48000 },
  { month: 'Apr', amount: 61000 },
  { month: 'May', amount: 55000 },
  { month: 'Jun', amount: 67000 },
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

// Simple chart component using CSS
function SimpleBarChart({ data, className = '' }) {
  const maxValue = Math.max(...data.map(d => d.amount))
  
  return (
    <div className={`space-y-3 ${className}`}>
      {data.map((item, index) => (
        <div key={item.month} className="flex items-center space-x-3">
          <div className="w-8 text-xs text-accent-600 dark:text-accent-400">
            {item.month}
          </div>
          <div className="flex-1 bg-accent-200 dark:bg-accent-700 rounded-full h-2 relative overflow-hidden">
            <motion.div
              className="bg-primary-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(item.amount / maxValue) * 100}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          </div>
          <div className="w-16 text-xs text-accent-900 dark:text-accent-100 text-right">
            ${(item.amount / 1000).toFixed(0)}k
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Analytics() {
  const { user } = useUser()
  const [timeRange, setTimeRange] = useState('6months')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <Layout title="Analytics - StateSet Zone">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Analytics - StateSet Zone">
      <Head>
        <title>Analytics - StateSet Zone</title>
        <meta name="description" content="Comprehensive analytics and insights for your business operations" />
      </Head>

      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-accent-900 dark:text-accent-100">
                Analytics Dashboard
              </h1>
              <p className="mt-2 text-accent-600 dark:text-accent-400">
                Comprehensive insights into your business operations
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white dark:bg-accent-800 border border-accent-300 dark:border-accent-600 rounded-lg px-4 py-2 text-accent-900 dark:text-accent-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
            </div>
          </motion.div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.name}
              variants={itemVariants}
              className="bg-white dark:bg-accent-800 rounded-xl shadow-sm border border-accent-200 dark:border-accent-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-accent-600 dark:text-accent-400">
                    {metric.name}
                  </p>
                  <p className="text-2xl font-bold text-accent-900 dark:text-accent-100">
                    {metric.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-accent-100 dark:bg-accent-700 ${metric.color}`}>
                  <metric.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {metric.trend === 'up' ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.change}
                </span>
                <span className="text-sm text-accent-500 ml-1">vs last period</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-accent-800 rounded-xl shadow-sm border border-accent-200 dark:border-accent-700 p-6"
          >
            <h3 className="text-lg font-semibold text-accent-900 dark:text-accent-100 mb-6">
              Monthly Revenue
            </h3>
            <SimpleBarChart data={revenueData} />
          </motion.div>

          {/* Transaction Distribution */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-accent-800 rounded-xl shadow-sm border border-accent-200 dark:border-accent-700 p-6"
          >
            <h3 className="text-lg font-semibold text-accent-900 dark:text-accent-100 mb-6">
              Transaction Distribution
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Invoices', value: 45, color: 'bg-blue-500' },
                { name: 'Purchase Orders', value: 25, color: 'bg-green-500' },
                { name: 'Loans', value: 20, color: 'bg-purple-500' },
                { name: 'Contracts', value: 10, color: 'bg-orange-500' },
              ].map((item, index) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm text-accent-900 dark:text-accent-100">{item.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-accent-200 dark:bg-accent-700 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${item.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <span className="text-sm font-medium text-accent-900 dark:text-accent-100 w-8">
                      {item.value}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-accent-800 rounded-xl shadow-sm border border-accent-200 dark:border-accent-700 p-6"
        >
          <h3 className="text-lg font-semibold text-accent-900 dark:text-accent-100 mb-4">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              { type: 'invoice', desc: 'Invoice #INV-001 created', time: '2 hours ago', status: 'created' },
              { type: 'order', desc: 'Purchase Order #PO-142 approved', time: '4 hours ago', status: 'approved' },
              { type: 'loan', desc: 'Loan application #LN-089 funded', time: '6 hours ago', status: 'funded' },
              { type: 'contract', desc: 'Smart contract deployed', time: '1 day ago', status: 'deployed' },
            ].map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between py-3 border-b border-accent-200 dark:border-accent-700 last:border-b-0"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'created' ? 'bg-blue-500' :
                    activity.status === 'approved' ? 'bg-green-500' :
                    activity.status === 'funded' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`}></div>
                  <p className="text-accent-900 dark:text-accent-100">{activity.desc}</p>
                </div>
                <span className="text-sm text-accent-500">{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  )
}