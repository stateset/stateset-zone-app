import { DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import { stringToPath } from "@cosmjs/crypto";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient, defaultRegistryTypes as defaultStargateTypes } from "@cosmjs/stargate";
import React, { useState } from 'react'



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

    const handleOnSubmit = async e => {
        setStatus(prevStatus => ({ ...prevStatus, submitting: true }))
        const myRegistry = new Registry(defaultStargateTypes);
        myRegistry.register("/stateset.core.invoice.MsgCreateInvoice", MsgCreateInvoice);
        myRegistry.register("/stateset.core.invoice.MsgFactorInvoice", MsgFactorInvoice);

        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
            mnemonic,
            stringToPath("m/0'/1/2'/2/1000000000"),
            { prefix: "stateset" },
        );
        console.log(wallet);

        const [firstAccount] = await wallet.getAccounts();
        console.log(firstAccount);

        const rpcEndpoint = "https://rpc.stateset.zone";

        const client = await SigningStargateClient.connectWithSigner(
            rpcEndpoint,
            wallet,
            { registry: myRegistry },
        );

        console.log(client);

        const message = {
            typeUrl: "/stateset.core.invoice.MsgCreateInvoice",
            value: MsgCreateInvoice.fromPartial({
                did: inputs.did,
                uri: inputs.uri,
                amount: inputs.amount,
                state: "request"
            }),
        };

        // Fee
        const fee = {
            amount: [
                {
                    denom: "state",
                    amount: "1",
                },
            ],
            gas: "10000",
        };

        const response = await client.signAndBroadcast(firstAccount.address, [message], fee);
    }

    return (
        <main>
            <label htmlFor="message"></label>
            <div>
                <label for="account-number" class="block text-sm font-medium text-gray-700 float-left">DID</label>
                <div class="mt-2 relative rounded-md shadow-sm">
                    <input type="text" name="did" id="did" class="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md" placeholder="did:stateset:po..." onChange={handleOnChange} value={inputs.did} />
                </div>
            </div>
            <div>
                <label for="account-number" class="block text-sm font-medium text-gray-700 float-left">URI</label>
                <div class="mt-2 relative rounded-md shadow-sm">
                    <input type="text" name="uri" id="uri" class="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md" placeholder="" onChange={handleOnChange} value={inputs.uri} />
                </div>
            </div>
            <div>
                <label for="account-number" class="block text-sm font-medium text-gray-700 float-left">Amount</label>
                <div class="mt-2 relative rounded-md shadow-sm">
                    <input type="text" name="amount" id="amount" class="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md" placeholder="" onChange={handleOnChange} value={inputs.amount} />
                    <span class="dark:text-white pt-5 text-gray-500 sm:text-sm" id="price-currency">
                        STATE
                    </span>
                </div>
            </div>
            <div>
                <label for="account-number" class="block text-sm font-medium text-gray-700 float-left">State</label>
                <div class="mt-2 relative rounded-md shadow-sm">
                    <input type="text" name="recipient" id="recipient" class="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md" placeholder="" onChange={handleOnChange} value={inputs.recipient} />
                </div>
            </div>
            <button onClick={handleOnSubmit} type="button" class="mt-8 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Upload Invoice
            </button>
            <br />
        </main >
    )
}