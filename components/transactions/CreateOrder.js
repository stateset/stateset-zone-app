import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { PlusIcon, MinusIcon, CreditCardIcon, CurrencyDollarIcon } from '@heroicons/react/outline';
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { SigningStargateClient } from "@cosmjs/stargate";
import { v4 as uuidv4 } from 'uuid';

const STABLECOINS = [
  { symbol: 'USDC', name: 'USD Coin (Noble)', description: 'Circle USD Coin via Noble', apy: null },
  { symbol: 'USDT', name: 'Tether USD', description: 'Tether stablecoin', apy: null },
  { symbol: 'USDY', name: 'Ondo US Dollar Yield', description: 'Yield-bearing USD backed by Treasuries', apy: '4-5%' },
  { symbol: 'SILK', name: 'Shade SILK', description: 'Privacy-preserving basket-pegged stablecoin', apy: null },
  { symbol: 'EURe', name: 'Monerium EUR emoney', description: 'Euro-backed stablecoin', apy: null }
];

export default function CreateOrder({ products = [], onOrderCreated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Items, 2: Details, 3: Payment, 4: Confirmation
  
  // Order state
  const [orderItems, setOrderItems] = useState([]);
  const [customerDetails, setCustomerDetails] = useState({
    address: '',
    email: '',
    name: ''
  });
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [selectedStablecoin, setSelectedStablecoin] = useState('USDC');
  const [notes, setNotes] = useState('');
  
  // Blockchain state
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [balances, setBalances] = useState({});
  
  // Order creation state
  const [createdOrder, setCreatedOrder] = useState(null);
  const [settlementResult, setSettlementResult] = useState(null);

  var mnemonic = '';
  if (process.browser) {
    mnemonic = localStorage.getItem("mnemonic") || '';
  }

  useEffect(() => {
    if (mnemonic) {
      connectWallet();
    }
  }, [mnemonic]);

  const connectWallet = async () => {
    try {
      const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
        mnemonic,
        { prefix: "stateset" }
      );
      const [firstAccount] = await wallet.getAccounts();
      setWalletAddress(firstAccount.address);
      setCustomerDetails(prev => ({ ...prev, address: firstAccount.address }));
      setWalletConnected(true);
      
      // Get balances
      await updateBalances(firstAccount.address);
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  };

  const updateBalances = async (address) => {
    try {
      const client = await SigningStargateClient.connect("https://rpc.stateset.zone");
      const newBalances = {};
      
      const stablecoinDenoms = {
        'USDC': 'usdc',
        'USDT': 'usdt', 
        'USDY': 'usdy',
        'SILK': 'silk',
        'EURe': 'eure'
      };

      for (const [symbol, denom] of Object.entries(stablecoinDenoms)) {
        try {
          const balance = await client.getBalance(address, denom);
          newBalances[symbol] = parseFloat(balance.amount) / 1000000; // Convert from micro units
        } catch (e) {
          newBalances[symbol] = 0;
        }
      }
      
      setBalances(newBalances);
    } catch (error) {
      console.error('Balance fetch error:', error);
    }
  };

  const addProduct = (product) => {
    const existingItem = orderItems.find(item => item.id === product.id);
    if (existingItem) {
      setOrderItems(orderItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setOrderItems([...orderItems, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      setOrderItems(orderItems.filter(item => item.id !== itemId));
    } else {
      setOrderItems(orderItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  const calculateTotals = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const shipping = subtotal > 100 ? 0 : 9.99; // Free shipping over $100
    const total = subtotal + tax + shipping;
    
    return { subtotal, tax, shipping, total };
  };

  const createOrder = async () => {
    setLoading(true);
    try {
      const { subtotal, tax, shipping, total } = calculateTotals();
      
      const orderData = {
        customer_address: customerDetails.address,
        items: orderItems.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          quantity: item.quantity
        })),
        payment_method: paymentMethod,
        payment_currency: selectedStablecoin,
        shipping_address: shippingAddress,
        billing_address: shippingAddress,
        total_amount: total,
        tax_amount: tax,
        shipping_amount: shipping,
        discount_amount: 0,
        notes
      };

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      
      if (result.success) {
        setCreatedOrder(result.order);
        setStep(4);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Order creation error:', error);
      alert('Failed to create order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const settlePayment = async () => {
    if (!createdOrder || !mnemonic) return;
    
    setLoading(true);
    try {
      const settlementData = {
        order_id: createdOrder.id,
        payment_currency: selectedStablecoin,
        amount: createdOrder.amounts.total_amount,
        customer_address: customerDetails.address,
        mnemonic: mnemonic
      };

      const response = await fetch('/api/orders/settle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settlementData)
      });

      const result = await response.json();
      
      if (result.success) {
        setSettlementResult(result.settlement);
        await updateBalances(customerDetails.address);
        if (onOrderCreated) {
          onOrderCreated(createdOrder, result.settlement);
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Settlement error:', error);
      alert('Payment failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, tax, shipping, total } = calculateTotals();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
        Create Order
      </button>

      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={setIsOpen}>
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
              <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
                
                {/* Header */}
                <div className="mb-6">
                  <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Create New Order
                  </Dialog.Title>
                  
                  {/* Step indicator */}
                  <div className="mt-4">
                    <div className="flex items-center">
                      {[1, 2, 3, 4].map((stepNum) => (
                        <div key={stepNum} className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            step >= stepNum 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {stepNum}
                          </div>
                          {stepNum < 4 && (
                            <div className={`flex-1 h-1 mx-2 ${
                              step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>Items</span>
                      <span>Details</span>
                      <span>Payment</span>
                      <span>Confirm</span>
                    </div>
                  </div>
                </div>

                {/* Step 1: Select Items */}
                {step === 1 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Select Products</h4>
                    
                    {/* Available Products */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                      {products.map((product) => (
                        <div key={product.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 dark:text-white">{product.name}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{product.description}</p>
                          <p className="text-lg font-semibold text-blue-600">${product.price}</p>
                          <button
                            onClick={() => addProduct(product)}
                            className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                          >
                            Add to Order
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Selected Items */}
                    {orderItems.length > 0 && (
                      <div className="mt-6">
                        <h5 className="font-medium text-gray-900 dark:text-white mb-3">Order Items</h5>
                        <div className="space-y-2">
                          {orderItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                              <div>
                                <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                                <span className="text-gray-600 dark:text-gray-400 ml-2">${item.price}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600"
                                >
                                  <MinusIcon className="h-4 w-4" />
                                </button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-600"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Order Summary */}
                        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <div className="space-y-1">
                            <div className="flex justify-between">
                              <span>Subtotal:</span>
                              <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tax:</span>
                              <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Shipping:</span>
                              <span>${shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg border-t border-blue-200 dark:border-blue-700 pt-1">
                              <span>Total:</span>
                              <span>${total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={() => setStep(2)}
                        disabled={orderItems.length === 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next: Customer Details
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Customer Details */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Customer Name
                        </label>
                        <input
                          type="text"
                          value={customerDetails.name}
                          onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
                          className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email
                        </label>
                        <input
                          type="email"
                          value={customerDetails.email}
                          onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
                          className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Wallet Address
                      </label>
                      <input
                        type="text"
                        value={customerDetails.address}
                        onChange={(e) => setCustomerDetails({...customerDetails, address: e.target.value})}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="stateset..."
                      />
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-900 dark:text-white">Shipping Address</h5>
                      
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                        className="block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="City"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                          className="block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                          className="block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="ZIP Code"
                          value={shippingAddress.zip}
                          onChange={(e) => setShippingAddress({...shippingAddress, zip: e.target.value})}
                          className="block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        <select
                          value={shippingAddress.country}
                          onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                          className="block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Order Notes (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="mt-1 block w-full border-gray-300 dark:border-gray-600 dark:bg-slate-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Special instructions, delivery preferences, etc."
                      />
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={() => setStep(1)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Next: Payment
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment Method */}
                {step === 3 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Payment Method</h4>
                    
                    {/* Payment Method Selection */}
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="crypto"
                          checked={paymentMethod === 'crypto'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3"
                        />
                        <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                        <span className="text-gray-900 dark:text-white">Cryptocurrency (Stablecoins)</span>
                      </label>
                    </div>

                    {/* Stablecoin Selection */}
                    {paymentMethod === 'crypto' && (
                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-900 dark:text-white">Select Stablecoin</h5>
                        <div className="grid grid-cols-1 gap-3">
                          {STABLECOINS.map((coin) => (
                            <label key={coin.symbol} className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer">
                              <input
                                type="radio"
                                value={coin.symbol}
                                checked={selectedStablecoin === coin.symbol}
                                onChange={(e) => setSelectedStablecoin(e.target.value)}
                                className="mr-3"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="font-medium text-gray-900 dark:text-white">{coin.symbol}</span>
                                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">{coin.name}</span>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-gray-900 dark:text-white">
                                      Balance: {(balances[coin.symbol] || 0).toFixed(2)} {coin.symbol}
                                    </div>
                                    {coin.apy && (
                                      <div className="text-xs text-green-600">
                                        APY: {coin.apy}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{coin.description}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                        
                        {/* Balance Warning */}
                        {selectedStablecoin && balances[selectedStablecoin] < total && (
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md p-3">
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                              ⚠️ Insufficient balance. You need {total.toFixed(2)} {selectedStablecoin} but only have {(balances[selectedStablecoin] || 0).toFixed(2)} {selectedStablecoin}.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between">
                      <button
                        onClick={() => setStep(2)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setStep(4)}
                        disabled={paymentMethod === 'crypto' && (!selectedStablecoin || balances[selectedStablecoin] < total)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Review Order
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Confirmation */}
                {step === 4 && (
                  <div className="space-y-4">
                    {!createdOrder ? (
                      <>
                        <h4 className="font-medium text-gray-900 dark:text-white">Order Summary</h4>
                        
                        {/* Order Review */}
                        <div className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg space-y-3">
                          <div>
                            <h5 className="font-medium text-gray-900 dark:text-white">Items</h5>
                            {orderItems.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span>{item.name} x{item.quantity}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                            <div className="flex justify-between text-sm">
                              <span>Subtotal:</span>
                              <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Tax:</span>
                              <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Shipping:</span>
                              <span>${shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-semibold">
                              <span>Total:</span>
                              <span>${total.toFixed(2)}</span>
                            </div>
                          </div>
                          
                          <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                            <p className="text-sm"><strong>Payment:</strong> {selectedStablecoin}</p>
                            <p className="text-sm"><strong>Customer:</strong> {customerDetails.name}</p>
                            <p className="text-sm"><strong>Email:</strong> {customerDetails.email}</p>
                            <p className="text-sm"><strong>Address:</strong> {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</p>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <button
                            onClick={() => setStep(3)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700"
                          >
                            Back
                          </button>
                          <button
                            onClick={createOrder}
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                          >
                            {loading ? 'Creating Order...' : 'Create Order'}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {settlementResult ? 'Order Complete!' : 'Order Created - Payment Required'}
                        </h4>
                        
                        {!settlementResult ? (
                          <>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                              <p className="text-sm text-blue-800 dark:text-blue-200">
                                Order ID: <code className="font-mono">{createdOrder.id}</code>
                              </p>
                              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                                Please complete payment to process your order.
                              </p>
                            </div>
                            
                            <button
                              onClick={settlePayment}
                              disabled={loading}
                              className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-medium"
                            >
                              {loading ? 'Processing Payment...' : `Pay ${total.toFixed(2)} ${selectedStablecoin}`}
                            </button>
                          </>
                        ) : (
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <p className="text-sm text-green-800 dark:text-green-200">
                              ✅ Payment successful! Transaction: <code className="font-mono">{settlementResult.transaction_hash}</code>
                            </p>
                            <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                              Your order will be fulfilled soon. You'll receive a confirmation email.
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Footer */}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setStep(1);
                      setOrderItems([]);
                      setCreatedOrder(null);
                      setSettlementResult(null);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}