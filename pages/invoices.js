import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link'
import OnboardingBar from 'components/OnboardingBar';
import OptionModal from 'components/transactions/OptionModal';
import CreateInvoiceModal from 'components/transactions/NewInvoiceModal';
import FactorInvoiceModal from 'components/transactions/FactorInvoiceModal';
import FactorInvoice from 'components/transactions/FactorInvoice';

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
                                            <a href="/" class="dark:text-white text-gray-500 hover:text-gray-700 px-3 py-2 font-medium text-sm rounded-md">Wallet </a>

                                            <a href="/invoices" class="dark:text-white underline text-gray-500 px-3 py-2 font-medium text-sm rounded-md" aria-current="page"> Invoices </a>

                                            <a href="/loans" class="dark:text-white text-gray-500 px-3 py-2 font-medium text-sm rounded-md" aria-current="page"> Loans </a>

                                            <a href="/purchaseorders" class="dark:text-white text-gray-500 px-3 py-2 font-medium text-sm rounded-md" aria-current="page"> Purchase Orders </a>

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
                                <OptionModal />
                                </div>

                                <div className="mx-auto max-w-5xl dark:bg-slate-900 flex flex-col">

                                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                                <table className="mt-2 min-w-full divide-y divide-gray-200">
                                                    <thead className="dark:bg-slate-900 bg-gray-50">
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="dark:text-white px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                            >
                                                                DID
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="dark:text-white px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                            >
                                                                Status
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="dark:text-white px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                            >
                                                                Total
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
                                                                <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-900"><a href={invoice.did} class="dark:text-white">{invoice.did}</a></td>
                                                                <td class="dark:text-white dark:bg-slate-900 px-5 py-5 border-b border-gray-200 bg-white text-base"><p class="dark:text-slate-900 px-2 mt-1 truncate inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{invoice.state}</p></td>
                                                                <td class="dark:text-white dark:bg-slate-900 px-5 py-5 border-b border-gray-200 bg-white text-base"><p class="dark:text-white text-gray-900 whitespace-no-wrap">ⓢ {invoice.amount}</p></td>
                                                                <td><FactorInvoice id={invoice.id} /></td>
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
            setInvoices(invoice_data.Invoice);
        };

        getInvoices();
    }, []);

    return (<InvoicesPage invoices={invoices} />);

}

export default Invoices