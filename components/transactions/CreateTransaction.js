import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { stringToPath } from "@cosmjs/crypto";
import { assert } from "@cosmjs/utils";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import React, { useState, Fragment } from 'react'
import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { QueryClientImpl } from "cosmjs-types/cosmos/bank/v1beta1/query";
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'

export default () => {
    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null }
    })

    const [open, setOpen] = useState(false)

    const [inputs, setInputs] = useState({
        recipient: '',
        stateset_balance: '',
        amount: '',
        message: '',
    })



    // Inside an async function...
    const handleGetBalance = async (address, denom) => {

        // The Tendermint client knows how to talk to the Tendermint RPC endpoint
        const tendermintClient = await Tendermint34Client.connect("https://rpc.stateset.zone");

        // The generic Stargate query client knows how to use the Tendermint client to submit unverified ABCI queries
        const queryClient = new QueryClient(tendermintClient);

        // This helper function wraps the generic Stargate query client for use by the specific generated query client
        const rpcClient = createProtobufRpcClient(queryClient);

        // Here we instantiate a specific query client which will have the custom methods defined in the .proto file
        const queryService = new QueryClientImpl(rpcClient);

        // Now you can use this service to submit queries
        const { balance } = await queryService.Balance({ address: address, denom: denom });
        console.log(balance);

        handleResponse(200, balance.amount);
    }

    const handleResponse = (status, amount, msg) => {
        if (status === 200) {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: msg }
            })
            setInputs({
                recipient: inputs.recipient,
                stateset_balance: amount,
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

    const handleOnSubmit = async e => {
        setStatus(prevStatus => ({ ...prevStatus, submitting: true }))

        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
            new_account,
            { prefix: "stateset" },
        );
        console.log(wallet);

        const [firstAccount] = await wallet.getAccounts();
        console.log(firstAccount);
        console.log(firstAccount.address);

        const rpcEndpoint = "https://rpc.stateset.zone";
        const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, { gasPrice: "0.025state" });

        console.log(inputs.recipient);
        console.log(inputs.amount);

        const recipient = inputs.recipient;
        const amount = {
            denom: "state",
            amount: inputs.amount,
        };

        console.log(amount);

        const result = await client.sendTokens(firstAccount.address, recipient, [amount], "auto", "Have fun with your stateset coins");
        const after = await client.getBalance(recipient, "state");
        console.log(after);
        console.log(result);
        setOpen(true);
        handleGetBalance(firstAccount.address, "state");
    }

    const handleSendViaIBC = async e => {
        setStatus(prevStatus => ({ ...prevStatus, submitting: true }))

        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
            new_account,
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
            "",
            "",
            coin(inputs.amount, "state"),
            "transfer",
            "channel-0",
            undefined,
            Math.floor(Date.now() / 1000) + 60,
            "auto",
            "sent via stateset zone",
          );

        console.log(ibc_result);
        setOpen(true);
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
                                            <p className="text-sm text-blue-600">
                                                Your transaction has been sent to {inputs.recipient}
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
            <div className="mt-2">
                <div class="float-right pt-5 text-blue-600 sm:text-sm">
                    {inputs.stateset_balance} STATE
                </div>
                <p className="py-4 text-sm tracking-tight text-blue-600 lg:visible md:visible invisible">
                    Send a transaction
                </p>
            </div>
            <div>
                <label for="account-number" class="block text-sm font-medium text-gray-700 float-left">Address</label>
                <div class="mt-2 relative rounded-md shadow-sm">
                    <input type="text" name="recipient" id="recipient" class="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md" placeholder="stateset28x8..." onChange={handleOnChange} value={inputs.recipient} />
                </div>
            </div>
            <div>
                <label for="price" class="block text-sm font-medium text-gray-700 float-left">Amount</label>
                <div class="mt-2 relative rounded-md shadow-sm">
                    <input type="text" name="amount" id="amount" class="focus:ring-blue-500 focus:border-blue-500 block w-full p2-2 pr-12 sm:text-sm border-gray-300 rounded-md" placeholder="" aria-describedby="price-currency" onChange={handleOnChange} value={inputs.amount} />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span class="pt-5 text-blue-600 sm:text-sm" id="price-currency">
                            STATE
                        </span>
                    </div>
                </div>
            </div>
            <button onClick={handleOnSubmit} type="button" class="float-left mt-8 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Send {inputs.amount} STATE
            </button>
            <br />
            <br />
            <br />
        </main >
    )
}