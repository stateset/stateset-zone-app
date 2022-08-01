import { DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import { stringToPath } from "@cosmjs/crypto";
import { MsgDelegate } from "@cosmjs/stargate";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient, defaultRegistryTypes as defaultStargateTypes } from "@cosmjs/stargate";
import React, { useState } from 'react'
import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";

export default () => {
    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null }
    })

    const [inputs, setInputs] = useState({
        recipient: '',
        amount: '',
        message: '',
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

    const handleOnSubmit = async e => {
        setStatus(prevStatus => ({ ...prevStatus, submitting: true }))
        const _mnemonic = "";
        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
            _mnemonic,
            { prefix: "stateset" },
        );
        console.log(wallet);

        const registry = new Registry(defaultStargateTypes);

        const [firstAccount] = await wallet.getAccounts();
        console.log(firstAccount);
        console.log(firstAccount.address);

        // Rpc Endpoint
        const rpcEndpoint = "http://stateset.zone:26657";
        const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, { registry: registry, gasPrice: "0.025state" });

    }

    return (
        <main>
            <div>
            <div className="mt-3">
                <h1 className="py-3 mr-3 float-left text-lg leading-6 font-medium text-gray-900">
                    Vote
                </h1>
                <div className="mt-2.5 rounded px-0.5 float-right text-green-500 text-xs">
                    <span class="h-8 flex items-center" aria-hidden="true">
                        <span class="h-2 w-2 bg-green-500 rounded-full mr-1"></span>
                        stateset-1-testnet -
                    </span>
                </div>
                <p className="py-4 text-sm tracking-tight text-gray-500 lg:visible md:visible invisible">
                    Vote on a Proposal 
                </p>
            </div>
                <div class="mt-2 relative rounded-md ">
                    <fieldset class="space-y-5">
                        <legend class="sr-only">Notifications</legend>
                        <div class="relative flex items-start">
                            <div class="flex items-center h-5">
                                <input id="comments" aria-describedby="comments-description" name="comments" type="checkbox" checked class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                            </div>
                            <div class="ml-3 text-sm">
                                <label for="comments" class="font-medium text-gray-700">Yes</label>
                                <span id="comments-description" class="text-gray-500"><span class="sr-only">New comments </span></span>
                            </div>
                        </div>
                        <div class="relative flex items-start">
                            <div class="flex items-center h-5">
                                <input id="candidates" aria-describedby="candidates-description" name="candidates" type="checkbox" class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                            </div>
                            <div class="ml-3 text-sm">
                                <label for="candidates" class="font-medium text-gray-700">No</label>
                                <span id="candidates-description" class="text-gray-500"><span class="sr-only">New candidates </span></span>
                            </div>
                        </div>
                        <div class="relative flex items-start">
                            <div class="flex items-center h-5">
                                <input id="offers" aria-describedby="offers-description" name="offers" type="checkbox" class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded" />
                            </div>
                            <div class="ml-3 text-sm">
                                <label for="offers" class="font-medium text-gray-700">Maybe</label>
                                <span id="offers-description" class="text-gray-500"><span class="sr-only">Offers </span></span>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>
            <button onClick={handleOnSubmit} type="button" class="mt-8 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Vote YES
            </button>
            <br />
            <br />
            <br />
        </main >
    )
}