import { stringToPath } from "@cosmjs/crypto";
import { MsgDelegate } from "@cosmjs/stargate";
import {
    SigningCosmWasmClient,
    CosmWasmClient,
    MsgExecuteContractEncodeObject,
} from '@cosmjs/cosmwasm-stargate'
import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import { coin, coins, decodeTxRaw, DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient, defaultRegistryTypes as defaultStargateTypes } from "@cosmjs/stargate";
import React, { useState, Fragment } from 'react'
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
    const [stakeBalance, setStakeBalance] = useState("")

    var password = '';
    if (process.browser) {
        password = localStorage.getItem("mnemonic")
    };

    const [inputs, setInputs] = useState({
        validator_address: 'statesetvaloper1mjcazclsh8qjuphta99x9dvmpe3vwteggkhamw',
        amount: "",
        stateset_validator_balance: '',
        stake_balance: '',
        message: '',
        mnemonic: password
    })

    const handleResponse = (status, amount, balance, msg) => {
        if (status === 200) {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: msg }
            })
            setInputs({
                recipient: '',
                amount: '',
                stateset_validator_balance: amount,
                message: '',
                stake_balance: balance

            })
        } else {
            setStatus({
                info: { error: true, msg: msg }
            })
        }
    }

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

    const swapToken1ForToken2Input = {
        nativeAmount: "",
        price: "",
        slippage: "",
        senderAddress: "",
        swapAddress: "",
        client: SigningCosmWasmClient
    }


    // Handle Swap Message
    const handleSwap = async (input) => {
        setStatus(prevStatus => ({ ...prevStatus, submitting: true }))

        const minOutputToken = Math.floor(input.price * (1 - input.slippage))
        const defaultExecuteFee = unsafelyGetDefaultExecuteFee()

        // Swap Message
        const swapMsg = {
            pass_through_swap: {
                output_min_token: `${minOutputToken}`,
                input_token: 'Token2',
                input_token_amount: `${input.tokenAmount}`,
                output_amm_address: input.outputSwapAddress,
            },
        }

        if (!input.tokenNative) {

            // Increase Allowance Message
            const msg1 = {
                increase_allowance: {
                    amount: `${input.tokenAmount}`,
                    spender: `${input.swapAddress}`,
                },
            }

            // Execute Contract Message
            const executeContractMsg1 = {
                typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
                value: MsgExecuteContract.fromPartial({
                    sender: input.senderAddress,
                    contract: input.tokenAddress,
                    msg: toUtf8(JSON.stringify(msg1)),
                    funds: [],
                }),
            }


            // Execute Contract Message
            const executeContractMsg2 = {
                typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
                value: MsgExecuteContract.fromPartial({
                    sender: input.senderAddress,
                    contract: input.swapAddress,
                    msg: toUtf8(JSON.stringify(swapMsg)),
                    funds: [],
                }),
            }


            // Create the Transaction Fee
            const fee = {
                amount: defaultExecuteFee.amount,
                gas: (+defaultExecuteFee.gas * 2).toString(),
            }


            // Sign and Broadcast the Transaction
            let result = await input.client.signAndBroadcast(
                input.senderAddress,
                [executeContractMsg1, executeContractMsg2],
                fee
            )


            if (isDeliverTxFailure(result)) {
                throw new Error(
                    `Error when broadcasting tx ${result.transactionHash} at height ${result.height}. Code: ${result.code}; Raw log: ${result.rawLog}`
                )
            }
        }
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
            <div className="mt-2">
            </div>
            <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <li class="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
                    <div class="w-full flex items-center justify-between p-6 space-x-6">
                        <div class="flex-1 truncate">
                            <div class="flex items-center space-x-3">
                                <h3 class="text-gray-900 text-sm font-medium truncate">CW20</h3>
                                <span class="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">Testnet</span>
                            </div>
                            <p class="mt-1 text-gray-500 text-sm truncate">Fungible Token</p>
                        </div>
                        <img class="w-10 h-10" src="/stateset_logo_8.png" alt="" />
                    </div>
                    <div>
                        <div class="-mt-px flex divide-x divide-gray-200">
                            <div class="w-0 flex-1 flex">
                                <a href="/trade-token" class="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                    <span class="ml-3">Trade</span>
                                </a>
                            </div>
                            <div class="-ml-px w-0 flex-1 flex">
                                <a href="/create-token" class="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span class="ml-3">Create</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
                    <div class="w-full flex items-center justify-between p-6 space-x-6">
                        <div class="flex-1 truncate">
                            <div class="flex items-center space-x-3">
                                <h3 class="text-gray-900 text-sm font-medium truncate">CW720</h3>
                                <span class="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">Testnet</span>
                            </div>
                            <p class="mt-1 text-gray-500 text-sm truncate">Non-Fungible Token</p>
                        </div>
                        <img class="w-10 h-10" src="/stateset_logo_8.png" alt="" />
                    </div>
                    <div>
                        <div class="-mt-px flex divide-x divide-gray-200">
                            <div class="w-0 flex-1 flex">
                                <a href="/trade-token" class="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                    <span class="ml-3">Trade</span>
                                </a>
                            </div>
                            <div class="-ml-px w-0 flex-1 flex">
                                <a href="/create-token" class="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span class="ml-3">Create</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </li>
                <li class="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
                    <div class="w-full flex items-center justify-between p-6 space-x-6">
                        <div class="flex-1 truncate">
                            <div class="flex items-center space-x-3">
                                <h3 class="text-gray-900 text-sm font-medium truncate">CW-20 Escrow</h3>
                                <span class="flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">Testnet</span>
                            </div>
                            <p class="mt-1 text-gray-500 text-sm truncate">Escrow Contract</p>
                        </div>
                        <img class="w-10 h-10" src="/stateset_logo_8.png" alt="" />
                    </div>
                    <div>
                        <div class="-mt-px flex divide-x divide-gray-200">
                            <div class="w-0 flex-1 flex">
                                <a href="/trade-token" class="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                    <span class="ml-3">Trade</span>
                                </a>
                            </div>
                            <div class="-ml-px w-0 flex-1 flex">
                                <a href="/create-token" class="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span class="ml-3">Create</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <br />
            <br />
            <br />
            <br />
            <br />
        </main >
    )
}