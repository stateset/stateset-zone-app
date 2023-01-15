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


export default () => {
    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null }
    })

    var password = '';
    if (process.browser) {
        password = localStorage.getItem("mnemonic")
    };

    const [inputs, setInputs] = useState({
        recipient: '',
        amount: '',
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
        { name: '', stat: '' + inputs.state_balance },
    ]


    const [open, setOpen] = useState(false)
    const [sendOpen, setSendOpen] = useState(false)
    const [needNewWallet, setNeedNewWallet] = useState(password ? false : true)
    const [request, setOpenRequest] = useState(false)
    const [copied, setCopied] = useState(false)
    const [myAddressCopied, setMyAddressCopied] = useState(false);
    const [sendIBC, setSendIBC] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const [result, setResult] = useState(false);
    const [showScan, setShowScan] = useState(false);

    let qrSize = 128
    let qrValue = inputs.address

    const handleResponse = (status, st_balance, stk_balance, address, mnemonic, height, amount, msg) => {
        if (status === 200) {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: msg }
            })
            setInputs({
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

    useEffect(() => {
        // Update the document title using the browser API
        async function loadWallet(password) {
            if (password) {
                const my_wallet = await DirectSecp256k1HdWallet.fromMnemonic(
                    password,
                    { prefix: "stateset" },
                );

                const stateset_rpcEndpoint = "https://rpc.stateset.zone";
                const [myFirstAccount] = await my_wallet.getAccounts();
                console.log("my address: ", myFirstAccount.address);
                let _address = '';

                const my_client = await SigningStargateClient.connectWithSigner(stateset_rpcEndpoint, my_wallet, { gasPrice: "0.025state" });
                const my_st_balance = await my_client.getBalance(myFirstAccount.address, "state");
                const my_stk_balance = await my_client.getBalance(myFirstAccount.address, "stake");
                const height = await my_client.getHeight();

                console.log("stateset blockchain height: ", height);

                handleResponse(200, my_st_balance.amount, my_stk_balance.amount, myFirstAccount.address, my_wallet.mnemonic, height, inputs.amount, "loaded")
            }
        }

        loadWallet(inputs.mnemonic);
    },

        [confirm]);

    const handleOnCreateWallet = async e => {
        setStatus(prevStatus => ({ ...prevStatus, submitting: true }))

        var wallet = await Secp256k1HdWallet.generate(12, { prefix: "stateset" });
        const [{ address }] = await wallet.getAccounts();
        const rpcEndpoint = "https://rpc.stateset.zone";
        const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet);

        if (process.browser) {
            localStorage.setItem('mnemonic', wallet.mnemonic);
        };

        console.log(client);

        console.log(st_balance);

        // Set mnemonic in env variable
        const _mnemonic = process.env.NEXT_PUBLIC_MNEMONIC;

        const _wallet = await DirectSecp256k1HdWallet.fromMnemonic(
            _mnemonic,
            { prefix: "stateset" },
        );

        setNeedNewWallet(false);

        const [FirstAccount] = await _wallet.getAccounts();
        console.log(FirstAccount);
        console.log(FirstAccount.address);

        const _client = await SigningStargateClient.connectWithSigner(rpcEndpoint, _wallet, { gasPrice: "0.025state" });

        const recipient = address;

        const amount = {
            denom: "state",
            amount: "10000",
        };

        const stake_amount = {
            denom: "stake",
            amount: "1000",
        }

        const result = await _client.sendTokens(FirstAccount.address, recipient, [amount], "auto", "Have fun with your stateset coins");
        console.log(result);
        const stake_result = await _client.sendTokens(FirstAccount.address, recipient, [stake_amount], "auto", "Have fun with your stateset coins");
        console.log(stake_result);
        const st_balance = await client.getBalance(address, "state");
        const stk_balance = await client.getBalance(address, "stake");
        setOpen(true);
        handleResponse(200, st_balance.amount, stk_balance.amount, address, wallet.mnemonic, inputs.height, inputs.amount, "funded")
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

    const handleScan = async (data) => {
        if (data) {
            console.log(data);
            setResult(data);
            setInputs({
                recipient: data.text,
                state_balance: inputs.st_balance,
                stake_balance: inputs.stk_balance,
                address: inputs.address,
                mnemonic: inputs.mnemonic,
                height: inputs.height,
                amount: '',
                message: ''
            })
            setShowScan(false);
        }
    }

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

    const handleSendViaIBC = async e => {
        setStatus(prevStatus => ({ ...prevStatus, submitting: true }))

        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
            inputs.mnemonic,
            { prefix: "stateset" },
        );
        console.log(wallet);

        const [firstAccount] = await wallet.getAccounts();
        console.log(firstAccount);
        console.log(firstAccount.address);

        const rpcEndpoint = "https://rpc.stateset.zone";
        const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, { gasPrice: "0.025state" });

        const recipient = inputs.recipient;
        const amount = {
            denom: "state",
            amount: inputs.amount,
        };

        console.log(amount);
        const ibc_result = await client.sendIbcTokens(
            firstAccount.address,
            recipient,
            coin(inputs.amount, "state"),
            "transfer",
            "channel-0",
            undefined,
            Math.floor(Date.now() / 1000) + 60,
            "auto",
            "sent via IBC from the app.stateset.zone",
        );

        console.log(ibc_result);
        const st_balance = await client.getBalance(firstAccount.address, "state");
        const stk_balance = await client.getBalance(firstAccount.address, "stake");
        setSendOpen(true);
        handleResponse(200, st_balance.amount, stk_balance.amount, firstAccount.address, inputs.mnemonic, "sent")
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
        const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, { gasPrice: "0.0025state" });

        const recipient = inputs.recipient;
        const amount = {
            denom: "state",
            amount: inputs.amount,
        };

        console.log(amount);

        const result = await client.sendTokens(firstAccount.address, recipient, [amount], "auto", inputs.memo);
        console.log(result)
        if (result.code = 5) {
            setConfirm(true);
        }

        const st_balance = await client.getBalance(firstAccount.address, "state");
        const stk_balance = await client.getBalance(firstAccount.address, "stake");
        handleResponse(200, st_balance.amount, stk_balance.amount, firstAccount.address, inputs.mnemonic, inputs.height, inputs.amount, "sent")
    }

    const previewStyle = {
        height: 240,
        width: 320,
    }

    var qr_reader = '';

    if (process.browser & showScan) {
        qr_reader = <QrReader
            delay={inputs.delay}
            style={previewStyle}
            onScan={handleScan}
            constraints={
                {
                    video: {
                        facingMode: { exact: `environment` }
                    }
                }
            }
        />

    };

    return (
        <main class="">
            {qr_reader}
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
                                            <p class="text-sm font-medium text-blue-600">
                                                Transaction Success
                                            </p>
                                            <p class="mt-1 text-xs text-blue-600">
                                                Sent {inputs.amount} STATE to {inputs.recipient}. Anyone with a link can now view this transaction.
                                            </p>
                                        </div>
                                        <div class="ml-4 flex-shrink-0 flex">
                                            <button onClick={() => setConfirm(false)} className="bg-white rounded-md inline-flex text-gray-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
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

            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" open={open} onClose={() => setOpen(false)}>
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="w-full inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                                <div>
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                        <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-blue-600">
                                            New Account Created
                                        </Dialog.Title>
                                        <CopyToClipboard text={"stateset address: " + inputs.address + " mnemonic seed: " + inputs.mnemonic}>
                                            <div>
                                                <p className="mt-3 px-2 text-xs text-blue-600">
                                                    {inputs.address}
                                                </p>
                                                <div className="mt-4">
                                                    <p className="text-sm text-blue-600">
                                                        Your 12 word account password is: <br /><strong>{inputs.mnemonic}</strong>
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-center" onClick={() => setCopied(true)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                    </svg>
                                                    <p className="text-blue-600 text-sm">Copy To Clipboard</p>
                                                </div>
                                            </div>
                                        </CopyToClipboard>
                                        <Transition
                                            show={copied}
                                            enter="ease-out duration-300"
                                            leave="ease-in duration-200"
                                        >
                                            <Dialog.Overlay className="mt-2 fixed inset-0" />
                                            <div class="mt-2 rounded-md bg-green-50 p-4">
                                                <div class="flex">
                                                    <div class="flex-shrink-0">
                                                        <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                                        </svg>
                                                    </div>
                                                    <div class="ml-3">
                                                        <p class="text-sm font-medium text-green-800">
                                                            Successfully Copied
                                                        </p>
                                                    </div>
                                                    <div class="ml-auto pl-3">
                                                        <div class="-mx-1.5 -my-1.5">
                                                            <button onClick={() => setCopied(false)} type="button" class="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600">
                                                                <span class="sr-only">Dismiss</span>
                                                                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Transition>
                                        <p className="mt-4 text-xs text-red-500">
                                            Backup your mnemonic seed securely. Anyone with your mnemonic seed can take your assets. Lost mnemonic seed can't be recovered.
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                                        onClick={() => setOpen(false)}
                                    >
                                        My Seed Phrase is Securely backedup
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            <Transition.Root show={sendOpen} as={Fragment}>
                <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" open={sendOpen} onClose={() => setSendOpen(false)}>
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="w-full inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                                <div>
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                        <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-blue-600">
                                            Transaction successful
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-blue-600">
                                                Your transaction has been sent.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                                        onClick={() => setSendOpen(false)}
                                    >
                                        Go back to dashboard
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            <Transition.Root show={request} as={Fragment}>
                <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" open={request} onClose={() => setOpenRequest(false)}>
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        {/* This element is to trick the browser into centering the modal contents. */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="w-full inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                                <div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-blue-600">
                                            Receive
                                        </Dialog.Title>
                                        <div className="mt-5 mb-3 inline-block items-center justify-center">
                                            <QRCode value={qrValue} size={qrSize} />
                                        </div>
                                        <div className="mt-2">
                                            <CopyToClipboard text={inputs.address}>
                                                <div>
                                                    <div class="mb-2 px-2 py-1 mr-2 font-bold leading-none text-blue-600 bg-white rounded-fulltext-ellipsis overflow-hidden text-xs text-center rounded-full">
                                                        {inputs.address}
                                                    </div>
                                                    <div className="flex items-center justify-center" onClick={() => setMyAddressCopied(true)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                                        </svg>
                                                        <p className="text-blue-600 text-sm">Copy To Clipboard</p>
                                                    </div>
                                                </div>
                                            </CopyToClipboard>
                                            <Transition
                                                show={myAddressCopied}
                                                enter="ease-out duration-300"
                                                leave="ease-in duration-200"
                                            >
                                                <Dialog.Overlay className="mt-2 fixed inset-0" />
                                                <div class="mt-2 rounded-md bg-green-50 p-4">
                                                    <div class="flex">
                                                        <div class="flex-shrink-0">
                                                            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div class="ml-3">
                                                            <p class="text-sm font-medium text-green-800">
                                                                Successfully Copied
                                                            </p>
                                                        </div>
                                                        <div class="ml-auto pl-3">
                                                            <div class="-mx-1.5 -my-1.5">
                                                                <button onClick={() => setMyAddressCopied(false)} type="button" class="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600">
                                                                    <span class="sr-only">Dismiss</span>
                                                                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Transition>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                                        onClick={() => setSendOpen(false)}
                                    >
                                        Go back to dashboard
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
            <div class="dark:bg-slate-900 dark:text-white max-w-8xl flex justify-center text-lg sm:px-6 lg:px-2">
                <dl className="mb-1 grid grid-cols-1 gap-8 sm:grid-cols-1">
                    {stats.map((item) => (
                        <div key={item.name} className="mlpx-4 py-5 dark:bg-slate-900 bg-white rounded-lg overflow-hidden sm:p-6">
                            <dt className="tracking-tight text-sm font-medium dark:text-white text-blue-600 truncate">{item.name}</dt>
                            <dd className="mt-1 text-3xl font-semibold dark:text-white text-blue-600">ⓢ {item.stat}</dd>
                        </div>
                    ))}
                </dl>
            </div>
            <Transition.Root show={status.submitting} as={Fragment}>
                <div class="flex justify-center items-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </Transition.Root>
            <Transition.Root show={needNewWallet} as={Fragment}>
                <div class="text-center">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-blue-600"></h3>
                    <p class="mt-1 text-sm text-blue-600">
                        Get started by creating a new wallet.
                    </p>

                    <div class="mt-6">
                        <button type="button" onClick={handleOnCreateWallet} class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                            </svg>
                            New Wallet
                        </button>
                    </div>
                </div>
            </Transition.Root>

            <div className="mt-3">
                <h1 className="dark:text-white py-3 mr-3 float-left text-lg leading-6 font-medium text-blue-600">
                    Send
                </h1>
                <div className="mt-2.5 rounded px-0.5 float-right text-green-500 text-xs">
                    <span class="h-8 flex items-center" aria-hidden="true">
                        <span class="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                        stateset-1-testnet - {inputs.height}
                    </span>
                </div>
                <p className="dark:text-white py-4 text-sm tracking-tight text-blue-600 lg:visible md:visible invisible">
                    Send transactions
                </p>
            </div>
            <div>
                <label for="account-number" class="dark:text-white block text-sm font-medium text-blue-600 float-left">To Address</label>
                <div class="mt-2 relative rounded-md shadow-sm">
                    <input type="text" name="recipient" id="recipient" class="dark:bg-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 block w-full pr-2 text-ellipsis truncate sm:text-sm border-gray-300 rounded-md" placeholder="stateset28x8..." onChange={handleOnChange} value={inputs.recipient} />
                </div>
            </div>
            <div>
                <label for="price" class="dark:text-white block text-sm font-medium text-blue-600 float-left">Send Amount</label>
                <div class="mt-2 relative rounded-md shadow-sm">
                    <input type="text" name="amount" id="amount" class="dark:bg-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 block w-full p2-2 pr-12 sm:text-sm border-gray-300 rounded-md" placeholder="28" aria-describedby="price-currency" onChange={handleOnChange} value={inputs.amount} />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span class="dark:text-white pt-5 text-blue-600 sm:text-sm" id="price-currency">
                            STATE
                        </span>
                    </div>
                </div>
            </div>
            <div>
                <label for="memo" class="dark:text-white block text-sm font-medium text-blue-600 float-left">Message</label>
                <div class="mt-2 relative rounded-md shadow-sm">
                    <input type="text" name="memo" id="memo" class="dark:bg-slate-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 block w-full pr-2 text-ellipsis truncate sm:text-sm border-gray-300 rounded-md" placeholder="optional unencrypted message" onChange={handleOnChange} value={inputs.memo} />
                </div>
            </div>
            <button onClick={() => setShowScan(true)} class="float-left mt-4 inline-flex items-center px-1 py-2" >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
            <button onClick={handleSendTransaction} type="button" class="dark:bg-slate-900 dark:hover:bg-blue-700 float-left mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send STATE
            </button>
            <button onClick={() => setOpenRequest(true)} type="button" class="dark:bg-slate-900 dark:hover:bg-blue-700 float-left mt-4 ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white mr-2 " fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                Receive STATE
            </button>
            <br />
            <br />
            <br />
        </main>


    )
}