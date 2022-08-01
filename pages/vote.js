import Head from 'next/head'
import Image from 'next/image'
import OnboardingBar from 'components/OnboardingBar';
import CreateTransaction from 'components/transactions/CreateTransaction'
import CreatePuchaseOrder from 'components/transactions/CreatePurchaseOrder'
import DelegateState from 'components/transactions/DelegateState'
import CreateAccount from 'components/transactions/CreateAccount'
import CreateVote from 'components/transactions/CreateVote'
import CreateContract from 'components/transactions/CreateContract'
import UploadSmartContract from 'components/transactions/UploadSmartContract'
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


const VotePage = () => (
    <div>
        <Head>
            <title>Stateset Zone</title>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <OnboardingBar />
        <div class="justify-center flex overflow-hidden bg-white">
            <div class="flex overflow-hidden">
                <main class="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabindex="0">
                    <div class="container mx-auto py-2">
                        <body class="antialiased font-sans">
                            <div class="max-w-8xl mb-4 mt-3 text-lg">
                                <div>
                                    <div class="sm:block">
                                        <nav class="flex space-x-4" aria-label="Tabs">
                                            <a href="/" class="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">My Account </a>

                                            <a href="/stake" class="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md"> Delegate </a>

                                            <a href="/contracts" class="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md" aria-current="page"> Contracts </a>

                                            <a href="/vote" class="bg-blue-100 text-blue-700 px-3 py-2 font-medium text-sm rounded-md"> Vote </a>
                                        </nav>
                                    </div>
                                </div>
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 mr-3 py-4 px-4 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <div className="mt-2 mb-2">
                                            <motion.div initial="exit" animate="enter" exit="exit">
                                                <motion.div variants={textVariants}>
                                                    <CreateVote />
                                                </motion.div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </body>
                    </div>
                    <footer className="flex justify-center bottom-0 w-full">
                        <div className="flex justify-center mb-8">
                            <p className="text-gray-500 mr-5"><a href="https://rest-api.stateset.zone">REST</a></p>
                            <p className="text-gray-500 mr-5"><a href="https://rpc.stateset.zone">RPC</a></p>
                            <p className="text-gray-500 mr-5"><a href="https://github.com/stateset/core">Github</a></p>
                            <p className="text-gray-500"><a href="https://rpc.stateset.zone/genesis">Genesis File</a></p>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    </div>
)

export default VotePage