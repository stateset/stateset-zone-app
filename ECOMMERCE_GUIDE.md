# E-Commerce Orders with Stablecoin Settlement on Stateset Network

This guide explains how to use the enhanced e-commerce order functionality with stablecoin settlement capabilities on the Stateset Network.

## Overview

The Stateset Zone platform now supports comprehensive e-commerce order creation and settlement using multiple stablecoins. This enables merchants and customers to transact with stable value cryptocurrencies while benefiting from the security and transparency of blockchain technology.

## Features

### 🛒 E-Commerce Order Creation
- **Multi-item orders**: Add multiple products with quantities
- **Customer information**: Capture shipping and billing details
- **Tax calculation**: Automatic tax calculation (8% default)
- **Shipping calculation**: Free shipping over $100, otherwise $9.99
- **Order tracking**: Unique order IDs and DIDs for blockchain verification

### 💰 Stablecoin Payment Support
- **USDC**: Circle USD Coin via Noble Network
- **USDT**: Tether USD via Stable Chain
- **USDY**: Ondo yield-bearing USD (4-5% APY)
- **SILK**: Shade privacy-preserving stablecoin
- **EURe**: Monerium EUR emoney

### 🔗 Blockchain Settlement
- **Instant finality**: Transactions settle in seconds
- **Low fees**: Minimal gas costs on Stateset Network
- **Transparency**: All transactions recorded on-chain
- **Security**: Cryptographic proof of payment

## Getting Started

### Prerequisites

