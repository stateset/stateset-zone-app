import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

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
                    <img className="h-8 w-22" src="/statesetwhitelogo.svg"/>
                  </div>
                  <dd className="mt-0 ml-2">
                  </dd>
                </div>
                <div className="pt-4 pb-3 border-t border-blue-800">
                <div className="px-2 space-y-1 z-auto">
                    <UserButton userProfileURL="/user" afterSignOutAll="/" afterSignOutOneUrl="/" />
                </div>
              </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
    </>
  )
}