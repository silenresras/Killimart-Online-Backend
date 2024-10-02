import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from './db/connectDB.js';
import router from './routes/auth.route.js';

const authRoutes = router
dotenv.config();

const PORT = process.env.PORT || 7000
const app = express()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

//middleware
app.use(express.json())
app.use(cookieParser()) //allows us to parse incoming cookies


//routing  
app.use("/api/auth", authRoutes)




app.listen(PORT, () => {
    connectDB()
    console.log('Server is running on port', PORT)
})
