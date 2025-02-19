import colors from "colors"
import express from "express"
import dotenv from "dotenv"
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoutes.js';
import ProductRoutes from './routes/productRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from "url"; 
dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
//app.use(express.static(path.join(__dirname, './client/build')));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/products", ProductRoutes);

app.get('/', (req, res) => {
    res.send("<h1>Welcome to the ecommerce app</h1>");
});


/*app.use('*', function(req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
});*/

const PORT = process.env.PORT || 8000;
app.listen(PORT,()=>{
    console.log(`Server Listening on Port ${PORT}`.bgCyan.white);
})
