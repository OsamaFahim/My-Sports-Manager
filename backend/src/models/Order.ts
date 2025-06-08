import mongoose, { Schema, Document } from 'mongoose';

// Interface for guest user details
interface IGuestUser {
  email: string;
  mobile: string;
  firstName: string;
  lastName: string;
}

// Interface for order items
interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  category: string;
  seller: string;
}

// Interface for billing address
interface IBillingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Interface for payment information
interface IPaymentInfo {
  cardholderName: string;
  cardType: string;
  lastFourDigits: string;
  billingAddress: IBillingAddress;
}

// Main Order interface
export interface IOrder extends Document {
  orderNumber: string;
  // User information - either registered user or guest
  userId?: mongoose.Types.ObjectId; // For registered users
  guestUser?: IGuestUser; // For guest users
  isGuestOrder: boolean;
  
  // Order items
  items: IOrderItem[];
  
  // Order totals
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  
  // Payment information
  paymentInfo: IPaymentInfo;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  
  // Order status
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Guest User Schema
const guestUserSchema = new Schema<IGuestUser>({
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true }
}, { _id: false });

// Order Item Schema
const orderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  productImage: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  category: { type: String, required: true },
  seller: { type: String, required: true }
}, { _id: false });

// Billing Address Schema
const billingAddressSchema = new Schema<IBillingAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: 'United States' }
}, { _id: false });

// Payment Info Schema
const paymentInfoSchema = new Schema<IPaymentInfo>({
  cardholderName: { type: String, required: true },
  cardType: { type: String, required: true },
  lastFourDigits: { type: String, required: true },
  billingAddress: { type: billingAddressSchema, required: true }
}, { _id: false });

// Main Order Schema
const orderSchema = new Schema<IOrder>({
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true,
    default: function() {
      return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
  },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  guestUser: { type: guestUserSchema },
  isGuestOrder: { type: Boolean, required: true, default: false },
  
  items: { type: [orderItemSchema], required: true, validate: [arrayLimit, 'Order must have at least one item'] },
  
  subtotal: { type: Number, required: true, min: 0 },
  shipping: { type: Number, required: true, min: 0 },
  tax: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  
  paymentInfo: { type: paymentInfoSchema, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  },
  
  orderStatus: { 
    type: String, 
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'], 
    default: 'pending' 
  }
}, {
  timestamps: true
});

// Validator function for items array
function arrayLimit(val: IOrderItem[]) {
  return val.length > 0;
}

// Pre-save middleware to ensure either userId or guestUser is provided
orderSchema.pre('save', function(next) {
  if (this.isGuestOrder && !this.guestUser) {
    return next(new Error('Guest user information is required for guest orders'));
  }
  if (!this.isGuestOrder && !this.userId) {
    return next(new Error('User ID is required for registered user orders'));
  }
  next();
});

// Index for faster queries
orderSchema.index({ userId: 1 });
orderSchema.index({ 'guestUser.email': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

export default mongoose.model<IOrder>('Order', orderSchema);
