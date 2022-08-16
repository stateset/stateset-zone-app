import { DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import { stringToPath } from "@cosmjs/crypto";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient, defaultRegistryTypes as defaultStargateTypes } from "@cosmjs/stargate";
import React, { useState } from 'react'

import { Type, Field } from "protobufjs";

const MsgFactorInvoice = new Type("MsgFactorInvoice")
    .add(new Field("creator", 1, "string"))
    .add(new Field("id", 2, "uint64"));


export default (props) => {
    const [status, setStatus] = useState({
        submitted: false,
        submitting: false,
        info: { error: false, msg: null }
    })

    const [inputs, setInputs] = useState({
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
        myRegistry.register("/stateset.core.invoice.MsgFactorInvoice", MsgFactorInvoice);

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
                typeUrl: "/stateset.core.invoice.MsgFactorInvoice",
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

            const response = await client.signAndBroadcast(creator_address, [message], "auto", 'uploading a invoice from stateset zone');

            console.log(response);

        }
    }
    

    return (
        <main>
            <button onClick={handleOnSubmit} type="button" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Factor
            </button>
        </main >
    )
}