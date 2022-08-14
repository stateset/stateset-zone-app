import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import {
  BadgeCheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CollectionIcon,
  SearchIcon,
  SortAscendingIcon,
  StarIcon,
} from '@heroicons/react/solid'
import { MenuAlt1Icon, XIcon } from '@heroicons/react/outline'


export default function OnboardingBar() {

  return (
    <>
      <Disclosure as="nav" className="flex-shrink-0 dark:bg-slate-900 bg-blue-600">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
              <div className="relative flex items-center justify-between h-16">
                {/* Logo section */}
                <div className="flex items-center px-2 lg:px-0 xl:w-64">
                  <div className="flex-shrink-0">
                  </div>
                  <dd className="mt-0 ml-2">
                  </dd>
                </div>
                <div className="lg:block lg:w-80">
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </>
  )
}