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
import ChatWrapper from 'components/chat/ChatWrapper';
import { motion } from 'framer-motion';
import BuyNow from 'components/transactions/BuyNow';

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
        <div class="justify-center flex overflow-hidden bg-white">
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
                                                    <main class="bg-white px-4 pt-16 pb-24 sm:px-6 sm:pt-24 lg:px-8 lg:py-32">
                                                        <div class="max-w-3xl mx-auto">
                                                            <div class="max-w-xl">
                                                                <h1 class="text-sm font-semibold uppercase tracking-wide text-blue-600">Thank you!</h1>
                                                                <p class="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">It's on the way!</p>
                                                                <p class="mt-2 text-base text-gray-500">Your order #14034056 has been placed and will be shipped to you soon.</p>

                                                                <dl class="mt-12 text-sm font-medium">
                                                                    <dt class="text-gray-900">Tracking number</dt>
                                                                    <dd class="text-blue-600 mt-2">51547878755545848512</dd>
                                                                </dl>
                                                            </div>

                                                            <section aria-labelledby="order-heading" class="mt-10 border-t border-gray-200">
                                                                <h2 id="order-heading" class="sr-only">Your order</h2>

                                                                <h3 class="sr-only">Items</h3>

                                                                <div class="py-10 border-b border-gray-200 flex space-x-6">
                                                                    <img src="https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-02.jpg" alt="Glass bottle with black plastic pour top and mesh insert." class="flex-none w-20 h-20 object-center object-cover bg-gray-100 rounded-lg sm:w-40 sm:h-40" />
                                                                    <div class="flex-auto flex flex-col">
                                                                        <div>
                                                                            <h4 class="font-medium text-gray-900">
                                                                                <a href="#"> Nomad Tumbler </a>
                                                                            </h4>
                                                                            <p class="mt-2 text-sm text-gray-600">This glass bottle comes with a mesh insert for steeping tea or cold-brewing coffee. Pour from any angle and remove the top for easy cleaning.</p>
                                                                        </div>
                                                                        <div class="mt-6 flex-1 flex items-end">
                                                                            <dl class="flex text-sm divide-x divide-gray-200 space-x-4 sm:space-x-6">
                                                                                <div class="flex">
                                                                                    <dt class="font-medium text-gray-900">Quantity</dt>
                                                                                    <dd class="ml-2 text-gray-700">1</dd>
                                                                                </div>
                                                                                <div class="pl-4 flex sm:pl-6">
                                                                                    <dt class="font-medium text-gray-900">Price</dt>
                                                                                    <dd class="ml-2 text-gray-700">ⓢ 35.00</dd>
                                                                                </div>
                                                                            </dl>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div class="sm:ml-40 sm:pl-6">
                                                                    <h3 class="sr-only">Your information</h3>

                                                                    <h4 class="sr-only">Addresses</h4>
                                                                    <dl class="grid grid-cols-2 gap-x-6 text-sm py-10">
                                                                        <div>
                                                                            <dt class="font-medium text-gray-900">Shipping address</dt>
                                                                            <dd class="mt-2 text-gray-700">
                                                                                <address class="not-italic">
                                                                                    <span class="block">Kristin Watson</span>
                                                                                    <span class="block">7363 Cynthia Pass</span>
                                                                                    <span class="block">Toronto, ON N3Y 4H8</span>
                                                                                </address>
                                                                            </dd>
                                                                        </div>
                                                                    </dl>

                                                                    <h4 class="sr-only">Payment</h4>
                                                                    <dl class="grid grid-cols-2 gap-x-6 border-t border-gray-200 text-sm py-10">
                                                                        <div>
                                                                            <dt class="font-medium text-gray-900">Payment method</dt>
                                                                            <dd class="mt-2 text-gray-700">
                                                                                <p>Stateset Pay</p>
                                                                                <p><span aria-hidden="true"></span><span class="sr-only">Ending in </span>...1545</p>
                                                                            </dd>
                                                                        </div>
                                                                        <div>
                                                                            <dt class="font-medium text-gray-900">Shipping method</dt>
                                                                            <dd class="mt-2 text-gray-700">
                                                                                <p>FedEx</p>
                                                                                <p>Takes up to 3 working days</p>
                                                                            </dd>
                                                                        </div>
                                                                    </dl>

                                                                    <h3 class="sr-only">Summary</h3>

                                                                    <dl class="space-y-6 border-t border-gray-200 text-sm pt-10">
                                                                        <div class="flex justify-between">
                                                                            <dt class="font-medium text-gray-900">Subtotal</dt>
                                                                            <dd class="text-gray-700">ⓢ 35.00</dd>
                                                                        </div>
                                                                        <div class="flex justify-between">
                                                                            <dt class="flex font-medium text-gray-900">
                                                                                Discount
                                                                                <span class="rounded-full bg-gray-200 text-xs text-gray-600 py-0.5 px-2 ml-2">STATESET50</span>
                                                                            </dt>
                                                                            <dd class="text-gray-700">-ⓢ 18.00 (50%)</dd>
                                                                        </div>
                                                                        <div class="flex justify-between">
                                                                            <dt class="font-medium text-gray-900">Shipping</dt>
                                                                            <dd class="text-gray-700">ⓢ 5.00</dd>
                                                                        </div>
                                                                        <div class="flex justify-between">
                                                                            <dt class="font-medium text-gray-900">Total</dt>
                                                                            <dd class="text-gray-900">ⓢ 23.00</dd>
                                                                        </div>
                                                                    </dl>
                                                                </div>
                                                            </section>
                                                        </div>
                                                    </main>
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