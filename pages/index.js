import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import {
  ArrowRightIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  BanknotesIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CubeTransparentIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Invoice Management',
    description: 'Create, track, and manage invoices with automated workflows and real-time status updates.',
    icon: DocumentTextIcon,
    href: '/invoices',
  },
  {
    name: 'Purchase Orders',
    description: 'Streamline procurement with intelligent purchase order management and supplier integration.',
    icon: ShoppingBagIcon,
    href: '/purchaseorders',
  },
  {
    name: 'DeFi Loans',
    description: 'Access decentralized lending and borrowing with competitive rates and transparent terms.',
    icon: BanknotesIcon,
    href: '/loans',
  },
  {
    name: 'Smart Contracts',
    description: 'Deploy and manage smart contracts for automated business processes and agreements.',
    icon: DocumentCheckIcon,
    href: '/contracts',
  },
  {
    name: 'Commerce Platform',
    description: 'Build and scale your e-commerce operations with integrated payment and inventory systems.',
    icon: ShoppingBagIcon,
    href: '/commerce',
  },
  {
    name: 'Analytics Dashboard',
    description: 'Gain insights with comprehensive analytics and reporting across all business operations.',
    icon: ChartBarIcon,
    href: '/analytics',
  },
]

const stats = [
  { id: 1, name: 'Total Transactions', value: '$2.4B+' },
  { id: 2, name: 'Active Users', value: '12K+' },
  { id: 3, name: 'Smart Contracts', value: '1.2K+' },
  { id: 4, name: 'Success Rate', value: '99.9%' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

export default function HomePage() {
  return (
    <div className="bg-white dark:bg-accent-900">
      <Head>
        <title>StateSet Zone - Modern DeFi for Business Operations</title>
        <meta
          name="description"
          content="Transform your business operations with StateSet Zone's comprehensive DeFi platform. Manage invoices, loans, contracts, and more with blockchain technology."
        />
      </Head>

      {/* Hero section */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-400 to-secondary-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-40 lg:flex lg:px-8 lg:pt-40">
          <motion.div 
            className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center space-x-2 rounded-full bg-primary-50 dark:bg-primary-900/20 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 ring-1 ring-inset ring-primary-200 dark:ring-primary-800">
                <ShieldCheckIcon className="h-4 w-4" />
                <span>Powered by Cosmos SDK</span>
              </div>
            </motion.div>

            <motion.h1 
              className="mt-10 text-4xl font-bold tracking-tight text-accent-900 dark:text-accent-100 sm:text-6xl"
              variants={itemVariants}
            >
              Modern DeFi for{' '}
              <span className="text-gradient-primary">Business Operations</span>
            </motion.h1>

            <motion.p 
              className="mt-6 text-lg leading-8 text-accent-600 dark:text-accent-300"
              variants={itemVariants}
            >
              Transform your business with StateSet Zone's comprehensive DeFi platform. 
              Manage invoices, loans, contracts, and commerce operations with the power 
              of blockchain technology and automated workflows.
            </motion.p>

            <motion.div 
              className="mt-10 flex items-center gap-x-6"
              variants={itemVariants}
            >
              <SignedOut>
                <Link href="/sign-up" className="btn-primary">
                  Get Started
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
                <Link href="/sign-in" className="btn-outline">
                  Sign In
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/home" className="btn-primary">
                  Go to Dashboard
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </SignedIn>
            </motion.div>
          </motion.div>

          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <motion.div
                className="relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <div className="glass rounded-2xl p-8">
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat) => (
                      <div key={stat.id} className="text-center">
                        <div className="text-2xl font-bold text-gradient-primary">{stat.value}</div>
                        <div className="text-sm text-accent-600 dark:text-accent-400">{stat.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-secondary-400 to-primary-400 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-base font-semibold leading-7 text-primary-600 dark:text-primary-400"
            variants={itemVariants}
          >
            Everything you need
          </motion.h2>
          <motion.p 
            className="mt-2 text-3xl font-bold tracking-tight text-accent-900 dark:text-accent-100 sm:text-4xl"
            variants={itemVariants}
          >
            Complete business operations platform
          </motion.p>
          <motion.p 
            className="mt-6 text-lg leading-8 text-accent-600 dark:text-accent-300"
            variants={itemVariants}
          >
            From financial management to smart contracts, StateSet Zone provides all the tools 
            you need to run modern, efficient business operations on the blockchain.
          </motion.p>
        </motion.div>

        <motion.div 
          className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name} 
                className="flex flex-col"
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
              >
                <dt className="text-base font-semibold leading-7 text-accent-900 dark:text-accent-100">
                  <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-accent-600 dark:text-accent-300">
                  <p className="flex-auto">{feature.description}</p>
                  <p className="mt-6">
                    <Link 
                      href={feature.href} 
                      className="text-sm font-semibold leading-6 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    >
                      Learn more <span aria-hidden="true">→</span>
                    </Link>
                  </p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>
      </div>

      {/* CTA section */}
      <div className="relative isolate mt-32 px-6 py-32 sm:mt-40 sm:py-40 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div
            className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-secondary-400 to-primary-400 opacity-20 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        
        <motion.div 
          className="mx-auto max-w-2xl text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-3xl font-bold tracking-tight text-accent-900 dark:text-accent-100 sm:text-4xl"
            variants={itemVariants}
          >
            Ready to transform your business?
          </motion.h2>
          <motion.p 
            className="mx-auto mt-6 max-w-xl text-lg leading-8 text-accent-600 dark:text-accent-300"
            variants={itemVariants}
          >
            Join thousands of businesses already using StateSet Zone to streamline 
            their operations and embrace the future of decentralized finance.
          </motion.p>
          <motion.div 
            className="mt-10 flex items-center justify-center gap-x-6"
            variants={itemVariants}
          >
            <SignedOut>
              <Link href="/sign-up" className="btn-primary">
                Get Started Now
              </Link>
              <Link href="/docs" className="btn-ghost">
                View Documentation <span aria-hidden="true">→</span>
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/home" className="btn-primary">
                Access Dashboard
              </Link>
            </SignedIn>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-accent-200 dark:border-accent-700 bg-white dark:bg-accent-800">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gradient-primary">StateSet Zone</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-accent-600 dark:text-accent-400">
              <a href="https://docs.stateset.io" className="hover:text-accent-900 dark:hover:text-accent-100 transition-colors">
                Documentation
              </a>
              <a href="https://rpc.stateset.zone" className="hover:text-accent-900 dark:hover:text-accent-100 transition-colors">
                RPC Endpoint
              </a>
              <a href="/whitepaper.pdf" className="hover:text-accent-900 dark:hover:text-accent-100 transition-colors">
                Whitepaper
              </a>
              <a href="https://github.com/stateset" className="hover:text-accent-900 dark:hover:text-accent-100 transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}