import { Secp256k1HdWallet } from "@cosmjs/amino";
import { DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import { stringToPath } from "@cosmjs/crypto";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient, defaultRegistryTypes as defaultStargateTypes } from "@cosmjs/stargate";
import React, { useState, Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'
import { CopyToClipboard } from "react-copy-to-clipboard";
const QRCode = require('qrcode.react');
import QrReader from 'react-qr-scanner'




export default (props) => {
    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null }
    })

    var password = '';
    if (process.browser) {
        password = localStorage.getItem("mnemonic")
    };

    console.log("amount: ", props.amount.toString(), "product: ", props.product);

    const [inputs, setInputs] = useState({
        recipient: 'stateset1na53ljfnfjjjapmxpu6ctd5fgxzvnm66k0pqft',
        available_count: '',
        quantity: '',
        amount: '',
        product: '',
        memo: '',
        delay: '',
        result: '',
        state_balance: '0',
        stake_balance: '0',
        address: '',
        mnemonic: password,
        height: '',
        message: '',
        did: "",
        uri: "",
        amount: "",
        state: ""
    })

    const stats = [
        { name: 'Available STATE', stat: '' + inputs.state_balance },
        { name: 'Available STAKE', stat: '' + inputs.stake_balance }
    ]

    // Confirm Message
    const [confirm, setConfirm] = useState(false);

    // Handle Response
    const handleResponse = (status, _product, _amount, st_balance, stk_balance, address, mnemonic, height, amount, msg) => {
        if (status === 200) {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: msg }
            })
            setInputs({
                product: _product,
                amount: _amount,
                recipient: inputs.recipient,
                memo: '',
                state_balance: st_balance,
                stake_balance: stk_balance,
                address: address,
                mnemonic: mnemonic,
                height: height,
                amount: amount,
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

    const handleConnectWallet = async e => {

        if (process.browser) {
            await window.keplr.experimentalSuggestChain({
                chainId: "stateset",
                chainName: "stateset",
                rpc: "https://rpc.stateset.zone",
                rest: "https://rest-api.stateset.zone",
                bip44: {
                    coinType: 118,
                },
                bech32Config: {
                    bech32PrefixAccAddr: "stateset",
                    bech32PrefixAccPub: "stateset" + "pub",
                    bech32PrefixValAddr: "stateset" + "valoper",
                    bech32PrefixValPub: "stateset" + "valoperpub",
                    bech32PrefixConsAddr: "stateset" + "valcons",
                    bech32PrefixConsPub: "stateset" + "valconspub",
                },
                currencies: [
                    {
                        coinDenom: "STATE",
                        coinMinimalDenom: "ustate",
                        coinDecimals: 6,
                        coinGeckoId: "stateset",
                    },
                ],
                feeCurrencies: [
                    {
                        coinDenom: "STATE",
                        coinMinimalDenom: "ustate",
                        coinDecimals: 6,
                        coinGeckoId: "stateset",
                    },
                ],
                stakeCurrency: {
                    coinDenom: "STATE",
                    coinMinimalDenom: "ustate",
                    coinDecimals: 6,
                    coinGeckoId: "stateset",
                },
                coinType: 118,
                gasPriceStep: {
                    low: 0.01,
                    average: 0.025,
                    high: 0.03,
                },
            });

            var chainId = "stateset";
            await window.keplr.enable(chainId);

        }

    }


    const handleSendTransaction = async e => {
        setStatus(prevStatus => ({ ...prevStatus, submitting: true }))

        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
            inputs.mnemonic,
            { prefix: "stateset" },
        );

        const [firstAccount] = await wallet.getAccounts();
        console.log(firstAccount);
        console.log(firstAccount.address);

        const rpcEndpoint = "https://rpc.stateset.zone";
        const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, { gasPrice: "0.025state" });

        const recipient = "stateset1na53ljfnfjjjapmxpu6ctd5fgxzvnm66k0pqft";
        const amount = {
            denom: "state",
            amount: props.amount.toString(),
        };

        console.log(amount);

        // Calculate Quantity * Amount
        //const total_amount = _amount.amount * inputs.quantity;
        //console.log(total_amount);


        const result = await client.sendTokens(firstAccount.address, recipient, [amount], "auto", inputs.memo);
        console.log(result)
        if (result.code = 5) {
            setConfirm(true);
        }

        const st_balance = await client.getBalance(firstAccount.address, "state");
        const stk_balance = await client.getBalance(firstAccount.address, "stake");
        //const new_available_count = inputs.available_count - 1;
        //const new_warehouse_count = props.new_warehouse_count - 1;
        handleResponse(200, props.product, props.amount, st_balance.amount, stk_balance.amount, firstAccount.address, inputs.mnemonic, inputs.height, inputs.amount, "sent")
    }

    return (
        <main>
            <Transition.Root show={status.submitting} as={Fragment}>
                <div class="flex justify-center items-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </Transition.Root>
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
                                                Bought {props.product} for {props.amount} STATE. Anyone with a link can now view this transaction.
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

            <button onClick={handleSendTransaction} type="button" class="ml-2 relative flex bg-green-600 border border-transparent rounded-md py-2 px-8 items-center justify-center text-sm font-medium text-white hover:bg-green-700">
                Pay Later
            </button>
        </main>


    )
}