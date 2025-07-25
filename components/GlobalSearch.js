import { Fragment, useState, useEffect, useRef } from 'react'
import { Dialog, Transition, Combobox } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ShoppingBagIcon,
  BanknotesIcon,
  DocumentCheckIcon,
  UserIcon,
  ClockIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline'

// Mock search data - in a real app, this would come from your API
const searchData = [
  // Invoices
  { id: 'inv-001', type: 'invoice', title: 'Invoice #INV-001', subtitle: 'ACME Corp - $2,500', href: '/invoices/inv-001' },
  { id: 'inv-002', type: 'invoice', title: 'Invoice #INV-002', subtitle: 'TechCorp - $1,850', href: '/invoices/inv-002' },
  
  // Purchase Orders
  { id: 'po-142', type: 'order', title: 'Purchase Order #PO-142', subtitle: 'Office Supplies - $450', href: '/orders/po-142' },
  { id: 'po-143', type: 'order', title: 'Purchase Order #PO-143', subtitle: 'Software Licenses - $2,100', href: '/orders/po-143' },
  
  // Loans
  { id: 'ln-089', type: 'loan', title: 'Loan #LN-089', subtitle: 'Business Expansion - $50,000', href: '/loans/ln-089' },
  { id: 'ln-090', type: 'loan', title: 'Loan #LN-090', subtitle: 'Equipment Purchase - $25,000', href: '/loans/ln-090' },
  
  // Contracts
  { id: 'ct-001', type: 'contract', title: 'Smart Contract #CT-001', subtitle: 'Payment Automation', href: '/contracts/ct-001' },
  { id: 'ct-002', type: 'contract', title: 'Smart Contract #CT-002', subtitle: 'Escrow Service', href: '/contracts/ct-002' },
  
  // Users
  { id: 'user-1', type: 'user', title: 'John Doe', subtitle: 'john.doe@company.com', href: '/users/user-1' },
  { id: 'user-2', type: 'user', title: 'Jane Smith', subtitle: 'jane.smith@company.com', href: '/users/user-2' },
]

const quickActions = [
  { id: 'create-invoice', title: 'Create Invoice', subtitle: 'Generate a new invoice', href: '/invoices/create', icon: DocumentTextIcon },
  { id: 'create-order', title: 'Create Purchase Order', subtitle: 'New purchase order', href: '/orders/create', icon: ShoppingBagIcon },
  { id: 'apply-loan', title: 'Apply for Loan', subtitle: 'Submit loan application', href: '/loans/create', icon: BanknotesIcon },
  { id: 'deploy-contract', title: 'Deploy Contract', subtitle: 'Create smart contract', href: '/contracts/create', icon: DocumentCheckIcon },
]

const getIcon = (type) => {
  switch (type) {
    case 'invoice': return DocumentTextIcon
    case 'order': return ShoppingBagIcon
    case 'loan': return BanknotesIcon
    case 'contract': return DocumentCheckIcon
    case 'user': return UserIcon
    default: return DocumentTextIcon
  }
}

