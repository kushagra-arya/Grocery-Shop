module.exports = {
  // User Roles
  USER_ROLES: {
    ADMIN: 'ADMIN',
    CUSTOMER: 'CUSTOMER',
  },

  // Order Statuses
  ORDER_STATUS: {
    PENDING: 'PENDING',
    CONFIRMED: 'CONFIRMED',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
  },

  // Payment Statuses
  PAYMENT_STATUS: {
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    REFUNDED: 'REFUNDED',
  },

  // Payment Methods
  PAYMENT_METHODS: {
    CARD: 'CARD',
    UPI: 'UPI',
    COD: 'COD',
    WALLET: 'WALLET',
  },

  // Inventory Change Reasons
  INVENTORY_REASONS: {
    RESTOCK: 'RESTOCK',
    SALE: 'SALE',
    ADJUSTMENT: 'ADJUSTMENT',
    DAMAGED: 'DAMAGED',
    RETURNED: 'RETURNED',
  },

  // Pagination Defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 50,
  },

  // Tax Rate (18% GST for example)
  TAX_RATE: 0.18,

  // Shipping
  FREE_SHIPPING_THRESHOLD: 500,
  SHIPPING_CHARGE: 40,
};
