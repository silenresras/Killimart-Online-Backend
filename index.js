import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import { connectDB } from './db/connectDB.js';
import router from './routes/auth.route.js';

const authRoutes = router
dotenv.config();

const PORT = process.env.PORT || 7000
const app = express()
const __dirname = path.resolve()

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))

//middleware
app.use(express.json())
app.use(cookieParser()) //allows us to parse incoming cookies


//routing  
app.use("/api/auth", authRoutes)


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
    });
}




app.listen(PORT, () => {
    connectDB()
    console.log('Server is running on port', PORT)
})
