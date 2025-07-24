import Head from 'next/head';
import { useState, useEffect } from 'react';
import OnboardingBar from 'components/OnboardingBar';
import CreateOrder from 'components/transactions/CreateOrder';
import { ShoppingCartIcon, CurrencyDollarIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/outline';
import { motion } from 'framer-motion';

let easing = [0.175, 0.85, 0.42, 0.96];

const textVariants = {
    exit: { y: 100, opacity: 0, transition: { duration: 0.5, ease: easing } },
    enter: {
        y: 0,
        opacity: 1,
        transition: { delay: 0.1, duration: 0.5, ease: easing }
    }
};

// Sample products for demonstration
const SAMPLE_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Stateset Mug',
    description: 'Premium ceramic mug with Stateset logo',
    price: 24.99,
    image: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
    category: 'Accessories'
  },
  {
    id: 'prod_2',
    name: 'Blockchain T-Shirt',
    description: 'Comfortable cotton t-shirt with crypto design',
    price: 39.99,
    image: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
    category: 'Apparel'
  },
  {
    id: 'prod_3',
    name: 'DeFi Notebook',
    description: 'Professional notebook for tracking DeFi investments',
    price: 19.99,
    image: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg',
    category: 'Stationery'
  },
  {
    id: 'prod_4',
    name: 'Cosmos SDK Guide',
    description: 'Comprehensive guide to building on Cosmos',
    price: 49.99,
    image: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg',
    category: 'Books'
  },
  {
    id: 'prod_5',
    name: 'Hardware Wallet',
    description: 'Secure hardware wallet for crypto storage',
    price: 129.99,
    image: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg',
    category: 'Hardware'
  },
  {
    id: 'prod_6',
    name: 'Stablecoin Sticker Pack',
    description: 'Collection of stablecoin and DeFi stickers',
    price: 9.99,
    image: 'https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg',
    category: 'Accessories'
  }
];

const STABLECOIN_STATS = [
  { name: 'USDC', volume: '$125.4M', apy: '0%', description: 'Circle USD Coin via Noble' },
  { name: 'USDT', volume: '$89.2M', apy: '0%', description: 'Tether USD via Stable Chain' },
  { name: 'USDY', volume: '$45.8M', apy: '4.5%', description: 'Ondo yield-bearing USD' },
  { name: 'SILK', volume: '$12.3M', apy: '0%', description: 'Shade privacy stablecoin' },
  { name: 'EURe', volume: '$8.7M', apy: '0%', description: 'Monerium EUR emoney' }
];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', ...new Set(SAMPLE_PRODUCTS.map(p => p.category))];

  const filteredProducts = selectedCategory === 'All' 
    ? SAMPLE_PRODUCTS 
    : SAMPLE_PRODUCTS.filter(p => p.category === selectedCategory);

  const handleOrderCreated = (order, settlement) => {
    console.log('Order created:', order);
    console.log('Settlement:', settlement);
    
    // Add to orders list
    setOrders(prev => [...prev, {
      ...order,
      settlement,
      status: 'paid',
      fulfillment_status: 'processing'
    }]);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="">
      <Head>
        <title>Orders - Stateset Zone</title>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <OnboardingBar />
      
      <div className="min-h-screen dark:bg-slate-900 bg-white">
        <div className="flex overflow-hidden">
          <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              
              {/* Header */}
              <div className="mb-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                      E-Commerce Orders
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Create and manage orders with stablecoin settlements on Stateset Network
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <CreateOrder 
                      products={SAMPLE_PRODUCTS} 
                      onOrderCreated={handleOrderCreated}
                    />
                  </div>
                </div>
              </div>

              {/* Stablecoin Stats */}
              <motion.div 
                initial="exit" 
                animate="enter" 
                exit="exit"
                variants={textVariants}
                className="mb-8"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Supported Stablecoins
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {STABLECOIN_STATS.map((coin) => (
                    <div key={coin.name} className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{coin.name}</h3>
                        <CurrencyDollarIcon className="h-5 w-5 text-blue-500" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{coin.description}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">24h Volume:</span>
                          <span className="font-medium">{coin.volume}</span>
                        </div>
                        {coin.apy !== '0%' && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">APY:</span>
                            <span className="font-medium text-green-600">{coin.apy}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Products Section */}
              <motion.div 
                initial="exit" 
                animate="enter" 
                exit="exit"
                variants={textVariants}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Available Products
                  </h2>
                  
                  {/* Category Filter */}
                  <div className="flex space-x-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          selectedCategory === category
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-w-1 aspect-h-1 bg-gray-200 dark:bg-slate-700">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-blue-600">
                            ${product.price}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                            {product.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Orders */}
              {orders.length > 0 && (
                <motion.div 
                  initial="exit" 
                  animate="enter" 
                  exit="exit"
                  variants={textVariants}
                  className="mb-8"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Recent Orders
                  </h2>
                  
                  <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-slate-900">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Order
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Items
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Payment
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Transaction
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {order.id.substring(0, 8)}...
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(order.created_at).toLocaleDateString()}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900 dark:text-white">
                                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {order.items.map(item => item.name).join(', ')}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white">
                                  {order.payment.currency}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {order.payment.method}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                ${order.amounts.total_amount.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {getStatusIcon(order.status)}
                                  <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                    {order.status}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {order.settlement?.transaction_hash ? (
                                  <a 
                                    href={`https://explorer.stateset.zone/tx/${order.settlement.transaction_hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-mono"
                                  >
                                    {order.settlement.transaction_hash.substring(0, 8)}...
                                  </a>
                                ) : (
                                  <span className="text-gray-400 text-sm">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Features Section */}
              <motion.div 
                initial="exit" 
                animate="enter" 
                exit="exit"
                variants={textVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center mb-4">
                    <ShoppingCartIcon className="h-8 w-8 text-blue-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      E-Commerce Orders
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Create comprehensive e-commerce orders with multiple items, shipping details, and automatic tax calculation.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center mb-4">
                    <CurrencyDollarIcon className="h-8 w-8 text-green-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Stablecoin Settlement
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Accept payments in multiple stablecoins including USDC, USDT, USDY, SILK, and EURe with instant settlement.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircleIcon className="h-8 w-8 text-purple-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Blockchain Verification
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    All transactions are recorded on the Stateset blockchain with cryptographic proof and instant finality.
                  </p>
                </div>
              </motion.div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}