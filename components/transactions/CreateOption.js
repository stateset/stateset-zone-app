import { MsgExecuteContract } from 'cosmjs-types/cosmwasm/wasm/v1/tx'
import React, { useState, Fragment } from 'react'


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
        senderAddress: "",
        contractAddress: "",
        proof: "",
        collateral: "",
        counter_offer: "",
        expires: "",
        option: "",
        message: '',
        mnemonic: password
    })

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

    const handleResponse = (status, msg) => {
        if (status === 200) {
            setStatus({
                submitted: true,
                submitting: false,
                info: { error: false, msg: msg }
            })
            setInputs({
                proof: '',
                message: msg,
                mnemonic: ''

            })
        } else {
            setStatus({
                info: { error: true, msg: msg }
            })
        }
    }


    // Handle Execute Option

    const handleCreateOption = async (input) => {
        setStatus(prevStatus => ({ ...prevStatus, submitting: true }))

        const defaultExecuteFee = unsafelyGetDefaultExecuteFee()

            // Execute Option Message
            const msg1 = {
                verify: {
                    collateral: `${input.collateral}`,
                    counter_offer: `${input.counter_offer}`,
                    expires: `${input.expires}`
                    
                },
            }

            // Execute Contract Message
            const executeVerifyContractMsg1 = {
                typeUrl: '/cosmwasm.wasm.v1.MsgExecuteContract',
                value: MsgExecuteContract.fromPartial({
                    sender: input.senderAddress,
                    contract: input.contractAddress,
                    msg: toUtf8(JSON.stringify(msg1)),
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
                [executeVerifyContractMsg1],
                fee
            )

            handleResponse(status, result);


            if (isDeliverTxFailure(result)) {
                throw new Error(
                    `Error when broadcasting tx ${result.transactionHash} at height ${result.height}. Code: ${result.code}; Raw log: ${result.rawLog}`
                )
            }
    }

    return (
        <main>
            <div>
                <label for="account-number" class="block text-sm font-medium text-gray-700 float-left">Collateral DID</label>
                <div class="mt-2 relative rounded-md shadow-sm">
                    <input type="text" name="did" id="did" class="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md" placeholder="did:stateset:po..." onChange={handleOnChange} value={inputs.collateral} />
                </div>
            </div>
            <div>
                <label for="account-number" class="block text-sm font-medium text-gray-700 float-left">Counter Offer</label>
                <div class="mt-2 relative rounded-md shadow-sm">
                    <input type="text" name="uri" id="uri" class="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md" placeholder="" onChange={handleOnChange} value={inputs.counter_offer} />
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span class="dark:text-white pt-5 text-gray-500 sm:text-sm" id="price-currency">
                            STATE
                        </span>
                    </div>
                </div>
            </div>
            <div>
                <label for="account-number" class="block text-sm font-medium text-gray-700 float-left">Expiration Block</label>
                <div class="mt-2 relative rounded-md shadow-sm">
                    <input type="text" name="amount" id="amount" class="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md" placeholder="" onChange={handleOnChange} value={inputs.expires} />
                    
                </div>
            </div>
            <button onClick={handleCreateOption} type="button" class="mt-8 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Create Option
            </button>
        </main>
    )
}