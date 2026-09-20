import express from 'express';
import logger from 'morgan';
import createHttpError from "http-errors";
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoute.js'
import authRoutes from './routes/authRoutes.js'


// Middleware
const app=express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Inventory Management API is running",
  });
});

app.use('/users',userRoutes);
app.use('/auth',authRoutes);
app.use('/product',productRoutes);



export default app;