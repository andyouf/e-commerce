import asyncHandler from 'express-async-handler'
import Cart from '../models/cartModel.js'

// @desc    Add cart in case of loggedin user
// @route   POST /api/carts/add
// @access  Private
const addProduct = asyncHandler(async (req, res) => {
  const user = req.user._id
  const products = req.body.products
  const curCart = await Cart.findOne({user: user});
  let addedCart;
  if(curCart) {
    curCart.products.push(products);
    addedCart = await curCart.save();
  } else {
    const cart = new Cart({
      user,
      products
    })
  
    addedCart = await cart.save();
  }
  res.status(201).json(addedCart)
})

// @desc    Get the not-checked cart of the loggedin user
// @route   GET /api/carts/
// @access  Private
const getCarts = asyncHandler(async (req, res) => {
  const user = req.user._id
  const cart = await Cart.find({user: user, checkOut: false}).populate({
    path: 'products',
    populate: {
      path: 'product',
    }
  })
  res.json(cart)
})

// @desc    Get all the history of carts of the loggedin user
// @route   GET /api/carts/all
// @access  Private
const getAllCarts = asyncHandler(async (req, res) => {
  const user = req.user._id
  const carts = await Cart.find({user: user}).populate({
    path: 'products',
    populate: {
      path: 'product',
    }
  })
  res.json(carts)
})

// @desc    Update the cart with Product quantity
// @route   POST /api/carts/update/:productID
// @access  Private
const updateCart = asyncHandler(async (req, res) => {
  const quantity = req.body.quantity
  console.log('called', quantity)
  const productID = req.params.productID
  const query = { user: req.user._id }
  try {
    const curCart = await Cart.findOne(query);
    let id = curCart.products.map(item => item.product).indexOf(productID)
    if(!quantity) {
      curCart.products.splice(id, 1)
    } else {
      curCart.products[id].quantity = quantity
    }
    const filteredCart = await curCart.save();
    res.status(201).json(filteredCart);
  } catch(err) {
    res.status(404)
    throw new Error(err)
  }
})

// @desc    Delete product on the cart
// @route   DELETE /api/carts/update/:productID
// @access  Private
const deleteCart = asyncHandler(async (req, res) => {
  const productID = req.params.productId
  const query = { user: req.user._id }
  try {
    const curCart = await Cart.findOne(query);
    var id = curCart.products.map(item => item.product).indexOf(productID)
    curCart.products.splice(id, 1);
    const filteredCart = await curCart.save();
    res.status(201).json(filteredCart);
  } catch(err) {
    res.status(404)
    throw new Error(err)
  }
})



export {
  addProduct,
  updateCart,
  deleteCart,
  getCarts,
  getAllCarts
}