import { DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import { stringToPath } from "@cosmjs/crypto";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient, defaultRegistryTypes as defaultStargateTypes } from "@cosmjs/stargate";
import React, { useState } from 'react'
import { uuid } from "uuidv4";


import { Type, Field } from "protobufjs";

const MsgRequestPurchaseorder = new Type("MsgRequestPurchaseorder")
    .add(new Field("creator", 1, "string"))
    .add(new Field("did", 2, "string"))
    .add(new Field("uri", 3, "string"))
    .add(new Field("amount", 4, "string"))
    .add(new Field("state", 5, "string"));


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
        myRegistry.register("/stateset.core.purchaseorder.MsgRequestPurchaseorder", MsgRequestPurchaseorder);

        const mnemonic = process.env.NEXT_PUBLIC_MNEMONIC;

        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
            mnemonic,
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
                    did: "did:stateset:po:" + uuid(),
                    uri: inputs.uri,
                    amount: inputs.amount,
                    state: "request"
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

            const response = await client.signAndBroadcast(creator_address, [message], "auto", 'uploading a po request from stateset zone');

            console.log(response);
        }
    }

    return (
        <main>
            <label htmlFor="message"></label>
            <div>
                <label for="account-number" class="block text-sm font-medium text-gray-700 float-left">URI</label>
                <div class="mt-2 relative rounded-md shadow-sm">
                    <input type="text" name="uri" id="uri" class="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md" placeholder="" onChange={handleOnChange} value={inputs.uri} />
                </div>
            </div>
            <div>
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
            <br />
        </main >
    )
}