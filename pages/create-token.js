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
import CreateToken from 'components/transactions/CreateToken'

let easing = [0.175, 0.85, 0.42, 0.96];

const textVariants = {
    exit: { y: 100, opacity: 0, transition: { duration: 0.5, ease: easing } },
    enter: {
        y: 0,
        opacity: 1,
        transition: { delay: 0.1, duration: 0.5, ease: easing }
    }
};


const CreateTokenPage = () => (
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
                            <div class="max-w-5xl mb-4 mt-3 text-lg">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 mr-3 py-4 px-4 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <div className="mt-2 mb-2">
                                            <motion.div initial="exit" animate="enter" exit="exit">
                                                <motion.div variants={textVariants}>
                                                    <br />
                                                    <br />
                                                    <CreateToken />
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
                            <p className="text-gray-500 mr-3"><a href="https://rest-api.stateset.zone">REST</a></p>
                            <p className="text-gray-500 mr-3"><a href="https://rpc.stateset.zone">RPC</a></p>
                            <p className="text-gray-500 mr-3"><a href="https://app.stateset.zone/stateset.pdf">Whitepaper</a></p>
                            <p className="text-gray-500 mr-3"><a href="https://rpc.stateset.zone/genesis">Genesis</a></p>
                            </div>
                            <br/>
                            <div className="flex justify-center mb-8">
                            <a href="https://github.com/stateset/core">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current text-gray-500 mr-3"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            </a>
                            <a href="https://twitter.com/stateset">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current text-gray-500 mr-3">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                                </svg>
                            </a>
                            <a  href="https://discord.gg/YYF2ACHshf">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="text-gray-500" viewBox="0 0 16 16">
                                    <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z" />
                                </svg>
                            </a>
                            </div>
                    </footer>
                </main>
            </div>
        </div>
    </div>
)

export default CreateTokenPage