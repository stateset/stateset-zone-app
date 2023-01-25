import { stringToPath } from "@cosmjs/crypto";
import { MsgDelegate } from "@cosmjs/stargate";
import { fromUtf8, toBase64, toUtf8 } from '@cosmjs/encoding';
import {
    SigningCosmWasmClient,
    MsgExecuteContractEncodeObject,
    defaultExecuteFee
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

import { CosmWasmClient } from "cosmwasm";

// This is your rpc endpoint
const rpcEndpoint = "http://0.0.0.0:1317";

async function main() {
    const client = await CosmWasmClient.connect(rpcEndpoint);

    // This is your contract address
    const contractAddr = "stateset1yyca08xqdgvjz0psg56z67ejh9xms6l436u8y58m82npdqqhmmtqr9zaus";
    const config = await client.queryContractSmart(contractAddr, { config: {} });

    console.log(client);
    console.log(config);
}


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

    const handleGetTokenBalance = async (input) => {


    }

    const handleSendTokenMessage = async (input) => {
        setStatus(prevStatus => ({ ...prevStatus, submitting: true }))

        const rpcEndpoint = "http://0.0.0.0:1317";

        const client = await CosmWasmClient.connect(rpcEndpoint);

        const msg = { "transfer": { "amount": "2000", "owner": "stateset1mz337yp22zxje75f5gw2mfupems5cx3p2p2pax", "recipient": "stateset1j57jhj3t6322sm8lwsnxcme8af8yrghp8jf9k7" } };

        // Execute Contract Message
        const executeContractMsg = {
            typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
            value: MsgExecuteContract.fromPartial({
                sender: "stateset1mz337yp22zxje75f5gw2mfupems5cx3p2p2pax",
                contract: "stateset1yyca08xqdgvjz0psg56z67ejh9xms6l436u8y58m82npdqqhmmtqr9zaus",
                msg: toUtf8(JSON.stringify(msg)),
                funds: [],
            }),
        }

        // Create the Transaction Fee
        const fee = {
            gas: "auto",
        }


        // Sign and Broadcast the Transaction
        let result = await client.signAndBroadcast(
            'stateset1mz337yp22zxje75f5gw2mfupems5cx3p2p2pax',
            executeContractMsg,
            fee
        )

        if (isDeliverTxFailure(result)) {
            throw new Error(
                `Error when broadcasting tx ${result.transactionHash} at height ${result.height}. Code: ${result.code}; Raw log: ${result.rawLog}`
            )
        }
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

        const client = await SigningStargateClient.connectWithSigner(stateset_rpcEndpoint, my_wallet, { gasPrice: "0.00025state" });

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
        const client = await SigningStargateClient.connectWithSigner(stateset_rpcEndpoint, my_wallet, { gasPrice: "0.00025state" });

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
            <div class="mt-10 sm:mt-0">
                <div class="">
                    <div class="mt-5">
                        <form method="POST">
                            <div class="shadow overflow-hidden sm:rounded-md">
                            <div class="divide-y divide-gray-200">
                                <div class="px-4 py-5 sm:px-6">
                                    <h2 id="notes-title" class="text-lg font-medium text-gray-900">New cw_erc20 Token</h2>
                                </div>
                                <div class="px-4 py-5 bg-white sm:p-6">
                                    <div class="grid grid-cols-6 gap-6">
                                        <div class="col-span-6 sm:col-span-2">
                                            <label for="token-name" class="block text-sm font-medium text-gray-700">Token Name</label>
                                            <input type="text" name="token-name" id="token-name" autocomplete="given-name" class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                                        </div>

                                        <div class="col-span-6 sm:col-span-2">
                                            <label for="last-name" class="block text-sm font-medium text-gray-700">Token Symbol</label>
                                            <input type="text" name="token-symbol" id="token-symbol" autocomplete="family-name" class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                                        </div>

                                        <div class="col-span-6 sm:col-span-2">
                                            <label for="street-address" class="block text-sm font-medium text-gray-700">Decimals</label>
                                            <input type="number" name="decimals" id="decimals" class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                                        </div>


                                        <div class="col-span-6 sm:col-span-4">
                                            <label for="amount" class="block text-sm font-medium text-gray-700">Initial Balance Address</label>
                                            <input type="text" name="text" id="initial-balance-address" class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                                        </div>


                                        <div class="col-span-6 sm:col-span-2">
                                            <label for="amount" class="block text-sm font-medium text-gray-700">Amount</label>
                                            <input type="number" name="amount" id="amount" class="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
                                        </div>

                                    </div>
                                </div>
                                <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                    <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Create New Token</button>
                                </div>
                            </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
        </main >
    )
}