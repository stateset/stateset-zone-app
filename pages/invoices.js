import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link'
import OnboardingBar from 'components/OnboardingBar';
import OptionModal from 'components/transactions/OptionModal';
import CreateInvoiceModal from 'components/transactions/invoice/NewInvoiceModal';
import FactorInvoiceModal from 'components/transactions/invoice/FactorInvoiceModal';
import FactorInvoice from 'components/transactions/invoice/FactorInvoice';
import PayInvoice from 'components/transactions/invoice/PayInvoice';
import VoidInvoice from 'components/transactions/invoice/VoidInvoice';
import { HomeIcon } from '@heroicons/react/solid'
import { CopyToClipboard } from "react-copy-to-clipboard";

function InvoicesPage({ invoices }) {

    return (


        <div class="">
            <OnboardingBar />
            <div class="h-screen flex overflow-hidden dark:bg-slate-900 bg-white">
                <div class="flex flex-col w-0 flex-1 overflow-hidden">
                    <main class="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabindex="0">
                        <div class="container mx-auto px-4 sm:px-8">
                            <div>
                                <div class="max-w-8xl mb-4 mt-3 text-lg">
                                    <div class="float-right sm:block">
                                        <nav class="flex space-x-4" aria-label="Tabs">

                                            <a href="/home" className="text-gray-400 px-3 py-2 hover:text-gray-500 dark:text-white">
                                                <HomeIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
                                                <span className="sr-only">Home</span>
                                            </a>

                                            <a href="/" class="dark:text-white text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">Wallet </a>

                                            <a href="/invoices" class="dark:text-white underline text-gray-500 px-3 py-2 font-medium text-sm rounded-md" aria-current="page"> Invoices </a>

                                            <a href="/loans" class="dark:text-white text-gray-500 px-3 py-2 font-medium text-sm rounded-md" > Loans </a>

                                            <a href="/purchaseorders" class="dark:text-white text-gray-500 px-3 py-2 font-medium text-sm rounded-md"> Purchase Orders </a>

                                        </nav>
                                    </div>
                                </div>
                            </div>
                            <body class="bg-white dark:bg-slate-900 antialiased font-sans">

                                <h2 class="dark:text-white mx-auto  max-w-5xl mt-8 px-4 text-2xl leading-6 font-medium text-gray-900 sm:px-6 sm:mt-8 lg:px-4 mb-8">
                                    Invoices
                                </h2>

                                <div class="max-w-5xl mx-auto">
                                    <CreateInvoiceModal />
                                </div>

                                <div className="mx-auto max-w-5xl dark:bg-slate-900 flex flex-col">

                                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                            <div className="-mx-2 mt-10 ring-1 ring-gray-300 sm:-mx-6 md:mx-0 md:rounded">
                                                <table className="min-w-full divide-y divide-gray-300">
                                                    <thead className="dark:bg-slate-900 bg-white">
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                                            >
                                                                DID
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="hidden py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:table-cell"
                                                            >
                                                                Status
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                                            >
                                                                Total
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="dark:text-white px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                            >

                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="dark:text-white px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                            >

                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="dark:text-white px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                            >

                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="dark:text-white dark:bg-slate-900 bg-white divide-y divide-gray-200">
                                                        {invoices.map((invoice) => (
                                                            <tr key={invoice.id}>
                                                                <td className="px-3 py-3.5 text-sm text-stateset-copy lg:table-cell"><Link href='invoice/[id]' as={`invoice/${invoice.id}`}><a>{invoice.did}</a></Link>
                                                                    <CopyToClipboard text={invoice.did}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mb-1 w-4 h-4 inline-flex text-gray-400 active:bg-gray-200 active:text-gray-500 rounded">
                                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                                                                        </svg>

                                                                    </CopyToClipboard>
                                                                    <div className="text-xs text-gray-500 w-44 whitespace-no-wrap truncate overflow-hidden text-overflow: ellipsis">seller: {invoice.seller}</div>
                                                                    <div className="text-xs text-gray-500 w-44 whitespace-no-wrap truncate overflow-hidden text-overflow: ellipsis">purchaser: {invoice.purchaser}</div>
                                                                </td>
                                                                <td class="hidden dark:text-white dark:bg-slate-900 px-5 py-5 border-b border-gray-200 bg-white text-base lg:table-cell"><p class="dark:text-slate-900 px-2 mt-1 truncate inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{invoice.state}</p></td>
                                                                <td class="dark:text-white dark:bg-slate-900 px-5 py-5 border-b border-gray-200 bg-white text-base"><p class="px-3 py-3.5 text-sm text-gray-500 lg:table-cell">ⓢ {invoice.amount}</p></td>
                                                                <td><FactorInvoice id={invoice.id} /></td>
                                                                <td><PayInvoice id={invoice.id} /></td>
                                                                <td><VoidInvoice id={invoice.id} /></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </body>
                        </div>
                    </main>
                </div>
            </div>
        </div>

    )
}

const Invoices = () => {

    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        async function getInvoices() {
            const res = await fetch(`https://rest-api.stateset.zone/stateset/core/invoice/invoice`, {
                method: 'GET'
            });
            const invoice_data = await res.json();
            setInvoices(invoice_data.Invoice.reverse());
        };

        getInvoices();
    }, []);

    return (<InvoicesPage invoices={invoices} />);

}

export default Invoices