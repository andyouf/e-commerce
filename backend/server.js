import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
import morgan from 'morgan'
import passport from 'passport'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import subCategoryRoutes from './routes/subCategoryRoutes.js'
// import generationRoutes from './routes/generationRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
connectDB()

const app = express()
app.use(passport.initialize());


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
import './config/passport.js'

app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/models', subCategoryRoutes)
// app.use('/api/generations', generationRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes) 
app.use('/api/carts', cartRoutes) 


const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
)
