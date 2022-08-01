import Head from 'next/head'
import Image from 'next/image'
import { motion } from 'framer-motion';
import OnboardingBar from 'components/OnboardingBar'

import {
    AcademicCapIcon,
    BadgeCheckIcon,
    CashIcon,
    ClockIcon,
    ReceiptRefundIcon,
    DocumentAddIcon,
    PaperAirplaneIcon,
    UsersIcon,
} from '@heroicons/react/outline'

const user = {
    name: 'Dominic Steil',
    email: 'dom@stateset.io',
    organization: 'Stateset Inc.',
    role: 'Head of Commerce Operations',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTRtlMyFyFxqKZn33M2Bvcfs2oSse2RZGhxxFWs_OQ5RSKD1o7jvaiPJAWLqcAbIyWyKg&usqp=CAU',
  }

  const stats = [
    { label: 'New Tickets', value: 12 },
    { label: 'Requests', value: 4 },
    { label: 'New Trials', value: 28 },
  ]

const actions = [
    {
        title: 'Send',
        href: '/returns',
        icon: PaperAirplaneIcon,
        iconForeground: 'text-teal-700',
        iconBackground: 'bg-teal-50',
        description: 'Send instance transactions to other Stateset addresses'
    },
    {
        title: 'Stake',
        href: '/subscriptions',
        icon: BadgeCheckIcon,
        iconForeground: 'text-purple-700',
        iconBackground: 'bg-purple-50',
        description: 'Stake your STATE with a validator of the Stateset Network'
    },
    {
        title: 'Vote',
        href: '/crm/customer/8',
        icon: UsersIcon,
        iconForeground: 'text-sky-700',
        iconBackground: 'bg-sky-50',
        description: 'Create Proposals and vote on different governance of the Stateset Network '
    },
    {
        title: 'Contracts',
        href: '/contracts',
        icon: DocumentAddIcon,
        iconForeground: 'text-yellow-700',
        iconBackground: 'bg-yellow-50',
        description: 'Inititialzie Smart Contracts using CosmWasm on the Stateset Network'
    },
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}


let easing = [0.175, 0.85, 0.42, 0.96];

const textVariants = {
    exit: { y: 100, opacity: 0, transition: { duration: 0.5, ease: easing } },
    enter: {
        y: 0,
        opacity: 1,
        transition: { delay: 0.1, duration: 0.5, ease: easing }
    }
};


const Home = () => (
    <div>
        <Head>
            <link rel="stylesheet" href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.3.2/build/styles/night-owl.min.css"></link>
            <title>Stateset Zone</title>
        </Head>
        <OnboardingBar />
        <main>
        <div>
        <body>
                            <div className="min-h-full flex justify-center mt-8 rounded-lg bg-gray-200 overflow-hidden shadow divide-y divide-gray-200 sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px">
                                {actions.map((action, actionIdx) => (
                                    <div
                                        key={action.title}
                                        className={classNames(
                                            actionIdx === 0 ? 'rounded-tl-lg rounded-tr-lg sm:rounded-tr-none' : '',
                                            actionIdx === 1 ? 'sm:rounded-tr-lg' : '',
                                            actionIdx === actions.length - 2 ? 'sm:rounded-bl-lg' : '',
                                            actionIdx === actions.length - 1 ? 'rounded-bl-lg rounded-br-lg sm:rounded-bl-none' : '',
                                            'relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500'
                                        )}
                                    >
                                        <div>
                                            <span
                                                className={classNames(
                                                    action.iconBackground,
                                                    action.iconForeground,
                                                    'rounded-lg inline-flex p-3 ring-4 ring-white'
                                                )}
                                            >
                                                <action.icon className="h-6 w-6" aria-hidden="true" />
                                            </span>
                                        </div>
                                        <div className="mt-8">
                                            <h3 className="text-lg font-medium">
                                                <a href={action.href} className="focus:outline-none">
                                                    <span className="absolute inset-0" aria-hidden="true" />
                                                    {action.title}
                                                </a>
                                            </h3>
                                            <p className="mt-2 text-sm text-gray-500">
                                               {action.description}
                                        </p>
                                        </div>
                                        <span
                                            className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                                            aria-hidden="true"
                                        >
                                            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                                            </svg>
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </body>
                    </div>
                </main>
            </div>

)

export default Home