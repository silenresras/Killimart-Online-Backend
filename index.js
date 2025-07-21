import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from './db/connectDB.js';
import router from './routes/auth.route.js';
import uploadRoutes from './routes/upload.route.js';
import productRoutes from './routes/product.route.js';
import categoryRoutes from './routes/category.route.js'
import MpesaRoutes from './routes/mpesa.route.js';
import orderRoutes from './routes/order.route.js'




const authRoutes = router
dotenv.config();

const PORT = process.env.PORT || 7000
const app = express()


const allowedOrigins = process.env.CLIENT_URL.split(",");

app.use(cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin); // ← move this line here
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }));
  

//middleware
app.use(express.json())
app.use(cookieParser()) //allows us to parse incoming cookies


//routing  
app.use("/api/auth", authRoutes)
app.use("/api", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/mpesa", MpesaRoutes);
app.use('/api/orders', orderRoutes);




app.listen(PORT, () => {
    connectDB()
    console.log('Server is running on port', PORT)
})
