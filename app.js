import express from 'express';
import logger from 'morgan';
import createHttpError from "http-errors";
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoute.js'
import authRoutes from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoute.js'
import supllierRoutes from './routes/supllierRoutes.js'
import purchaseRoutes from './routes/purchaseRoutes.js'
import goodsReciptsRoutes from './routes/goodsReciptRoutes.js'
import inventoryRoutes from "./routes/inventoryRoutes.js"

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
app.use('/category',categoryRoutes);
app.use('/supllier',supllierRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/goods-recipt',goodsReciptsRoutes);
app.use('/inventory',inventoryRoutes);




export default app;