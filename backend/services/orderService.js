const { Op, Transaction } = require('sequelize');
const { 
  Order, 
  OrderItem, 
  Product, 
  Store, 
  User, 
  Address, 
  Wallet, 
  Transaction: WalletTransaction,
  Stock
} = require('../models/associations');
const { AppError } = require('../middleware/errorHandler');

class OrderService {
  // Create new order
  async createOrder(orderData, userId, transaction = null) {
    try {
      const {
        items,
        billingAddressId,
        shippingAddressId,
        paymentMethod,
        notes,
        couponCode
      } = orderData;

      if (!items || items.length === 0) {
        throw new AppError('Order must contain at least one item', 400);
      }

      // Validate addresses
      const billingAddress = await Address.findByPk(billingAddressId);
      const shippingAddress = await Address.findByPk(shippingAddressId);
      
      if (!billingAddress || billingAddress.userId !== userId) {
        throw new AppError('Invalid billing address', 400);
      }
      
      if (!shippingAddress || shippingAddress.userId !== userId) {
        throw new AppError('Invalid shipping address', 400);
      }

      // Process items and calculate totals
      const processedItems = [];
      let subtotal = 0;
      let totalTax = 0;
      let totalShipping = 0;
      let totalDiscount = 0;

      for (const item of items) {
        const product = await Product.findByPk(item.productId, {
          include: [{ model: Store, as: 'store' }]
        });

        if (!product || !product.isActive || !product.isApproved) {
          throw new AppError(`Product ${item.productId} is not available`, 400);
        }

        // Check stock
        const stock = await Stock.findOne({
          where: {
            productId: item.productId,
            storeId: product.storeId
          }
        });

        if (!stock || stock.availableQuantity < item.quantity) {
          throw new AppError(`Insufficient stock for product ${product.name}`, 400);
        }

        // Calculate item totals
        const itemSubtotal = product.price * item.quantity;
        const itemTax = this.calculateTax(itemSubtotal, product.storeId);
        const itemShipping = this.calculateShipping(product, item.quantity);

        subtotal += itemSubtotal;
        totalTax += itemTax;
        totalShipping += itemShipping;

        processedItems.push({
          product,
          stock,
          quantity: item.quantity,
          unitPrice: product.price,
          subtotal: itemSubtotal,
          tax: itemTax,
          shipping: itemShipping
        });
      }

      // Apply coupon discount if provided
      if (couponCode) {
        totalDiscount = await this.applyCoupon(couponCode, subtotal, userId);
      }

      const total = subtotal + totalTax + totalShipping - totalDiscount;

      // Create order
      const order = await Order.create({
        orderNumber: this.generateOrderNumber(),
        customerId: userId,
        billingAddressId,
        shippingAddressId,
        paymentMethod,
        subtotal,
        taxAmount: totalTax,
        shippingAmount: totalShipping,
        discountAmount: totalDiscount,
        totalAmount: total,
        status: 'pending',
        notes,
        createdAt: new Date()
      }, { transaction });

      // Create order items and update stock
      for (const item of processedItems) {
        await OrderItem.create({
          orderId: order.id,
          productId: item.product.id,
          storeId: item.product.storeId,
          productName: item.product.name,
          productSku: item.product.sku,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.subtotal,
          taxAmount: item.tax,
          finalPrice: item.subtotal + item.tax
        }, { transaction });

        // Update stock
        await item.stock.update({
          quantity: item.stock.quantity - item.quantity,
          reservedQuantity: item.stock.reservedQuantity + item.quantity
        }, { transaction });
      }

      // Update product sold count
      for (const item of processedItems) {
        await item.product.increment('soldCount', { by: item.quantity, transaction });
      }

      return order;
    } catch (error) {
      throw error;
    }
  }

