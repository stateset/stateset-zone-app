import { stringToPath } from "@cosmjs/crypto";
import { MsgDelegate } from "@cosmjs/stargate";
import { coin, coins, decodeTxRaw, DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient, defaultRegistryTypes as defaultStargateTypes } from "@cosmjs/stargate";
import React, { useState, Fragment, useEffect } from 'react'
import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'
import { QueryClientImpl } from "cosmjs-types/cosmos/staking/v1beta1/query";
import { BondStatus } from "cosmjs-types/cosmos/staking/v1beta1/staking";


export default () => {
    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null }
    })

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
    const [stakeBalance, setStakeBalance] = useState("")

    var password = '';
    if (process.browser) {
        password = localStorage.getItem("mnemonic")
    };

    const [inputs, setInputs] = useState({
        validator_address: 'statesetvaloper18h3mx4qjx8kjzuxshkapedknphr4gxm92659jn',
        recipient: '',
        amount: '',
        memo : '',
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

    // Inside an async function...
    const handleGetValidators = async () => {

        // The Tendermint client knows how to talk to the Tendermint RPC endpoint
        const tendermintClient = await Tendermint34Client.connect("https://rpc.stateset.zone");

        // The generic Stargate query client knows how to use the Tendermint client to submit unverified ABCI queries
        const queryClient = new QueryClient(tendermintClient);

        // This helper function wraps the generic Stargate query client for use by the specific generated query client
        const rpcClient = createProtobufRpcClient(queryClient);

        // Here we instantiate a specific query client which will have the custom methods defined in the .proto file
        const queryService = new QueryClientImpl(rpcClient);

        // Now you can use this service to submit queries
        const { validators } = await queryService.Validators({ status: BondStatus.BOND_STATUS_BONDED, paginationKey: 1 });
        console.log(validators);
    }

    // Inside an async function...
    const handleGetBalance = async (delegator, validator) => {

        console.log("delegator", delegator);
        console.log("validator", validator);

        // The Tendermint client knows how to talk to the Tendermint RPC endpoint
        const tendermintClient = await Tendermint34Client.connect("https://rpc.stateset.zone");

        // The generic Stargate query client knows how to use the Tendermint client to submit unverified ABCI queries
        const queryClient = new QueryClient(tendermintClient);

        // This helper function wraps the generic Stargate query client for use by the specific generated query client
        const rpcClient = createProtobufRpcClient(queryClient);

        // Here we instantiate a specific query client which will have the custom methods defined in the .proto file
        const queryService = new QueryClientImpl(rpcClient);

        // Now you can use this service to submit queries
        const { delegator_info } = await queryService.Delegation({ delegatorAddr: delegator, validatorAddr: validator });
        console.log(delegator_info);
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

    const handleDelegate = async e => {
        setStatus(prevStatus => ({ ...prevStatus, submitting: true }))

        const my_wallet = await DirectSecp256k1HdWallet.fromMnemonic(
            password,
            { prefix: "stateset" },
        );

        const stateset_rpcEndpoint = "https://rpc.stateset.zone";
        const [myFirstAccount] = await my_wallet.getAccounts();
        console.log(myFirstAccount);
        console.log(myFirstAccount.address);

        const client = await SigningStargateClient.connectWithSigner(stateset_rpcEndpoint, my_wallet, { gasPrice: "0.025state" });

        // Memo
        const memo = "Use your power wisely";

        // Result
        const result = await client.delegateTokens(myFirstAccount.address, inputs.validator_address, coin(inputs.amount, "stake"), "auto", memo);
        const stk_balance = await client.getBalance(myFirstAccount.address, "stake");
        setOpen(true);
        handleResponse(200, stk_balance, stk_balance, "delegated")
    }

    const handleUndelegate = async e => {
        setStatus(prevStatus => ({ ...prevStatus, submitting: true }))
        const my_wallet = await DirectSecp256k1HdWallet.fromMnemonic(
            password,
            { prefix: "stateset" },
        );

        const stateset_rpcEndpoint = "https://rpc.stateset.zone";
        const [myFirstAccount] = await my_wallet.getAccounts();
        console.log(myFirstAccount);
        console.log(myFirstAccount.address);
        const client = await SigningStargateClient.connectWithSigner(stateset_rpcEndpoint, my_wallet, { gasPrice: "0.025state" });

        // Memo
        const memo = "Use your power wisely";

        // Result
        const result = await client.undelegateTokens(myFirstAccount.address, inputs.validator_address, coin(inputs.amount, "stake"), "auto", memo);
        const stk_balance = await client.getBalance(myFirstAccount.address, "stake");

        setOpen(true);
        handleResponse(200, stk_balance, stk_balance, "undelegated")
    }

    return (
        <main>
            <Transition.Root show={open} as={Fragment}>
                <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={setOpen}>
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
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                                <div>
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                        <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-5">
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                            Transaction successful
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-xs text-gray-500">
                                                Your STAKE has been delegated to {inputs.validator_address}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-6">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                                        onClick={() => setOpen(false)}
                                    >
                                        Go back to dashboard
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
            <Transition.Root show={status.submitting} as={Fragment}>
                <div class="flex justify-center items-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </Transition.Root>
            <div class="max-w-8xl flex justify-center text-lg sm:px-6 lg:px-2">
                <dl className="mb-1 grid grid-cols-2 gap-8 sm:grid-cols-2">
                    {stats.map((item) => (
                        <div key={item.name} className="px-4 py-5 bg-white rounded-lg overflow-hidden sm:p-6">
                            <dt className="tracking-tight text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">{item.stat}</dd>
                        </div>
                    ))}
                </dl>
            </div>
            <div className="mt-3">
                <h1 className="py-3 mr-3 float-left text-lg leading-6 font-medium text-gray-900">
                    Stake
                </h1>
                <div className="mt-2.5 rounded px-0.5 float-right text-green-500 text-xs">
                    <span class="h-8 flex items-center" aria-hidden="true">
                        <span class="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                        stateset-1-testnet - {inputs.height}
                    </span>
                </div>
                <p className="py-4 text-sm tracking-tight text-gray-500 lg:visible md:visible invisible">
                    Delegate your Stake
                </p>
            </div>
            <div className="mt-2">
            </div>
            <div>
                <label for="account-number" class="block text-sm font-medium text-gray-700 float-left">Validator Address</label>
                <div class="mt-2 relative rounded-md shadow-sm">
                    <input type="text" name="recipient" id="recipient" class="focus:ring-blue-500 focus:border-blue-500 block w-full truncate elipsis sm:text-sm border-gray-300 rounded-md" value="statesetvaloper18h3mx4qjx8kjzuxshkapedknphr4gxm92659jn" />
                </div>
            </div>
            <div>
                <label for="price" class="block text-sm font-medium text-gray-700 float-left">Amount</label>
                <div class="mt-2 relative rounded-md shadow-sm">
                    <input type="text" name="amount" id="amount" class="focus:ring-blue-500 focus:border-blue-500 block w-full p2-2 pr-12 sm:text-sm border-gray-300 rounded-md" placeholder="" aria-describedby="price-currency" onChange={handleOnChange} value={inputs.amount} />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span class="pt-5 text-gray-500 sm:text-sm" id="price-currency">
                            STAKE
                        </span>
                    </div>
                </div>
            </div>
            <button onClick={handleDelegate} type="button" class="float-left mt-8 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Delegate {inputs.amount} STAKE
            </button>
            <button onClick={handleUndelegate} type="button" class="mt-8 ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Undelegate STAKE
            </button>
            <br />
            <br />
            <br />
        </main >
    )
}