1. **Wallet Setup**: Have a Stateset wallet with mnemonic stored in localStorage
2. **Stablecoin Balance**: Ensure sufficient stablecoin balance for purchases
3. **Network Access**: Connected to Stateset Network (RPC: https://rpc.stateset.zone)

### Creating an Order

1. **Navigate to Orders Page**: Go to `/orders` in the application
2. **Click "Create Order"**: Start the order creation process
3. **Select Products**: Choose from available products and set quantities
4. **Enter Customer Details**: Provide shipping information and contact details
5. **Choose Payment Method**: Select your preferred stablecoin
6. **Review and Confirm**: Check order details and total amount
7. **Complete Payment**: Execute the blockchain transaction

## API Endpoints

### Create Order
```bash
POST /api/orders/create
```

**Request Body:**
```json
{
  "customer_address": "stateset1...",
  "items": [
    {
      "id": "prod_1",
      "name": "Product Name",
      "description": "Product description",
      "price": 29.99,
      "quantity": 2
    }
  ],
  "payment_method": "crypto",
  "payment_currency": "USDC",
  "shipping_address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "US"
  },
  "total_amount": 69.97,
  "tax_amount": 4.80,
  "shipping_amount": 9.99,
  "notes": "Special instructions"
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "uuid-order-id",
    "did": "did:cosmos:stateset:order:uuid",
    "status": "created",
    "amounts": {
      "subtotal": 59.98,
      "tax_amount": 4.80,
      "shipping_amount": 9.99,
      "total_amount": 69.97
    },
    "blockchain": {
      "network": "stateset",
      "settlement_status": "pending"
    }
  }
}
```

### Settle Payment
```bash
POST /api/orders/settle
```

**Request Body:**
```json
{
  "order_id": "uuid-order-id",
  "payment_currency": "USDC",
  "amount": 69.97,
  "customer_address": "stateset1...",
  "mnemonic": "your wallet mnemonic"
}
```

**Response:**
```json
{
  "success": true,
  "settlement": {
    "transaction_hash": "ABC123...",
    "block_height": 12345,
    "settled_at": "2024-01-01T00:00:00Z",
    "payment_currency": "USDC",
    "amount": 69.97
  }
}
```

## Stablecoin Configuration

### Supported Stablecoins

| Symbol | Name | Description | APY | Network |
|--------|------|-------------|-----|---------|
| USDC | USD Coin | Circle USD Coin via Noble | 0% | Noble → Stateset |
| USDT | Tether USD | Tether via Stable Chain | 0% | Stable Chain → Stateset |
| USDY | Ondo USD Yield | Yield-bearing USD backed by Treasuries | 4-5% | Ondo → Stateset |
| SILK | Shade SILK | Privacy-preserving basket-pegged stablecoin | 0% | Secret → Stateset |
| EURe | Monerium EUR | Euro-backed stablecoin | 0% | Monerium → Stateset |

### Technical Details

```javascript
const STABLECOIN_CONFIG = {
  'USDC': {
    denom: 'usdc',
    decimal_places: 6,
    contract_address: 'stateset1usdc...',
    ibc_channel: 'channel-0',
    min_amount: 1000 // 0.001 USDC
  },
  // ... other stablecoins
};
```

## Components

### CreateOrder Component
- **Location**: `components/transactions/CreateOrder.js`
- **Purpose**: Full-featured order creation with multi-step workflow
- **Features**: Product selection, customer details, payment options, confirmation

### BuyNowStablecoin Component
- **Location**: `components/transactions/BuyNowStablecoin.js`
- **Purpose**: Quick purchase for individual products with stablecoin selection
- **Features**: Wallet integration, balance checking, payment processing

### Orders Page
- **Location**: `pages/orders.js`
- **Purpose**: Main e-commerce interface showcasing products and order management
- **Features**: Product catalog, stablecoin stats, order history

## Blockchain Integration

### Cosmos SDK Integration
- **Network**: Stateset (Cosmos SDK based)
- **Consensus**: Tendermint BFT
- **Interoperability**: IBC for cross-chain stablecoin transfers

### Transaction Flow
1. **Order Creation**: Generate order with unique DID
2. **Payment Initiation**: User selects stablecoin and confirms
3. **Balance Check**: Verify sufficient funds in selected stablecoin
4. **Transaction Execution**: Send tokens via CosmJS to merchant address
5. **Settlement Confirmation**: Record transaction hash and update order status
6. **Fulfillment Trigger**: Order moves to fulfillment pipeline

### Gas and Fees
- **Gas Price**: 0.00025 STATE tokens
- **Gas Estimation**: Automatic via CosmJS
- **Network Fees**: Minimal (~$0.01 equivalent)

## Security Considerations

### Wallet Security
- **Mnemonic Storage**: Currently localStorage (consider hardware wallets for production)
- **Private Key Management**: Never expose private keys in client-side code
- **Transaction Signing**: All transactions signed locally

### Smart Contract Security
- **Native Transfers**: Using native Cosmos SDK bank module (no smart contract risk)
- **Atomic Transactions**: Either payment succeeds completely or fails completely
- **No Reentrancy**: Cosmos SDK prevents reentrancy attacks

### Data Validation
- **Server-side Validation**: All order data validated on backend
- **Amount Verification**: Calculated totals must match submitted totals
- **Address Validation**: Bech32 address format validation

## Testing

### Local Development
1. **Start Development Server**: `npm run dev`
2. **Access Orders Page**: Navigate to `http://localhost:3000/orders`
3. **Test Wallet Connection**: Ensure mnemonic is set in localStorage
4. **Mock Stablecoin Balances**: Use testnet tokens for testing

### Network Testing
- **Testnet**: Use Stateset testnet for safe testing
- **Faucet**: Request testnet tokens from faucet
- **Explorer**: View transactions at `https://explorer.stateset.zone`

## Production Deployment

### Environment Configuration
```env
NEXT_PUBLIC_STATESET_RPC=https://rpc.stateset.zone
NEXT_PUBLIC_STATESET_REST=https://rest-api.stateset.zone
NEXT_PUBLIC_MERCHANT_ADDRESS=stateset1na53ljfnfjjjapmxpu6ctd5fgxzvnm66k0pqft
```

### Database Integration
- **Order Storage**: Implement persistent storage for orders
- **Inventory Management**: Track product availability
- **Customer Records**: Store customer information securely

### Monitoring and Analytics
- **Transaction Monitoring**: Track settlement success rates
- **Performance Metrics**: Monitor order completion times
- **Error Tracking**: Log and alert on payment failures

## Future Enhancements

### Additional Stablecoins
- **FRAX**: Fractional-algorithmic stablecoin
- **DAI**: MakerDAO's decentralized stablecoin
- **UST**: Terra's algorithmic stablecoin (if relaunched)

### Advanced Features
- **Subscription Orders**: Recurring payments with stablecoins
- **Multi-currency Pricing**: Display prices in multiple stablecoins
- **Yield Integration**: Automatic yield farming for merchant funds
- **Privacy Features**: Enhanced privacy with zk-proofs

### Merchant Tools
- **Merchant Dashboard**: Comprehensive order and payment management
- **Inventory Sync**: Real-time inventory updates
- **Financial Reporting**: Revenue analytics and tax reporting
- **Refund Processing**: Automated refund workflows

## Support

### Documentation
- **Stateset Docs**: [docs.stateset.io](https://docs.stateset.io)
- **Cosmos SDK**: [cosmos.network](https://cosmos.network)
- **CosmJS**: [cosmos.github.io/cosmjs](https://cosmos.github.io/cosmjs)

### Community
- **Discord**: [Join Stateset Discord](https://discord.gg/YYF2ACHshf)
- **GitHub**: [github.com/stateset](https://github.com/stateset)
- **Twitter**: [@stateset](https://twitter.com/stateset)

### Technical Support
- **Email**: support@stateset.io
- **Issues**: Create issues on GitHub repositories
- **Documentation**: Contribute to docs via pull requests

---

**Built with ❤️ on the Stateset Network - Empowering decentralized commerce with stablecoin settlements**