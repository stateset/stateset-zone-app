import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import React, { useState, Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon, CurrencyDollarIcon, XIcon } from '@heroicons/react/outline'
import Router from "next/router";

// Stablecoin configurations
const STABLECOIN_CONFIG = {
  'USDC': {
    denom: 'usdc',
    decimal_places: 6,
    description: 'Circle USD Coin via Noble',
    min_amount: 1000 // 0.001 USDC
  },
  'USDT': {
    denom: 'usdt',
    decimal_places: 6,
    description: 'Tether USD via Stable Chain',
    min_amount: 1000
  },
  'USDY': {
    denom: 'usdy',
    decimal_places: 6,
    description: 'Ondo yield-bearing USD',
    apy: '4-5%',
    min_amount: 1000
  },
  'SILK': {
    denom: 'silk',
    decimal_places: 6,
    description: 'Shade privacy stablecoin',
    min_amount: 1000
  },
  'EURe': {
    denom: 'eure',
    decimal_places: 6,
    description: 'Monerium EUR emoney',
    min_amount: 1000
  }
};

export default function BuyNowStablecoin({ product, amount }) {
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null }
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedStablecoin, setSelectedStablecoin] = useState('USDC');
  const [balances, setBalances] = useState({});
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);

  var mnemonic = '';
  if (process.browser) {
    mnemonic = localStorage.getItem("mnemonic") || '';
  }

  // Confirm and error states
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (mnemonic && showModal) {
      connectWallet();
    }
  }, [mnemonic, showModal]);

  const connectWallet = async () => {
    try {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        mnemonic,
        { prefix: "stateset" }
      );
      const [firstAccount] = await wallet.getAccounts();
      setWalletAddress(firstAccount.address);
      
      // Get balances for all stablecoins
      await updateBalances(firstAccount.address);
    } catch (error) {
      console.error('Wallet connection error:', error);
      setMessage('Failed to connect wallet');
      setError(true);
    }
  };

  const updateBalances = async (address) => {
    try {
      const client = await SigningStargateClient.connect("https://rpc.stateset.zone");
      const newBalances = {};
      
      for (const [symbol, config] of Object.entries(STABLECOIN_CONFIG)) {
        try {
          const balance = await client.getBalance(address, config.denom);
          newBalances[symbol] = parseFloat(balance.amount) / Math.pow(10, config.decimal_places);
        } catch (e) {
          newBalances[symbol] = 0;
        }
      }
      
      setBalances(newBalances);
    } catch (error) {
      console.error('Balance fetch error:', error);
    }
  };

  const handlePurchase = async () => {
    if (!mnemonic || !walletAddress) {
      setMessage('Please connect your wallet first');
      setError(true);
      return;
    }

    const stablecoinConfig = STABLECOIN_CONFIG[selectedStablecoin];
    if (!stablecoinConfig) {
      setMessage('Invalid stablecoin selected');
      setError(true);
      return;
    }

    // Check balance
    const requiredBalance = amount;
    const currentBalance = balances[selectedStablecoin] || 0;
    
    if (currentBalance < requiredBalance) {
      setMessage(`Insufficient balance. Required: ${requiredBalance} ${selectedStablecoin}, Available: ${currentBalance.toFixed(2)} ${selectedStablecoin}`);
      setError(true);
      return;
    }

    setLoading(true);
    setStatus(prevStatus => ({ ...prevStatus, submitting: true }));

    try {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        mnemonic,
        { prefix: "stateset" }
      );

      const [firstAccount] = await wallet.getAccounts();
      const rpcEndpoint = "https://rpc.stateset.zone";
      const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet, { gasPrice: "0.00025state" });

      // Convert amount to micro units
      const microAmount = Math.floor(amount * Math.pow(10, stablecoinConfig.decimal_places));
      
      const recipient = "stateset1na53ljfnfjjjapmxpu6ctd5fgxzvnm66k0pqft"; // Merchant address
      const transferAmount = {
        denom: stablecoinConfig.denom,
        amount: microAmount.toString(),
      };

      const memo = `Purchase: ${product} for ${amount} ${selectedStablecoin}`;

      console.log('Sending transaction:', { transferAmount, recipient, memo });

      const result = await client.sendTokens(firstAccount.address, recipient, [transferAmount], "auto", memo);
      console.log('Transaction result:', result);

      if (result.code === 0) {
        // Update balances
        await updateBalances(firstAccount.address);
        
        setStatus({
          submitted: true,
          submitting: false,
          info: { error: false, msg: "Payment successful!" }
        });
        
        setConfirm(true);
        setShowModal(false);
        
        // Redirect to confirmation page after a delay
        setTimeout(() => {
          Router.push('/confirmation');
        }, 2000);
        
      } else {
        throw new Error(result.rawLog || 'Transaction failed');
      }

    } catch (error) {
      console.error('Purchase error:', error);
      setMessage(error.message || 'Transaction failed');
      setError(true);
      
      setStatus({
        submitted: false,
        submitting: false,
        info: { error: true, msg: error.message }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        type="button" 
        className="relative flex bg-blue-600 border border-transparent rounded-md py-2 px-8 items-center justify-center text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        <CurrencyDollarIcon className="h-4 w-4 mr-2" />
        Buy with Stablecoins
      </button>

      {/* Payment Modal */}
      <Transition.Root show={showModal} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={setShowModal}>
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
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
              <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="bg-white dark:bg-slate-800 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 sm:mx-0 sm:h-10 sm:w-10">
                    <CurrencyDollarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Buy {product}
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Select a stablecoin to complete your purchase of <strong>{product}</strong> for <strong>{amount}</strong> tokens.
                      </p>
                    </div>

                    {/* Wallet Status */}
                    {walletAddress && (
                      <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Connected Wallet:</p>
                        <p className="text-sm font-mono text-gray-900 dark:text-white">{walletAddress.substring(0, 20)}...</p>
                      </div>
                    )}

                    {/* Stablecoin Selection */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Payment Currency
                      </label>
                      <div className="space-y-2">
                        {Object.entries(STABLECOIN_CONFIG).map(([symbol, config]) => (
                          <label key={symbol} className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer">
                            <input
                              type="radio"
                              value={symbol}
                              checked={selectedStablecoin === symbol}
                              onChange={(e) => setSelectedStablecoin(e.target.value)}
                              className="mr-3"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-medium text-gray-900 dark:text-white">{symbol}</span>
                                  {config.apy && (
                                    <span className="ml-2 text-xs text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400 px-2 py-1 rounded">
                                      APY: {config.apy}
                                    </span>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-900 dark:text-white">
                                    {(balances[symbol] || 0).toFixed(2)} {symbol}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">Available</div>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{config.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Insufficient Balance Warning */}
                    {selectedStablecoin && balances[selectedStablecoin] < amount && (
                      <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          ⚠️ Insufficient balance. You need {amount} {selectedStablecoin} but only have {(balances[selectedStablecoin] || 0).toFixed(2)} {selectedStablecoin}.
                        </p>
                      </div>
                    )}

                    {/* Purchase Summary */}
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-blue-800 dark:text-blue-200">Total:</span>
                        <span className="font-semibold text-blue-900 dark:text-blue-100">{amount} {selectedStablecoin}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    disabled={loading || !selectedStablecoin || balances[selectedStablecoin] < amount}
                    onClick={handlePurchase}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : `Pay ${amount} ${selectedStablecoin}`}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-slate-700 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Success Notification */}
      <Transition.Root show={confirm} as={Fragment}>
        <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start">
          <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
            <Transition.Child
              as={Fragment}
              enter="transform ease-out duration-300 transition"
              enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
              enterTo="translate-y-0 opacity-100 sm:translate-x-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="max-w-sm w-full bg-white dark:bg-slate-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Payment Successful!
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        You successfully purchased {product} for {amount} {selectedStablecoin}.
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                      <button
                        className="bg-white dark:bg-slate-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => setConfirm(false)}
                      >
                        <span className="sr-only">Close</span>
                        <XIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition.Root>

      {/* Error Notification */}
      <Transition.Root show={error} as={Fragment}>
        <div aria-live="assertive" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start">
          <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
            <Transition.Child
              as={Fragment}
              enter="transform ease-out duration-300 transition"
              enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
              enterTo="translate-y-0 opacity-100 sm:translate-x-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="max-w-sm w-full bg-white dark:bg-slate-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <XIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Payment Failed
                      </p>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {message}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                      <button
                        className="bg-white dark:bg-slate-800 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => setError(false)}
                      >
                        <span className="sr-only">Close</span>
                        <XIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition.Root>
    </>
  );
}