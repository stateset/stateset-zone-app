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
    DocumentTextIcon,
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
import CreateAccount from 'components/transactions/account/CreateAccount';
import CreateChanelThreadModal from 'components/chat/CreateChannelThreadModal';


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const navigation = [
    
]

const Home = () => {

    const { user } = useUser();

    return (
        <div class="light">
            <Head>
                <link rel="stylesheet" href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.3.2/build/styles/night-owl.min.css" />
            </Head>

            <OnboardingBar />
            <body class="antialiased font-sans">
                <div className="flex-grow w-full max-w-7xl mx-auto xl:px-8 lg:flex">
                    <div className="flex-1 min-w-0 dark:bg-slate-900 bg-white xl:flex">
                        <div className="border-b border-gray-200 xl:border-b-0 xl:flex-shrink-0 xl:w-64 xl:border-r xl:border-gray-200 dark:bg-slate-900 bg-white">
                            <div className="h-full pl-4 pr-6 py-6 sm:pl-6 lg:pl-8 xl:pl-0">
                                <h2 class="text-lg dark:text-white text-blue-600 font-semibold">Welcome, {user.username}</h2>
                                <div className="h-full relative" style={{ minHeight: '12rem' }}>
                                    <div className="rounded-lg" />
                                    <nav className="mt-5 flex-1">
                                        <div className="px-2 space-y-1">
                                            {navigation.map((item) => (
                                                <Link href={`/${item.href}`} as={`/${item.href}`} >
                                                    <a href={item.href} className={classNames(item.current ? 'dark:bg-slate-900 dark:text-gray-300 bg-white text-gray-900' : 'bg-white hover:bg-gray-50 hover:text-gray-900', 'group flex items-center px-2 py-2 text-sm font-medium rounded-md')} >
                                                        <item.icon className={classNames(item.current ? 'dark:text-gray-400 text-blue-600' : 'text-gray-400 group-hover:text-blue-600', 'mr-3 h-6 w-6')} />
                                                        {item.name}
                                                    </a>
                                                </Link>
                                            ))}
                                        </div>
                                        <br/>
                                        <CreateChanelThreadModal />
                                    </nav>
                                </div>
                            </div>
                        </div>


                        <div className="dark:bg-slate-900 bg-white lg:min-w-0 lg:flex-1">
                            <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
                                <div className="relative h-full" style={{ minHeight: '36rem' }}>
                                    <div className="rounded-lg" />
                                    
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="dark:bg-slate-900 bg-white pr-4 sm:pr-6 lg:pr-8 lg:flex-shrink-0 lg:border-l lg:border-gray-200 xl:pr-0">
                        <div className="pl-6 py-6 lg:w-92">
                            <CreateAccount />
                        </div>
                        <footer className="ml-2 flex justify-center bottom-0">
                        <div className="flex justify-center mb-8">
                            <p className="text-blue-600 mr-3"><a href="https://docs.stateset.io/stateset-docs/stateset-network">Docs</a></p>
                            <p className="text-blue-600 mr-3"><a href="https://rpc.stateset.zone">RPC</a></p>
                            <p className="text-blue-600 mr-3"><a href="https://app.stateset.zone/stateset.pdf">Whitepaper</a></p>
                            <p className="text-blue-600 mr-3"><a href="https://rpc.stateset.zone/genesis">Genesis</a></p>
                            </div>
                            <br/>
                            <div className="flex justify-center mb-8">
                            <a href="https://github.com/stateset">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current text-blue-600 mr-3"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            </a>
                            <a href="https://twitter.com/stateset">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current text-blue-600 mr-3">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                                </svg>
                            </a>
                            <a  href="https://discord.gg/YYF2ACHshf">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-blue-600" viewBox="0 0 16 16">
                                    <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
                                </svg>
                            </a>
                            </div>
                    </footer>
                    </div>
                </div>
            </body>
        </div>
    )
}

export default withUser(Home);
