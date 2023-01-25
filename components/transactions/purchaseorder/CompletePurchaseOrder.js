import { DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import { stringToPath } from "@cosmjs/crypto";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient, defaultRegistryTypes as defaultStargateTypes } from "@cosmjs/stargate";
import React, { useState, Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'

import { Type, Field } from "protobufjs";

const MsgCompletePurchaseorder = new Type("MsgCompletePurchaseorder")
    .add(new Field("creator", 1, "string"))
    .add(new Field("id", 2, "uint64"));

var password = '';
if (process.browser) {
    password = localStorage.getItem("mnemonic")
};


export default (props) => {
    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null }
    })

    const [confirm, setConfirm] = useState(false);

    const [inputs, setInputs] = useState({
        mnemonic: password,
        recipient: '',
        amount: '',
        message: '',
        id: props.id,
        did: "",
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
                recipient: '',
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

    const handleOnSubmit = async() => {
        setStatus(prevStatus => ({ ...prevStatus, submitting: true }))

        const myRegistry = new Registry(defaultStargateTypes);
        myRegistry.register("/stateset.core.purchaseorder.MsgCompletePurchaseorder", MsgCompletePurchaseorder);

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

        const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, { registry: myRegistry, gasPrice: "0.00025state" });

        if (client) {


            const message = {
                typeUrl: "/stateset.core.purchaseorder.MsgCompletePurchaseorder",
                value: {
                    creator: creator_address,
                    id: parseInt(inputs.id),
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

            const response = await client.signAndBroadcast(creator_address, [message], "auto", 'completeing a purchase order from stateset zone');

            console.log(response);
            setConfirm(true);

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
                                                Purchase Order Completed. Anyone with a link can now view this transaction.
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
            <button onClick={handleOnSubmit} type="button" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30">
                Complete
            </button>
        </main >
    )
}