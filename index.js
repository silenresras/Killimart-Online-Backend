import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

import { connectDB } from './db/connectDB.js';
import router from './routes/auth.route.js';
import uploadRoutes from './routes/upload.route.js';
import productRoutes from './routes/product.route.js';
import categoryRoutes from './routes/category.route.js'
import MpesaRoutes from './routes/mpesa.route.js';
import orderRoutes from './routes/order.route.js'
import chatRoutes from './routes/chat.route.js'
import TrainRoutes from './routes/training.route.js'

const authRoutes = router
dotenv.config();

const PORT = process.env.PORT || 7000
const app = express()


const allowedOrigins = [
  'https://killimart.vercel.app', // Your deployed frontend
  'http://localhost:3000',        // Local development
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);



//middleware
app.use(express.json())
app.use(cookieParser())
app.use(helmet());


//routing  
app.use("/api/auth", authRoutes)
app.use("/api", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/mpesa", MpesaRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', chatRoutes)
app.use('/api/admin', TrainRoutes)




const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    });
  } catch (error) {
    console.error("Failed to connect to DB", error)
  }
}

startServer()

