import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const {
      customer_address,
      items,
      payment_method,
      payment_currency,
      shipping_address,
      billing_address,
      total_amount,
      tax_amount,
      shipping_amount,
      discount_amount,
      notes
    } = req.body;

    // Validate required fields
    if (!customer_address || !items || !payment_method || !total_amount) {
      return res.status(400).json({ 
        message: 'Missing required fields: customer_address, items, payment_method, total_amount' 
      });
    }

    // Validate payment currency (support for stablecoins)
    const supportedCurrencies = ['STATE', 'USDC', 'USDT', 'USDY', 'SILK', 'EURe'];
    if (!supportedCurrencies.includes(payment_currency)) {
      return res.status(400).json({ 
        message: `Unsupported payment currency. Supported: ${supportedCurrencies.join(', ')}` 
      });
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const calculated_total = subtotal + (tax_amount || 0) + (shipping_amount || 0) - (discount_amount || 0);

    // Validate total amount
    if (Math.abs(calculated_total - total_amount) > 0.01) {
      return res.status(400).json({ 
        message: 'Total amount does not match calculated total' 
      });
    }

    // Generate order ID and DID
    const order_id = uuidv4();
    const order_did = `did:cosmos:stateset:order:${order_id}`;

    // Create order object
    const order = {
      id: order_id,
      did: order_did,
      customer_address,
      items: items.map(item => ({
        id: item.id || uuidv4(),
        name: item.name,
        description: item.description || '',
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
        metadata: item.metadata || {}
      })),
      payment: {
        method: payment_method,
        currency: payment_currency,
        status: 'pending',
        transaction_hash: null,
        gateway: payment_method === 'crypto' ? 'stateset' : payment_method
      },
      amounts: {
        subtotal,
        tax_amount: tax_amount || 0,
        shipping_amount: shipping_amount || 0,
        discount_amount: discount_amount || 0,
        total_amount
      },
      addresses: {
        shipping: shipping_address,
        billing: billing_address || shipping_address
      },
      status: 'created',
      fulfillment_status: 'unfulfilled',
      notes: notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      blockchain: {
        network: 'stateset',
        block_height: null,
        transaction_hash: null,
        settlement_status: 'pending'
      }
    };

    // TODO: Save to database/blockchain
    // For now, we'll return the order object
    // In production, this would be saved to a database and/or the Stateset blockchain

    res.status(201).json({
      success: true,
      order,
      message: 'Order created successfully',
      next_steps: {
        payment_required: true,
        payment_deadline: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        supported_stablecoins: supportedCurrencies.filter(c => c !== 'STATE')
      }
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}