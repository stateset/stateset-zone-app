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
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import Layout from '../components/Layout'

// Sample data - in a real app, this would come from your API
const revenueData = [
  { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
  { month: 'Feb', revenue: 52000, expenses: 35000, profit: 17000 },
  { month: 'Mar', revenue: 48000, expenses: 33000, profit: 15000 },
  { month: 'Apr', revenue: 61000, expenses: 38000, profit: 23000 },
  { month: 'May', revenue: 55000, expenses: 36000, profit: 19000 },
  { month: 'Jun', revenue: 67000, expenses: 42000, profit: 25000 },
]

const transactionData = [
  { name: 'Invoices', value: 45, color: '#3B82F6' },
  { name: 'Purchase Orders', value: 25, color: '#10B981' },
  { name: 'Loans', value: 20, color: '#8B5CF6' },
  { name: 'Contracts', value: 10, color: '#F59E0B' },
]

const activityData = [
  { date: 'Week 1', invoices: 12, orders: 8, loans: 3 },
  { date: 'Week 2', invoices: 15, orders: 12, loans: 5 },
  { date: 'Week 3', invoices: 18, orders: 10, loans: 4 },
  { date: 'Week 4', invoices: 22, orders: 15, loans: 7 },
]

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

export default function Analytics() {
  const { user } = useUser()
  const [timeRange, setTimeRange] = useState('6months')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-accent-800 p-3 rounded-lg shadow-lg border border-accent-200 dark:border-accent-700">
          <p className="font-medium text-accent-900 dark:text-accent-100">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? `$${entry.value.toLocaleString()}` : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

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

      <div className="min-h-screen bg-accent-50 dark:bg-accent-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mb-8"
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
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
          <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-accent-800 rounded-xl shadow-sm border border-accent-200 dark:border-accent-700 p-6"
            >
              <h3 className="text-lg font-semibold text-accent-900 dark:text-accent-100 mb-4">
                Revenue vs Expenses
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    className="text-accent-600 dark:text-accent-400"
                  />
                  <YAxis 
                    className="text-accent-600 dark:text-accent-400"
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="2"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.6}
                    name="Expenses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Transaction Distribution */}
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-accent-800 rounded-xl shadow-sm border border-accent-200 dark:border-accent-700 p-6"
            >
              <h3 className="text-lg font-semibold text-accent-900 dark:text-accent-100 mb-4">
                Transaction Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={transactionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {transactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.div>

          {/* Activity Chart */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-accent-800 rounded-xl shadow-sm border border-accent-200 dark:border-accent-700 p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-accent-900 dark:text-accent-100 mb-4">
              Weekly Activity
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  className="text-accent-600 dark:text-accent-400"
                />
                <YAxis 
                  className="text-accent-600 dark:text-accent-400"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="invoices" fill="#3B82F6" name="Invoices" radius={[4, 4, 0, 0]} />
                <Bar dataKey="orders" fill="#10B981" name="Orders" radius={[4, 4, 0, 0]} />
                <Bar dataKey="loans" fill="#8B5CF6" name="Loans" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
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
                <div key={index} className="flex items-center justify-between py-3 border-b border-accent-200 dark:border-accent-700 last:border-b-0">
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
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}