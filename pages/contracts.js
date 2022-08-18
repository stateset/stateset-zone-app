import Head from 'next/head'
import Image from 'next/image'
import OnboardingBar from 'components/OnboardingBar';
import CreateTransaction from 'components/transactions/CreateTransaction'
import CreatePuchaseOrder from 'components/transactions/purchaseorder/CreatePurchaseOrder'
import DelegateState from 'components/transactions/DelegateState'
import CreateAccount from 'components/transactions/account/CreateAccount'
import CreateVote from 'components/transactions/CreateVote'
import CreateContract from 'components/transactions/contract/CreateContract'
import UploadSmartContract from 'components/transactions/contract/UploadSmartContract'
import { motion } from 'framer-motion';
import CreateSwap from 'components/transactions/contract/CreateSwap'

let easing = [0.175, 0.85, 0.42, 0.96];

const textVariants = {
    exit: { y: 100, opacity: 0, transition: { duration: 0.5, ease: easing } },
    enter: {
        y: 0,
        opacity: 1,
        transition: { delay: 0.1, duration: 0.5, ease: easing }
    }
};


const ContractsPage = () => (
    <div>
        <Head>
            <title>Stateset Zone</title>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="icon" href="/favicon.ico" />
            <script dangerouslySetInnerHTML={{
                __html: `
      var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t){var e=document.createElement("script");e.type="text/javascript";e.async=!0;e.src=("https:"===document.location.protocol?"https://":"http://")+"cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(e,n)};analytics.SNIPPET_VERSION="4.0.0";
        analytics.load("XNffY6Q74MfHMzpFVJP3UCWCHRBIcAMn");analytics.page();}
   `}} />
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
                                            <a href="/" class="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">Wallet </a>

                                            <a href="/stake" class="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md"> Delegate </a>

                                            <a href="/contracts" class="bg-blue-100 text-blue-700 px-3 py-2 font-medium text-sm rounded-md" aria-current="page"> Contracts </a>

                                            <a href="/commerce" class="text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md"> Commerce</a>

                                        </nav>
                                    </div>
                                </div>
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 mr-3 py-4 px-4 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <div className="mt-2 mb-2">
                                        <motion.div initial="exit" animate="enter" exit="exit">
                                                <motion.div variants={textVariants}>
                                            <CreateContract />
                                            <br/>
                                            <br/>
                                            <CreateSwap />
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

export default ContractsPage