import express from "express";
import { createGoodsReceipt,getAllGoodsReceipts,getSingleGoodsReceipt } from "../Controller/goodsReceiptCantroller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// CREATE GOODS RECEIPT
router.post("/",authMiddleware, createGoodsReceipt);

// GET ALL GOODS RECEIPTS
router.get("/", authMiddleware,getAllGoodsReceipts);

// GET SINGLE GOODS RECEIPT
router.get("/:id",authMiddleware, getSingleGoodsReceipt);

export default router;