import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import Order from '../models/orderModel.js'

/**
 * the middleware to get the user's info from the token
 */
const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

/**
 * the middleware to get the user's info from the token
 */
const filter = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.user = await User.findById(decoded.id).select('-password')
      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }
})

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * the middleware to check if the user is admin or not
 */
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * the middleware to check if the user is admin or not
 */
const deliver = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
  if(req.user && parseInt(req.user._id, 16) == parseInt(order.user, 16)) {
    console.log('called')
    next()
  } else if(req.user.isAdmin) {
    next()
  } else { 
    res.status(401)
    throw new Error('Not authorized as an admin or user')
  }
})

export { protect, admin, filter, deliver }
