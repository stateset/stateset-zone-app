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


    // Handle Swap Message
    const handleVerify = async (input) => {
        setStatus(prevStatus => ({ ...prevStatus, submitting: true }))

        const defaultExecuteFee = unsafelyGetDefaultExecuteFee()

            // Verify Message
            const msg1 = {
                verify: {
                    proof: `${input.proof}`
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
            <input onChange={handleOnChange} value={inputs.proof}  />
            {inputs.message}
            <button onClick={handleVerify}></button>
        </main>
    )
}