  // Process order payment
  async processPayment(orderId, paymentData, transaction = null) {
    try {
      const order = await Order.findByPk(orderId, {
        include: [{ model: OrderItem, as: 'items' }]
      });

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      if (order.status !== 'pending') {
        throw new AppError('Order cannot be paid', 400);
      }

      // Process payment based on method
      let paymentResult;
      switch (paymentData.method) {
        case 'stripe':
          paymentResult = await this.processStripePayment(paymentData, order);
          break;
        case 'paypal':
          paymentResult = await this.processPayPalPayment(paymentData, order);
          break;
        case 'razorpay':
          paymentResult = await this.processRazorpayPayment(paymentData, order);
          break;
        case 'cod':
          paymentResult = { success: true, transactionId: null };
          break;
        case 'wallet':
          paymentResult = await this.processWalletPayment(order, transaction);
          break;
        default:
          throw new AppError('Unsupported payment method', 400);
      }

      if (paymentResult.success) {
        // Update order status
        await order.update({
          status: 'confirmed',
          paidAt: new Date(),
          paymentStatus: 'paid'
        }, { transaction });

        // Create payment record
        await this.createPaymentRecord(order, paymentData, paymentResult, transaction);

        // Process vendor payouts
        await this.processVendorPayouts(order, transaction);

        // Send notifications
        await this.sendOrderNotifications(order, 'confirmed');
      }

      return paymentResult;
    } catch (error) {
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId, newStatus, userId, notes = null, transaction = null) {
    try {
      const order = await Order.findByPk(orderId, {
        include: [{ model: OrderItem, as: 'items' }]
      });

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      // Validate status transition
      const validTransitions = this.getValidStatusTransitions(order.status);
      if (!validTransitions.includes(newStatus)) {
        throw new AppError(`Invalid status transition from ${order.status} to ${newStatus}`, 400);
      }

      // Update order status
      await order.update({
        status: newStatus,
        updatedAt: new Date()
      }, { transaction });

      // Handle specific status changes
      switch (newStatus) {
        case 'confirmed':
          await this.handleOrderConfirmed(order, transaction);
          break;
        case 'out_for_delivery':
          await this.handleOrderOutForDelivery(order, transaction);
          break;
        case 'delivered':
          await this.handleOrderDelivered(order, transaction);
          break;
        case 'cancelled':
          await this.handleOrderCancelled(order, transaction);
          break;
        case 'returned':
          await this.handleOrderReturned(order, transaction);
          break;
      }

      // Send notifications
      await this.sendOrderNotifications(order, newStatus);

      return order;
    } catch (error) {
      throw error;
    }
  }

  // Calculate tax for a product
  calculateTax(subtotal, storeId) {
    // This would typically involve tax rules and rates
    // For now, return a simple percentage
    const taxRate = 0.08; // 8% tax rate
    return subtotal * taxRate;
  }

  // Calculate shipping for a product
  calculateShipping(product, quantity) {
    // This would typically involve shipping zones and rates
    // For now, return a simple flat rate
    const baseShipping = 5.00;
    const weightShipping = (product.weight || 0) * quantity * 0.5;
    return baseShipping + weightShipping;
  }

  // Apply coupon discount
  async applyCoupon(couponCode, subtotal, userId) {
    // This would involve coupon validation logic
    // For now, return a simple discount
    return subtotal * 0.1; // 10% discount
  }

  // Generate unique order number
  generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  // Process Stripe payment
  async processStripePayment(paymentData, order) {
    // This would involve actual Stripe API integration
    // For now, return success
    return { success: true, transactionId: `stripe_${Date.now()}` };
  }

  // Process PayPal payment
  async processPayPalPayment(paymentData, order) {
    // This would involve actual PayPal API integration
    // For now, return success
    return { success: true, transactionId: `paypal_${Date.now()}` };
  }

  // Process Razorpay payment
  async processRazorpayPayment(paymentData, order) {
    // This would involve actual Razorpay API integration
    // For now, return success
    return { success: true, transactionId: `razorpay_${Date.now()}` };
  }

  // Process wallet payment
  async processWalletPayment(order, transaction) {
    try {
      const customerWallet = await Wallet.findOne({
        where: { userId: order.customerId, type: 'customer' }
      });

      if (!customerWallet || customerWallet.balance < order.totalAmount) {
        throw new AppError('Insufficient wallet balance', 400);
      }

      // Deduct from customer wallet
      await customerWallet.update({
        balance: customerWallet.balance - order.totalAmount
      }, { transaction });

      // Create wallet transaction
      await WalletTransaction.create({
        walletId: customerWallet.id,
        userId: order.customerId,
        type: 'debit',
        amount: order.totalAmount,
        description: `Payment for order ${order.orderNumber}`,
        orderId: order.id,
        status: 'completed'
      }, { transaction });

      return { success: true, transactionId: `wallet_${Date.now()}` };
    } catch (error) {
      throw error;
    }
  }

  // Create payment record
  async createPaymentRecord(order, paymentData, paymentResult, transaction) {
    // This would create a payment record in the payments table
    // Implementation depends on your payment model structure
  }

  // Process vendor payouts
  async processVendorPayouts(order, transaction) {
    try {
      const orderItems = await OrderItem.findAll({
        where: { orderId: order.id },
        include: [{ model: Store, as: 'store' }]
      });

      for (const item of orderItems) {
        const store = item.store;
        const commission = (item.finalPrice * store.commissionRate) / 100;
        const vendorAmount = item.finalPrice - commission;

        // Add to vendor wallet
        const vendorWallet = await Wallet.findOne({
          where: { userId: store.userId, type: 'vendor' }
        });

        if (vendorWallet) {
          await vendorWallet.update({
            balance: vendorWallet.balance + vendorAmount
          }, { transaction });

          // Create wallet transaction
          await WalletTransaction.create({
            walletId: vendorWallet.id,
            userId: store.userId,
            type: 'credit',
            amount: vendorAmount,
            description: `Earnings from order ${order.orderNumber}`,
            orderId: order.id,
            status: 'completed'
          }, { transaction });
        }

        // Add commission to admin wallet
        const adminWallet = await Wallet.findOne({
          where: { type: 'admin' }
        });

        if (adminWallet) {
          await adminWallet.update({
            balance: adminWallet.balance + commission
          }, { transaction });

          // Create wallet transaction
          await WalletTransaction.create({
            walletId: adminWallet.id,
            type: 'credit',
            amount: commission,
            description: `Commission from order ${order.orderNumber}`,
            orderId: order.id,
            status: 'completed'
          }, { transaction });
        }
      }
    } catch (error) {
      throw error;
    }
  }

  // Get valid status transitions
  getValidStatusTransitions(currentStatus) {
    const transitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['processing', 'cancelled'],
      'processing': ['out_for_delivery', 'cancelled'],
      'out_for_delivery': ['delivered', 'failed'],
      'delivered': ['returned'],
      'failed': ['processing'],
      'cancelled': [],
      'returned': []
    };

    return transitions[currentStatus] || [];
  }

