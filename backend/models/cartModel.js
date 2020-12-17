import mongoose from 'mongoose';

const CartItemSchema = mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: Number,
  totalPrice: {
    type: Number
  },
  priceWithTax: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: 'Not processed',
    enum: ['Not processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
  }
})


// Cart Schema
const CartSchema = mongoose.Schema({
  products: [CartItemSchema],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
  checkOut: {
    type: Boolean,
    default: false
  }
})

const Cart = mongoose.model('Cart', CartSchema)
export default Cart
