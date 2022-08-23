import React, { useEffect, useState, useContext } from 'react';
import Link from 'next/link'
import OnboardingBar from 'components/OnboardingBar';
import CreatePurchaseOrderModal from 'components/transactions/purchaseorder/NewPOModal';
import OptionModal from 'components/transactions/OptionModal';
import { HomeIcon } from '@heroicons/react/solid'
import FinancePurchaseOrder from 'components/transactions/purchaseorder/FinancePurchaseOrder';
import CompletePurchaseOrder from 'components/transactions/purchaseorder/CompletePurchaseOrder';
import CancelPurchaseOrder from 'components/transactions/purchaseorder/CancelPurchaseOrder';
import { CopyToClipboard } from "react-copy-to-clipboard";

function PurchaseOrdersPage({ purchase_orders }) {

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

                                            <a href="/invoices" class="dark:text-white text-gray-500 px-3 py-2 font-medium text-sm rounded-md" aria-current="page"> Invoices </a>

                                            <a href="/loans" class="dark:text-white text-gray-500 px-3 py-2 font-medium text-sm rounded-md" aria-current="page"> Loans </a>

                                            <a href="/purchaseorders" class="dark:text-white underline text-gray-500 px-3 py-2 font-medium text-sm rounded-md" aria-current="page"> Purchase Orders </a>

                                        </nav>
                                    </div>
                                </div>
                            </div>
                            <body class="bg-white dark:bg-slate-900 antialiased font-sans">

                                <h2 class="dark:text-white mx-auto  max-w-6xl mt-8 px-4 text-2xl leading-6 font-medium text-gray-900 sm:px-6 sm:mt-8 lg:px-4 mb-8">
                                    Purchase Orders
                                </h2>

                                <div class="max-w-6xl mx-auto">
                                    <CreatePurchaseOrderModal />

                                    <OptionModal />
                                </div>

                                <div className="mx-auto max-w-6xl dark:bg-slate-900 flex flex-col">

                                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                            <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:-mx-6 md:mx-0 md:rounded">
                                                <table className="mt-2 min-w-full divide-y divide-gray-200">
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
                                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
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
                                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                                            >
                                                                
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                                            >
                                                                
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                                            >
                                                                
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="dark:text-white dark:bg-slate-900 bg-white divide-y divide-gray-200">
                                                        {purchase_orders.map((purchase_order) => (
                                                            <tr key={purchase_order.linearId}>
                                                                <td className="px-3 py-3.5 text-sm text-stateset-copy whitespace-nowrap w-32"><Link href='purchaseorder/[id]' as={`purchaseorder/${purchase_order.id}`}><a>{purchase_order.did}</a></Link>
                                                                <CopyToClipboard text={purchase_order.did}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="mb-1 w-4 h-4 inline-flex text-gray-400 active:bg-gray-200 active:text-gray-500 rounded">
                                                                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
                                                                        </svg>
                                                                </CopyToClipboard>
                                                                </td>
                                                                <td class="dark:text-white dark:bg-slate-900 px-5 py-5 border-b border-gray-200 bg-white text-base"><p class="dark:text-slate-900 px-2 mt-1 truncate inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{purchase_order.state}</p></td>
                                                                <td class="dark:text-white dark:bg-slate-900 px-5 py-5 border-b border-gray-200 bg-white text-base"><p class="dark:text-white px-3 py-3.5 text-sm text-gray-500 whitespace-no-wrap">ⓢ {purchase_order.amount}</p></td>
                                                                <td><FinancePurchaseOrder id={purchase_order.id} /></td>
                                                                <td><CompletePurchaseOrder id={purchase_order.id} /></td>
                                                                <td><CancelPurchaseOrder id={purchase_order.id} /></td>
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

const PurchaseOrders = () => {

    const [purchaseorders, setPurchaseOrders] = useState([]);

    useEffect(() => {
        async function getPurchaseOrders() {
            const res = await fetch(`https://rest-api.stateset.zone/stateset/core/purchaseorder/purchaseorder`, {
                method: 'GET'
            });
            const purchaseorder_data = await res.json();
            setPurchaseOrders(purchaseorder_data.Purchaseorder.reverse());
        };

        getPurchaseOrders();
    }, []);

    return (<PurchaseOrdersPage purchase_orders={purchaseorders} />);

}

export default PurchaseOrders