  // Handle order confirmed
  async handleOrderConfirmed(order, transaction) {
    // Update inventory and other business logic
    // This would involve updating stock levels, sending notifications, etc.
  }

  // Handle order out for delivery
  async handleOrderOutForDelivery(order, transaction) {
    // Update delivery tracking and other business logic
  }

  // Handle order delivered
  async handleOrderDelivered(order, transaction) {
    // Process delivery completion, update vendor payouts, etc.
    await order.update({ actualDelivery: new Date() }, { transaction });
  }

  // Handle order cancelled
  async handleOrderCancelled(order, transaction) {
    // Restore inventory, process refunds, etc.
    await this.restoreInventory(order, transaction);
  }

  // Handle order returned
  async handleOrderReturned(order, transaction) {
    // Process returns, update inventory, etc.
    await this.processReturn(order, transaction);
  }

  // Restore inventory after cancellation
  async restoreInventory(order, transaction) {
    const orderItems = await OrderItem.findAll({
      where: { orderId: order.id }
    });

    for (const item of orderItems) {
      const stock = await Stock.findOne({
        where: {
          productId: item.productId,
          storeId: item.storeId
        }
      });

      if (stock) {
        await stock.update({
          quantity: stock.quantity + item.quantity,
          reservedQuantity: stock.reservedQuantity - item.quantity
        }, { transaction });
      }
    }
  }

  // Process return
  async processReturn(order, transaction) {
    // This would involve return processing logic
    // Implementation depends on your return model structure
  }

  // Send order notifications
  async sendOrderNotifications(order, status) {
    // This would involve sending email/SMS notifications
    // Implementation depends on your notification system
  }

  // Get order statistics
  async getOrderStatistics(userId, userRole, filters = {}) {
    try {
      const whereClause = {};
      
      if (userRole === 'customer') {
        whereClause.customerId = userId;
      } else if (userRole === 'vendor') {
        // Get orders for vendor's store
        const store = await Store.findOne({ where: { userId } });
        if (store) {
          whereClause.storeId = store.id;
        }
      }

      // Apply date filters
      if (filters.startDate) {
        whereClause.createdAt = { [Op.gte]: new Date(filters.startDate) };
      }
      if (filters.endDate) {
        whereClause.createdAt = { ...whereClause.createdAt, [Op.lte]: new Date(filters.endDate) };
      }

      const orders = await Order.findAll({
        where: whereClause,
        attributes: [
          'status',
          [Order.sequelize.fn('COUNT', Order.sequelize.col('id')), 'count'],
          [Order.sequelize.fn('SUM', Order.sequelize.col('totalAmount')), 'totalAmount']
        ],
        group: ['status']
      });

      return orders;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new OrderService();