const getColor = (type) => {
  switch (type) {
    case 'invoice': return 'text-blue-600 bg-blue-100'
    case 'order': return 'text-green-600 bg-green-100'
    case 'loan': return 'text-purple-600 bg-purple-100'
    case 'contract': return 'text-orange-600 bg-orange-100'
    case 'user': return 'text-gray-600 bg-gray-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}

export default function GlobalSearch({ isOpen, setIsOpen }) {
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState([
    'Invoice #INV-001',
    'Purchase Order #PO-142',
    'John Doe',
  ])
  const inputRef = useRef()

  const filteredItems = query === ''
    ? []
    : searchData.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)

  const filteredActions = query === ''
    ? quickActions
    : quickActions.filter((action) =>
        action.title.toLowerCase().includes(query.toLowerCase()) ||
        action.subtitle.toLowerCase().includes(query.toLowerCase())
      )

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSelect = (item) => {
    if (item) {
      // Add to recent searches if it's not a quick action
      if (!quickActions.find(action => action.id === item.id)) {
        setRecentSearches(prev => {
          const filtered = prev.filter(search => search !== item.title)
          return [item.title, ...filtered].slice(0, 5)
        })
      }
      // Navigate to the item
      window.location.href = item.href
    }
    setIsOpen(false)
    setQuery('')
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-2xl transform overflow-hidden rounded-xl bg-white dark:bg-accent-800 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <Combobox onChange={handleSelect}>
                <div className="relative">
                  <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-accent-400" />
                  <Combobox.Input
                    ref={inputRef}
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-accent-900 dark:text-accent-100 placeholder:text-accent-500 focus:ring-0 sm:text-sm"
                    placeholder="Search invoices, orders, loans, contracts..."
                    onChange={(event) => setQuery(event.target.value)}
                    value={query}
                  />
                </div>

                {(filteredItems.length > 0 || filteredActions.length > 0 || (query === '' && recentSearches.length > 0)) && (
                  <Combobox.Options static className="max-h-80 scroll-py-2 overflow-y-auto py-2 text-sm text-accent-800 dark:text-accent-200">
                    {query === '' && recentSearches.length > 0 && (
                      <div className="px-4 py-2 border-b border-accent-200 dark:border-accent-700">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-semibold text-accent-500 uppercase tracking-wide">
                            Recent Searches
                          </h3>
                          <button
                            onClick={clearRecentSearches}
                            className="text-xs text-accent-400 hover:text-accent-600 dark:text-accent-500 dark:hover:text-accent-300"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="mt-2 space-y-1">
                          {recentSearches.map((search, index) => (
                            <div
                              key={index}
                              className="flex items-center px-2 py-1 text-accent-600 dark:text-accent-400 hover:bg-accent-100 dark:hover:bg-accent-700 rounded cursor-pointer"
                              onClick={() => setQuery(search)}
                            >
                              <ClockIcon className="h-4 w-4 mr-2" />
                              {search}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredActions.length > 0 && (
                      <div className="px-4 py-2 border-b border-accent-200 dark:border-accent-700">
                        <h3 className="text-xs font-semibold text-accent-500 uppercase tracking-wide mb-2">
                          Quick Actions
                        </h3>
                        {filteredActions.map((action) => (
                          <Combobox.Option
                            key={action.id}
                            value={action}
                            className={({ active }) =>
                              `flex cursor-pointer select-none items-center rounded-lg px-3 py-2 ${
                                active ? 'bg-primary-500 text-white' : ''
                              }`
                            }
                          >
                            {({ active }) => (
                              <>
                                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                  active ? 'bg-white bg-opacity-20' : 'bg-accent-100 dark:bg-accent-700'
                                }`}>
                                  <action.icon className={`h-4 w-4 ${
                                    active ? 'text-white' : 'text-accent-600 dark:text-accent-300'
                                  }`} />
                                </div>
                                <div className="ml-3 flex-auto">
                                  <p className={`text-sm font-medium ${
                                    active ? 'text-white' : 'text-accent-900 dark:text-accent-100'
                                  }`}>
                                    {action.title}
                                  </p>
                                  <p className={`text-sm ${
                                    active ? 'text-white text-opacity-70' : 'text-accent-500'
                                  }`}>
                                    {action.subtitle}
                                  </p>
                                </div>
                                <CommandLineIcon className={`h-4 w-4 ${
                                  active ? 'text-white text-opacity-50' : 'text-accent-400'
                                }`} />
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </div>
                    )}

                    {filteredItems.length > 0 && (
                      <div className="px-4 py-2">
                        <h3 className="text-xs font-semibold text-accent-500 uppercase tracking-wide mb-2">
                          Search Results
                        </h3>
                        {filteredItems.map((item) => {
                          const Icon = getIcon(item.type)
                          return (
                            <Combobox.Option
                              key={item.id}
                              value={item}
                              className={({ active }) =>
                                `flex cursor-pointer select-none items-center rounded-lg px-3 py-2 ${
                                  active ? 'bg-primary-500 text-white' : ''
                                }`
                              }
                            >
                              {({ active }) => (
                                <>
                                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                    active ? 'bg-white bg-opacity-20' : getColor(item.type)
                                  }`}>
                                    <Icon className={`h-4 w-4 ${
                                      active ? 'text-white' : ''
                                    }`} />
                                  </div>
                                  <div className="ml-3 flex-auto">
                                    <p className={`text-sm font-medium ${
                                      active ? 'text-white' : 'text-accent-900 dark:text-accent-100'
                                    }`}>
                                      {item.title}
                                    </p>
                                    <p className={`text-sm ${
                                      active ? 'text-white text-opacity-70' : 'text-accent-500'
                                    }`}>
                                      {item.subtitle}
                                    </p>
                                  </div>
                                </>
                              )}
                            </Combobox.Option>
                          )
                        })}
                      </div>
                    )}

                    {query !== '' && filteredItems.length === 0 && filteredActions.length === 0 && (
                      <div className="px-6 py-14 text-center text-sm sm:px-14">
                        <MagnifyingGlassIcon className="mx-auto h-6 w-6 text-accent-400" />
                        <p className="mt-4 font-semibold text-accent-900 dark:text-accent-100">No results found</p>
                        <p className="mt-2 text-accent-500">
                          We couldn't find anything with that term. Please try again.
                        </p>
                      </div>
                    )}
                  </Combobox.Options>
                )}

                {query === '' && recentSearches.length === 0 && (
                  <div className="px-6 py-14 text-center text-sm sm:px-14">
                    <MagnifyingGlassIcon className="mx-auto h-6 w-6 text-accent-400" />
                    <p className="mt-4 font-semibold text-accent-900 dark:text-accent-100">Search everything</p>
                    <p className="mt-2 text-accent-500">
                      Find invoices, purchase orders, loans, contracts, and more...
                    </p>
                  </div>
                )}
              </Combobox>

              {/* Keyboard shortcuts */}
              <div className="border-t border-accent-200 dark:border-accent-700 px-6 py-2.5 text-xs text-accent-500">
                Press{' '}
                <kbd className="mx-1 rounded border border-accent-200 dark:border-accent-600 bg-accent-100 dark:bg-accent-700 px-2 py-0.5 font-mono text-accent-600 dark:text-accent-300">
                  ↵
                </kbd>{' '}
                to select,{' '}
                <kbd className="mx-1 rounded border border-accent-200 dark:border-accent-600 bg-accent-100 dark:bg-accent-700 px-2 py-0.5 font-mono text-accent-600 dark:text-accent-300">
                  ↑
                </kbd>{' '}
                <kbd className="mx-1 rounded border border-accent-200 dark:border-accent-600 bg-accent-100 dark:bg-accent-700 px-2 py-0.5 font-mono text-accent-600 dark:text-accent-300">
                  ↓
                </kbd>{' '}
                to navigate,{' '}
                <kbd className="mx-1 rounded border border-accent-200 dark:border-accent-600 bg-accent-100 dark:bg-accent-700 px-2 py-0.5 font-mono text-accent-600 dark:text-accent-300">
                  esc
                </kbd>{' '}
                to close
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}