import Head from 'next/head'
import Image from 'next/image'
import { motion } from 'framer-motion';
import OnboardingBar from 'components/OnboardingBar'
import { useRouter } from 'next/router';
import HomeWrapper from 'components/chat/HomeWrapper';
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useRef, useState, useEffect, useContext } from 'react'
import { withUser, useUser } from '@clerk/clerk-react';
import Link from 'next/link'

import {
    AcademicCapIcon,
    BadgeCheckIcon,
    CashIcon,
    ClockIcon,
    ReceiptRefundIcon,
    HomeIcon,
    CalendarIcon,
    UserGroupIcon,
    SearchCircleIcon,
    SpeakerphoneIcon,
    MailIcon,
    PhoneIcon,
    CreditCardIcon,
    TicketIcon,
    RefreshIcon,
    ShoppingBagIcon,
    ShoppingCartIcon,
    CubeTransparentIcon,
    MapIcon,
    UsersIcon,
} from '@heroicons/react/outline'
import CreateAccount from 'components/transactions/CreateAccount';


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const navigation = [
    { name: 'Home', href: '/home', icon: HomeIcon, current: true },
    { name: 'Invoices', href: '/invoices', icon: ReceiptRefundIcon, current: false },
    { name: 'Purchase Orders', href: '/purchaseorders', icon: RefreshIcon, current: false }
]

const Home = () => {

    const { user } = useUser();

    return (
        <div>
            <Head>
                <link rel="stylesheet" href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.3.2/build/styles/night-owl.min.css" />
            </Head>

            <OnboardingBar />
            <body class="antialiased font-sans">
                <div className="flex-grow w-full max-w-7xl mx-auto xl:px-8 lg:flex">
                    <div className="flex-1 min-w-0 bg-white xl:flex">
                        <div className="border-b border-gray-200 xl:border-b-0 xl:flex-shrink-0 xl:w-64 xl:border-r xl:border-gray-200 bg-white">
                            <div className="h-full pl-4 pr-6 py-6 sm:pl-6 lg:pl-8 xl:pl-0">
                                <h2 class="text-lg text-slate-900 font-semibold">Welcome, {user.firstName}</h2>
                                <div className="h-full relative" style={{ minHeight: '12rem' }}>
                                    <div className="rounded-lg" />
                                    <nav className="mt-5 flex-1">
                                        <div className="px-2 space-y-1">
                                            {navigation.map((item) => (
                                                <Link href={`/${item.href}`} as={`/${item.href}`} >
                                                    <a href={item.href} className={classNames(item.current ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900', 'group flex items-center px-2 py-2 text-sm font-medium rounded-md')} >
                                                        <item.icon className={classNames(item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500', 'mr-3 h-6 w-6')} />
                                                        {item.name}
                                                    </a>
                                                </Link>
                                            ))}
                                        </div>
                                    </nav>
                                </div>
                            </div>
                        </div>


                        <div className="bg-white lg:min-w-0 lg:flex-1">
                            <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
                                <div className="relative h-full" style={{ minHeight: '36rem' }}>
                                    <div className="rounded-lg" />
                                    <HomeWrapper />
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="bg-white pr-4 sm:pr-6 lg:pr-8 lg:flex-shrink-0 lg:border-l lg:border-gray-200 xl:pr-0">
                        <div className="pl-6 py-6 lg:w-92">
                            <CreateAccount />
                        </div>
                    </div>
                </div>
            </body>
        </div>
    )
}

export default withUser(Home);