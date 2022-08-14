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
import ChatWrapper from 'components/chat/ChatWrapper';
import { motion } from 'framer-motion';
import BuyNow from 'components/transactions/BuyNow';
import PayLater from 'components/transactions/PayLater';

let easing = [0.175, 0.85, 0.42, 0.96];

const textVariants = {
    exit: { y: 100, opacity: 0, transition: { duration: 0.5, ease: easing } },
    enter: {
        y: 0,
        opacity: 1,
        transition: { delay: 0.1, duration: 0.5, ease: easing }
    }
};

const handleShare = async e => {
    if (navigator.share) {
        navigator.share({
            title: 'Stateset Zone',
            text: 'Check out Stateset Zone.',
            url: 'https://app.stateset.zone',
        })
            .then(() => console.log('Successful share'))
            .catch((error) => console.log('Error sharing', error));
    }
}


const CommercePage = () => (
    <div class="">
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
        <div class="dark:bg-slate-900 justify-center flex overflow-hidden bg-white">
            <div class="flex overflow-hidden">
                <main class="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabindex="0">
                    <div class="container mx-auto py-2">
                        <body class="antialiased font-sans">
                            <div class="max-w-8xl mb-4 mt-3 text-lg">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 mr-3 py-4 px-4 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <div className="mt-2 mb-2">
                                            <motion.div initial="exit" animate="enter" exit="exit">
                                                <motion.div variants={textVariants}>
                                                    <div class="bg-white">
                                                        <div class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                                                            <h2 class="sr-only">Products</h2>

                                                            <div class="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                                                                <a class="group">
                                                                    <div class="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                                                                        <img src="https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg" alt="Tall slender porcelain bottle with natural clay textured body and cork stopper." class="w-full h-full object-center object-cover group-hover:opacity-75" />
                                                                    </div>
                                                                    <h3 class="mt-4 text-sm text-gray-700">Earthen Bottle</h3>
                                                                    <p class="mt-1 text-lg font-medium text-gray-900">ⓢ 48</p>
                                                                    <div class="mt-6 flex">
                                                                      <BuyNow product="Earthen Bottle" amount={48}/>
                                                                    </div>
                                                                </a>

                                                                <a  class="group">
                                                                    <div class="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                                                                        <img src="https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg" alt="Olive drab green insulated bottle with flared screw lid and flat top." class="w-full h-full object-center object-cover group-hover:opacity-75" />
                                                                    </div>
                                                                    <h3 class="mt-4 text-sm text-gray-700">Nomad Tumbler</h3>
                                                                    <p class="mt-1 text-lg font-medium text-gray-900">ⓢ 35</p>
                                                                    <div class="mt-6 flex">
                                                                    <BuyNow product="Nomad Tumbler" amount={35}/>
                                                                    </div>
                                                                </a>

                                                                <a class="group">
                                                                    <div class="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                                                                        <img src="https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-03.jpg" alt="Person using a pen to cross a task off a productivity paper card." class="w-full h-full object-center object-cover group-hover:opacity-75" />
                                                                    </div>
                                                                    <h3 class="mt-4 text-sm text-gray-700">Focus Paper Refill</h3>
                                                                    <p class="mt-1 text-lg font-medium text-blue-900">ⓢ 89</p>        
                                                                    <div class="mt-6 flex">
                                                                    <BuyNow product="Focus Paper Refill" amount={89}/>
                                                                    </div>

                                                                </a>

                                                                <a class="group">
                                                                    <div class="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                                                                        <img src="https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-04.jpg" alt="Hand holding black machined steel mechanical pencil with brass tip and top." class="w-full h-full object-center object-cover group-hover:opacity-75" />
                                                                    </div>
                                                                    <h3 class="mt-4 text-sm text-gray-700">Machined Mechanical Pencil</h3>
                                                                    <p class="mt-1 text-lg font-medium text-gray-900">ⓢ 35</p>
                                                                    <div class="mt-6 flex">
                                                                    <BuyNow product="Machined Mechanical Pencil" amount={35}/>
                                                                    </div>
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </body>
                    </div>
                </main>
            </div>
        </div>
        <div class="justify-center flex overflow-hidden bg-white">
        </div>
    </div>
)

export default CommercePage