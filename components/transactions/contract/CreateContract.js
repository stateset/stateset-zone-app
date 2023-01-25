import {
    MsgExecuteContract,
    setupWasmExtension,
} from "@cosmjs/cosmwasm";

import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { stringToPath } from "@cosmjs/crypto";
import { assert } from "@cosmjs/utils";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import React, { useState, Fragment } from 'react'
import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";

import {
    QueryAllContractStateResponse,
    QueryClientImpl,
    QueryCodeResponse,
    QueryCodesResponse,
    QueryContractHistoryResponse,
    QueryContractInfoResponse,
    QueryContractsByCodeResponse,
    QueryRawContractStateResponse,
} from "cosmjs-types/cosmwasm/wasm/v1/query";

import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/outline'

const msg = {
    type: "wasm/MsgExecuteContract",
    value: {
        sender: "myAddress",
        contract: "contractAddress",
        msg: "wasmMsg",
        sent_funds: [],
    },
};


export default () => {
    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null }
    })

    const [open, setOpen] = useState(false)

    const [inputs, setInputs] = useState({
        recipient: '',
        code_info: '',
        amount: '',
        message: '',

    })


    // Get the Wasm Contract
    const getContract = async () => {
        // This is your rpc endpoint
        const rpcEndpoint = "https://rpc.stateset.app";

        // This is your contract address
        const contractAddr = "stateet19qws2lfd8pskyn0cfgpl5yjjyq3msy5402qr8nkzff9kdnkaepyqycedfh";

        // This is your client.
        //const client = await CosmWasmSigningClient.connect(rpcEndpoint);

        // This is your config.
        //const config = await client.queryContractSmart(contractAddr, { config: {} })
    }



    // Inside an async function...
    const handleGetCodeInfo = async () => {

        // The Tendermint client knows how to talk to the Tendermint RPC endpoint
        const tendermintClient = await Tendermint34Client.connect("https://rpc.stateset.app");

        // The generic Stargate query client knows how to use the Tendermint client to submit unverified ABCI queries
        const queryClient = new QueryClient(tendermintClient);

        // This helper function wraps the generic Stargate query client for use by the specific generated query client
        const rpcClient = createProtobufRpcClient(queryClient);

        // Here we instantiate a specific query client which will have the custom methods defined in the .proto file
        const queryService = new QueryClientImpl(rpcClient);

        // Now you can use this service to submit queries
        const { code_info } = await queryService.Codes;
        console.log("code info: ", code_info);

        handleResponse(200, code_info);
    }

    const handleResponse = (status, code_info, msg) => {
        if (status === 200) {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: msg }
            })
            setInputs({
                recipient: inputs.recipient,
                code_info: code_info,
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

        // Accounts
        const _mnemonic = ""

        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
            _mnemonic,
            { prefix: "stateset" },
        );
        const [firstAccount] = await wallet.getAccounts();

        const rpcEndpoint = "https://rpc.stateset.app";
        const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, { gasPrice: "0.00025state" });
        console.log(client);

        setOpen(true);
        handleGetCodeInfo();
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
                                            <p className="text-sm text-gray-500">
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
                <button type="button" class="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
</svg>
                    <span class="mt-2 block text-sm font-medium text-gray-900"> Deploy a new Smart Contract </span>
                </button>
                <div class="float-right pt-5 text-gray-500 sm:text-sm">
                    {inputs.code_info}
                </div>
            </div>
            <br />
        </main >
    )
}