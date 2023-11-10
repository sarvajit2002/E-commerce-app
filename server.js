import colors from "colors"
import express from "express"
import dotenv from "dotenv"
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import ProductRoutes from './routes/productRoutes.js'
import cors from 'cors'
import path from 'path';
dotenv.config();
connectDB();
const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static(path.join(__dirname,'./client/build')))
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1",ProductRoutes)
app.use('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'))
})
app.get('/',(req,res)=>{
    res.send("<h1>Welcome to ecommerce app</h1>")
})

const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>{
    console.log(`Server Listening on Port ${PORT}`.bgCyan.white);
})
