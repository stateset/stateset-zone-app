import { Fragment, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Dialog, Transition } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  BanknotesIcon,
  DocumentCheckIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline'
import { useTheme } from '../hooks/useTheme'

const navigation = [
  { name: 'Dashboard', href: '/home', icon: HomeIcon },
  { name: 'Invoices', href: '/invoices', icon: DocumentTextIcon },
  { name: 'Purchase Orders', href: '/purchaseorders', icon: ShoppingBagIcon },
  { name: 'Loans', href: '/loans', icon: BanknotesIcon },
  { name: 'Contracts', href: '/contracts', icon: DocumentCheckIcon },
  { name: 'Agreements', href: '/agreements', icon: DocumentCheckIcon },
  { name: 'Commerce', href: '/commerce', icon: ShoppingBagIcon },
  { name: 'B2B Commerce', href: '/b2b_commerce', icon: UserGroupIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Voting', href: '/vote', icon: UserGroupIcon },
  { name: 'Staking', href: '/stake', icon: BanknotesIcon },
]

const userNavigation = [
  { name: 'Profile', href: '/user/profile' },
  { name: 'Settings', href: '/user/settings' },
  { name: 'Wallet', href: '/wallet' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Layout({ children, title = 'StateSet Zone' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const pageTitle = title === 'StateSet Zone' ? title : `${title} - StateSet Zone`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="StateSet Zone - Modern DeFi application for business operations" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-accent-50 dark:bg-accent-900">
        {/* Mobile sidebar */}
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-accent-900/80 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-accent-800 px-6 pb-4 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center">
                      <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="text-xl font-bold text-gradient-primary">StateSet</span>
                      </Link>
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <Link
                                  href={item.href}
                                  className={classNames(
                                    router.pathname === item.href
                                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                                      : 'text-accent-700 hover:bg-accent-50 dark:text-accent-300 dark:hover:bg-accent-700',
                                    'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors'
                                  )}
                                >
                                  <item.icon
                                    className={classNames(
                                      router.pathname === item.href
                                        ? 'text-primary-600 dark:text-primary-400'
                                        : 'text-accent-400 group-hover:text-accent-600 dark:text-accent-400 dark:group-hover:text-accent-300',
                                      'h-6 w-6 shrink-0'
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-accent-800 px-6 pb-4 shadow-xl">
            <div className="flex h-16 shrink-0 items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold text-gradient-primary">StateSet Zone</span>
              </Link>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            router.pathname === item.href
                              ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                              : 'text-accent-700 hover:bg-accent-50 dark:text-accent-300 dark:hover:bg-accent-700',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors'
                          )}
                        >
                          <item.icon
                            className={classNames(
                              router.pathname === item.href
                                ? 'text-primary-600 dark:text-primary-400'
                                : 'text-accent-400 group-hover:text-accent-600 dark:text-accent-400 dark:group-hover:text-accent-300',
                              'h-6 w-6 shrink-0'
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-72">
          {/* Top bar */}
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-accent-200 dark:border-accent-700 bg-white/80 dark:bg-accent-800/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-accent-700 dark:text-accent-300 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div className="h-6 w-px bg-accent-900/10 dark:bg-accent-100/10 lg:hidden" aria-hidden="true" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex flex-1 items-center">
                <h1 className="text-lg font-semibold text-accent-900 dark:text-accent-100">
                  {title}
                </h1>
              </div>
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                {/* Theme toggle */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="p-2 text-accent-400 hover:text-accent-500 dark:text-accent-500 dark:hover:text-accent-400 transition-colors"
                >
                  <span className="sr-only">Toggle theme</span>
                  {theme === 'dark' ? (
                    <SunIcon className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MoonIcon className="h-6 w-6" aria-hidden="true" />
                  )}
                </button>

                {/* Separator */}
                <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-accent-900/10 dark:lg:bg-accent-100/10" aria-hidden="true" />

                {/* Profile dropdown */}
                <SignedIn>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8"
                      }
                    }}
                    userProfileMode="navigation"
                    userProfileUrl="/user"
                    afterSignOutUrl="/"
                  />
                </SignedIn>
                <SignedOut>
                  <Link href="/sign-in" className="btn-primary">
                    Sign In
                  </Link>
                </SignedOut>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <main className="py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={router.pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="page-transition"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}