import { DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import { stringToPath } from "@cosmjs/crypto";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient, defaultRegistryTypes as defaultStargateTypes } from "@cosmjs/stargate";
import { uuid } from "uuidv4";

import React, { useState, Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'

import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch(process.env.NEXT_PUBLIC_SEARCH_ID, process.env.NEXT_PUBLIC_SEARCH_KEY);
const index = client.initIndex('prod_STATESET_ZONE_PURCHASEORDERS');

import { Type, Field } from "protobufjs";

const MsgRequestPurchaseorder = new Type("MsgRequestPurchaseorder")
    .add(new Field("creator", 1, "string"))
    .add(new Field("did", 2, "string"))
    .add(new Field("uri", 3, "string"))
    .add(new Field("amount", 4, "string"))
    .add(new Field("state", 5, "string"))
    .add(new Field("purchaser", 6, "string"))
    .add(new Field("seller", 7, "string"));

var password = '';
if (process.browser) {
    password = localStorage.getItem("mnemonic")
};



export default () => {
    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null }
    })

    const [confirm, setConfirm] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");

    const [inputs, setInputs] = useState({
        mnemonic: password,
        purchaser: '',
        amount: '',
        message: '',
        did: "",
        uri: "",
        amount: "",
        state: ""
    })

    const handleResponse = (status, msg) => {
        if (status === 200) {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: msg }
            })
            setInputs({
                purchaser: '',
                amount: '',
                message: ''

            })
        } else {
            setStatus({
                info: { error: true, msg: msg }
            })
        }
    }

    const handleOnChange = e => {
        e.persist()
        setInputs(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }))
        setStatus({
            submitted: false,
            submitting: false,
            info: { error: false, msg: null }
        })
    }

    const handleOnSubmit = async () => {
        setStatus(prevStatus => ({ ...prevStatus, submitting: true }))

        const myRegistry = new Registry(defaultStargateTypes);
        myRegistry.register("/stateset.core.purchaseorder.MsgRequestPurchaseorder", MsgRequestPurchaseorder);

        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
            inputs.mnemonic,
            { prefix: "stateset" },
        );

        console.log(wallet);

        const firstAccount = await wallet.getAccounts();

        console.log(firstAccount[0].address);

        var creator_address;

        if (firstAccount) {

            creator_address = firstAccount[0].address;

        }

        const rpcEndpoint = "https://rpc.stateset.zone";

        const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, { registry: myRegistry, gasPrice: "0.025state" });

        if (client) {

            const message = {
                typeUrl: "/stateset.core.purchaseorder.MsgRequestPurchaseorder",
                value: {
                    creator: creator_address,
                    did: "did:cosmos:1:stateset:purchaseorder:" + uuid(),
                    uri: inputs.uri,
                    amount: inputs.amount,
                    state: "request",
                    purchaser: inputs.purchaser,
                    seller: creator_address
                },
            };

            // Fee
            const fee = {
                amount: [
                    {
                        denom: "state",
                        amount: "0",
                    },
                ],
                gas: "10000",
            };

            const result_data = await client.signAndBroadcast(creator_address, [message], "auto", 'uploading a po request from stateset zone');

            console.log(result_data)

            if (result_data) {

                // Save to the Search Index
                index.saveObject({
                    objectID: _uuid,
                    creator: creator_address,
                    did: "did:cosmos:1:stateset:purchaseorder:" + _uuid,
                    amount: inputs.amount,
                    state: "request"
                });

                setConfirm(true);
            } else if (result) {
                setError(true);
                setMessage(result_data.result.code.log)
            } else {
                null
            }
        }
    }

    return (
        <main>
            <Transition.Root show={confirm} as={Fragment}>
                <div aria-live="assertive" class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start">
                    <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
                        <Transition.Child
                            as={Fragment}
                            entering="transform ease-out duration-300 transition"
                            from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                            to="translate-y-0 opacity-100 sm:translate-x-0"
                            leaving="transition ease-in duration-100"
                            from="opacity-100"
                            to="opacity-0"
                        >
                            <div class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                                <div class="p-4">
                                    <div class="flex items-start">
                                        <div class="flex-shrink-0">

                                            <svg class="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div class="ml-3 w-0 flex-1 pt-0.5">
                                            <p class="text-sm font-medium text-gray-900">
                                                Transaction Success
                                            </p>
                                            <p class="mt-1 text-xs text-gray-500">
                                                Invoice Created Anyone with a link can now view this transaction.
                                            </p>
                                        </div>
                                        <div class="ml-4 flex-shrink-0 flex">
                                            <button onClick={() => setConfirm(false)} className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                <span class="sr-only">Close</span>
                                                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Transition.Root>
            <Transition.Root show={error} as={Fragment}>
                <div aria-live="assertive" class="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start">
                    <div class="w-full flex flex-col items-center space-y-4 sm:items-end">
                        <Transition.Child
                            as={Fragment}
                            entering="transform ease-out duration-300 transition"
                            from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                            to="translate-y-0 opacity-100 sm:translate-x-0"
                            leaving="transition ease-in duration-100"
                            from="opacity-100"
                            to="opacity-0"
                        >
                            <div class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                                <div class="p-4">
                                    <div class="flex items-start">
                                        <div class="flex-shrink-0">

                                            <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div class="ml-3 w-0 flex-1 pt-0.5">
                                            <p class="text-sm font-medium text-gray-900">
                                                Transaction Failed
                                            </p>
                                            <p class="mt-1 text-xs text-gray-500">
                                                {message}
                                            </p>
                                        </div>
                                        <div class="ml-4 flex-shrink-0 flex">
                                            <button onClick={() => setError(false)} className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                <span class="sr-only">Close</span>
                                                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Transition.Root>
            <div>
                <div>
                    <label for="account-number" class="dark:text-white block text-sm font-medium text-gray-700 float-left">Purchaser</label>
                    <div class="mt-2 relative rounded-md shadow-sm">
                        <input type="text" name="purchaser" id="purchaser" class="dark:bg-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 block w-full pr-2 text-ellipsis truncate sm:text-sm border-gray-300 rounded-md" placeholder="stateset28x8..." onChange={handleOnChange} value={inputs.purchaser} />
                    </div>
                </div>
                <label for="account-number" class="block text-sm font-medium text-gray-700 float-left">Amount</label>
                <div class="mt-2 relative rounded-md shadow-sm">
                    <input type="text" name="amount" id="amount" class="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md" placeholder="" onChange={handleOnChange} value={inputs.unit_price} />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span class="dark:text-white pt-5 text-gray-500 sm:text-sm" id="price-currency">
                            STATE
                        </span>
                    </div>
                </div>
            </div>
            <button onClick={handleOnSubmit} type="button" class="mt-8 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Upload Purchase Order
            </button>
        </main >
    )
}