import Head from 'next/head'
import React, { useEffect, useState, useContext } from 'react';
import gql from 'graphql-tag';
import Link from 'next/link'
import OnboardingBar from 'components/OnboardingBar';
import { HomeIcon } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import en from 'locales/en';
import fr from 'locales/fr';
import es from 'locales/es';
import CopyToClipboard from 'react-copy-to-clipboard'

let easing = [0.175, 0.85, 0.42, 0.96];

const textVariants = {
  exit: { y: 100, opacity: 0, transition: { duration: 0.5, ease: easing } },
  enter: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.1, duration: 0.5, ease: easing }
  }
};


function InvoiceRecordPage({ invoice }) {


  console.log(invoice);

  const pages = [
    { name: `Invoices`, href: '/invoices', current: false },
    { name: `Invoice - ${invoice.did}`, href: `/invoice/${invoice.did}`, current: true },
  ]

  let did;


  const router = useRouter();
  const { locale } = router;
  var stateset_locale = en;
  switch (locale) {
    case 'en':
      stateset_locale = en;
      break;
    case 'es':
      stateset_locale = es;
      break;
    case 'fr':
      stateset_locale = fr;
      break;
    case 'it':
      stateset_locale = it;
      break;
    default:
      stateset_locale = en;
  }

  return (

    <div class="">
      <Head>
        <title>Invoice - Stateset</title>
      </Head>
      <OnboardingBar />
      <div class="flex overflow-hidden bg-white dark:bg-slate-900">
        <main class="flex-1 relative z-0 overflow-hidden focus:outline-none" tabindex="0">
          <div class="container mx-auto mt-8 px-4 sm:px-8">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <div>
                    <a href="/home" className="text-gray-400  hover:text-gray-500 dark:text-white">
                      <HomeIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">Home</span>
                    </a>
                  </div>
                </li>
                {pages.map((page) => (
                  <li key={page.name}>
                    <div className="flex items-center">
                      <svg
                        className="flex-shrink-0 h-5 w-5 text-gray-300 dark:text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                      </svg>
                      <a
                        href={page.href}
                        className="ml-4 text-base font-medium text-gray-500 dark:text-white hover:text-gray-700"
                        aria-current={page.current ? 'page' : undefined}
                      >
                        {page.name}
                      </a>
                    </div>
                  </li>
                ))}
              </ol>
            </nav>

            <div class="container mx-auto px-4 sm:px-8">
              <div class="lg:flex lg:items-center lg:justify-between">
                <div class="flex-1 min-w-0 mt-8" >
                  <h2 class="text-2xl font-bold leading-7 dark:text-white text-gray-900 sm:text-3xl sm:truncate">
                    Invoice - {invoice.did}
                  </h2>
                  <div class="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                    <div class="mt-2 flex items-center text-base text-gray-500 dark:text-white">

                    </div>
                    <div class="mt-2 flex items-center text-base text-gray-500 dark:text-white">
                      ⓢ {invoice.amount}
                    </div>
                    <div class="mt-2 flex items-center text-base text-gray-500 dark:text-white">
                      <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                      </svg>
                      Due Date on August 28, 2022
                    </div>
                  </div>
                </div>
                <div class="mt-5 flex lg:mt-0 lg:ml-4">

                  <span class="sm:ml-3">
                    <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                      Complete
                    </button>
                  </span>

                  <span class="sm:ml-3">
                    <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Cancel
                    </button>
                  </span>

                  <span class="sm:ml-3">
                    <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Factor
                    </button>
                  </span>

                </div>
              </div>

              <div class="bg-white dark:bg-slate-900 shadow overflow-hidden sm:rounded-lg mt-8">
                <div class="px-4 py-5 sm:px-6">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Invoice Information
                  </h3>
                  <p class="mt-1 max-w-2xl text-base text-gray-500 dark:text-white">
                    Invoice details and attachments.
                  </p>
                </div>
                <div class="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div class="sm:col-span-1">
                      <dt class="text-base font-medium text-gray-500 dark:text-white">
                        Invoice Name
                      </dt>
                      <dd class="mt-1 text-base text-gray-900 dark:text-white">
                        {invoice.did}
                      </dd>
                    </div>
                    <div class="sm:col-span-1">
                      <dt class="text-base font-medium text-gray-500 dark:text-white">
                        Invoice for
                      </dt>
                      <dd class="mt-1 text-base text-gray-900 dark:text-white">
                        Widgets
                      </dd>
                    </div>
                    <div class="sm:col-span-1">
                      <dt class="text-base font-medium text-gray-500 dark:text-white">
                        Purchaser
                      </dt>
                      <dd class="mt-1 text-base text-gray-900 dark:text-white">
                        {invoice.purchaser}
                        <CopyToClipboard text={invoice.purchaser}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mb-1 w-4 h-4 inline-flex text-gray-400 active:bg-gray-200 active:text-gray-500 rounded">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                          </svg>
                        </CopyToClipboard>
                      </dd>
                    </div>
                    <div class="sm:col-span-1">
                      <dt class="text-base font-medium text-gray-500 dark:text-white">
                        Invoice Total Amount
                      </dt>
                      <dd class="mt-1 text-base text-gray-900 dark:text-white">
                        ⓢ {invoice.amount}
                      </dd>
                    </div>
                    <div class="sm:col-span-1">
                      <dt class="text-base font-medium text-gray-500 dark:text-white">
                        Seller
                      </dt>
                      <dd class="mt-1 text-base text-gray-900 dark:text-white">
                        {invoice.seller}
                        <CopyToClipboard text={invoice.seller}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mb-1 w-4 h-4 inline-flex text-gray-400 active:bg-gray-200 active:text-gray-500 rounded">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                          </svg>
                        </CopyToClipboard>
                      </dd>
                    </div>
                    <div class="sm:col-span-1">
                      <dt class="text-base font-medium text-gray-500 dark:text-white">
                        Invoice State
                      </dt>
                      <dd class="px-2 mt-1 truncate inline-flex  leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {invoice.state}
                      </dd>
                    </div>

                    <div class="sm:col-span-1">
                      <dt class="text-base font-medium text-gray-500 dark:text-white">
                        Factor
                      </dt>
                      <dd class="mt-1 text-base text-gray-900 dark:text-white">
                        {invoice.factor}
                        <CopyToClipboard text={invoice.factor}>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mb-1 w-4 h-4 inline-flex text-gray-400 active:bg-gray-200 active:text-gray-500 rounded">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                          </svg>
                        </CopyToClipboard>
                      </dd>
                    </div>
                    <div class="sm:col-span-2">
                      <dt class="text-base font-medium text-gray-500 dark:text-white">
                        Attachments
                      </dt>
                      <dd class="mt-1 text-base text-gray-900 dark:text-white">
                        <ul class="border border-gray-200 rounded-md divide-y divide-gray-200">
                          <li class="pl-3 pr-4 py-3 flex items-center justify-between text-base">
                            <div class="w-0 flex-1 flex items-center">
                              <svg class="flex-shrink-0 h-5 w-5 dark:text-white text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clip-rule="evenodd" />
                              </svg>
                              <span class="dark:text-white ml-2 flex-1 w-0 truncate">
                                invoice-{invoice.did}.pdf
                              </span>
                            </div>
                            <div class="ml-4 flex-shrink-0">
                              <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
                                Download
                              </a>
                            </div>
                          </li>
                          <li class="pl-3 pr-4 py-3 flex items-center justify-between text-base">
                            <div class="w-0 flex-1 flex items-center">

                              <svg class="flex-shrink-0 h-5 w-5 dark:text-white text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clip-rule="evenodd" />
                              </svg>
                              <span class="dark:text-white ml-2 flex-1 w-0 truncate">
                                invoice-{invoice.did}.pdf
                              </span>
                            </div>
                            <div class="ml-4 flex-shrink-0">
                              <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
                                Download
                              </a>
                            </div>
                          </li>
                        </ul>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              <br />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

const Invoices = () => {

  const router = useRouter();
  const id = router.query;
  var id_ = id.id;

  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    async function getInvoices() {
      const res = await fetch(`https://rest-api.stateset.zone/stateset/core/invoice/invoice/${id_}`, {
        method: 'GET'
      });
      const invoice_data = await res.json();
      setInvoices(invoice_data.Invoice);
    };

    getInvoices();
  }, []);

  return (<InvoiceRecordPage invoice={invoices} />);

}

export default Invoices