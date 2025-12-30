import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import session from "express-session";
import passport from "passport";

import "./middleware/passport.js"; //import no assigning

import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import googleAuthRoutes from "./routes/google.auth.js";
import uploadRoutes from './routes/upload.route.js';
import productRoutes from './routes/product.route.js';
import categoryRoutes from './routes/category.route.js'
import MpesaRoutes from './routes/mpesa.route.js';
import orderRoutes from './routes/order.route.js'
import chatRoutes from './routes/chat.route.js'
import TrainRoutes from './routes/training.route.js'



const app = express();
const PORT = process.env.PORT || 7000;

const allowedOrigins = [
  "https://killimart.vercel.app",
  "http://localhost:3000",
];

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// Session (required for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// CORS
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use("/api", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/mpesa", MpesaRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api', chatRoutes)
app.use('/api/admin', TrainRoutes)

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
};

startServer();
