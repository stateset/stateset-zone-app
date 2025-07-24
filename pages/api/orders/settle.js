import { DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import { SigningStargateClient, defaultRegistryTypes } from "@cosmjs/stargate";

// Stablecoin configurations for Stateset network
const STABLECOIN_CONFIG = {
  'USDC': {
    denom: 'usdc',
    decimal_places: 6,
    contract_address: 'stateset1usdc...', // Noble USDC contract address
    ibc_channel: 'channel-0', // IBC channel for Noble USDC
    min_amount: 1000 // 0.001 USDC
  },
  'USDT': {
    denom: 'usdt',
    decimal_places: 6,
    contract_address: 'stateset1usdt...', // USDT contract address
    ibc_channel: 'channel-1',
    min_amount: 1000
  },
  'USDY': {
    denom: 'usdy',
    decimal_places: 6,
    contract_address: 'stateset1usdy...', // Ondo USDY contract address
    ibc_channel: 'channel-2',
    min_amount: 1000
  },
  'SILK': {
    denom: 'silk',
    decimal_places: 6,
    contract_address: 'stateset1silk...', // Shade SILK contract address
    ibc_channel: 'channel-3',
    min_amount: 1000
  },
  'EURe': {
    denom: 'eure',
    decimal_places: 6,
    contract_address: 'stateset1eure...', // Monerium EURe contract address
    ibc_channel: 'channel-4',
    min_amount: 1000
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      order_id,
      payment_currency,
      amount,
      customer_address,
      mnemonic,
      merchant_address
    } = req.body;

    // Validate required fields
    if (!order_id || !payment_currency || !amount || !customer_address || !mnemonic) {
      return res.status(400).json({ 
        message: 'Missing required fields: order_id, payment_currency, amount, customer_address, mnemonic' 
      });
    }

    // Validate stablecoin
    const stablecoinConfig = STABLECOIN_CONFIG[payment_currency];
    if (!stablecoinConfig) {
      return res.status(400).json({ 
        message: `Unsupported stablecoin: ${payment_currency}. Supported: ${Object.keys(STABLECOIN_CONFIG).join(', ')}` 
      });
    }

    // Default merchant address (could be configured per merchant)
    const recipientAddress = merchant_address || "stateset1na53ljfnfjjjapmxpu6ctd5fgxzvnm66k0pqft";

    // Create wallet from mnemonic
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
      mnemonic,
      { prefix: "stateset" }
    );

    const [firstAccount] = await wallet.getAccounts();
    console.log('Customer address:', firstAccount.address);

    // Validate customer address matches
    if (firstAccount.address !== customer_address) {
      return res.status(400).json({ 
        message: 'Customer address does not match wallet address' 
      });
    }

    // Connect to Stateset network
    const rpcEndpoint = "https://rpc.stateset.zone";
    const client = await SigningStargateClient.connectWithSigner(
      rpcEndpoint, 
      wallet, 
      { gasPrice: "0.00025state" }
    );

    // Convert amount to micro units (assuming 6 decimal places)
    const microAmount = Math.floor(amount * Math.pow(10, stablecoinConfig.decimal_places));

    // Validate minimum amount
    if (microAmount < stablecoinConfig.min_amount) {
      return res.status(400).json({ 
        message: `Amount too small. Minimum: ${stablecoinConfig.min_amount / Math.pow(10, stablecoinConfig.decimal_places)} ${payment_currency}` 
      });
    }

    // Check balance
    const balance = await client.getBalance(firstAccount.address, stablecoinConfig.denom);
    if (parseInt(balance.amount) < microAmount) {
      return res.status(400).json({ 
        message: `Insufficient balance. Required: ${amount} ${payment_currency}, Available: ${parseInt(balance.amount) / Math.pow(10, stablecoinConfig.decimal_places)} ${payment_currency}` 
      });
    }

    // Prepare transfer amount
    const transferAmount = {
      denom: stablecoinConfig.denom,
      amount: microAmount.toString()
    };

    // Create transaction memo with order information
    const memo = `Order:${order_id} Settlement:${payment_currency} Amount:${amount}`;

    // Execute stablecoin transfer
    const result = await client.sendTokens(
      firstAccount.address,
      recipientAddress,
      [transferAmount],
      "auto",
      memo
    );

    console.log('Settlement transaction result:', result);

    // Check if transaction was successful
    if (result.code !== 0) {
      return res.status(400).json({
        success: false,
        message: 'Transaction failed',
        error: result.rawLog || 'Unknown transaction error',
        transaction_hash: result.transactionHash
      });
    }

    // Get updated balances
    const newCustomerBalance = await client.getBalance(firstAccount.address, stablecoinConfig.denom);
    const merchantBalance = await client.getBalance(recipientAddress, stablecoinConfig.denom);

    // Create settlement record
    const settlement = {
      order_id,
      transaction_hash: result.transactionHash,
      payment_currency,
      amount,
      micro_amount: microAmount,
      customer_address: firstAccount.address,
      merchant_address: recipientAddress,
      block_height: result.height,
      gas_used: result.gasUsed,
      gas_wanted: result.gasWanted,
      memo,
      settled_at: new Date().toISOString(),
      network: 'stateset',
      stablecoin_config: {
        denom: stablecoinConfig.denom,
        contract_address: stablecoinConfig.contract_address,
        ibc_channel: stablecoinConfig.ibc_channel
      },
      balances: {
        customer_new_balance: newCustomerBalance.amount,
        merchant_new_balance: merchantBalance.amount
      }
    };

    // TODO: Update order status in database
    // TODO: Trigger order fulfillment workflow
    // TODO: Send confirmation emails/notifications

    res.status(200).json({
      success: true,
      message: 'Payment settled successfully',
      settlement,
      next_steps: {
        order_status: 'paid',
        fulfillment_status: 'ready_for_fulfillment',
        tracking_available: false,
        estimated_delivery: null
      }
    });

  } catch (error) {
    console.error('Settlement error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Settlement failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}