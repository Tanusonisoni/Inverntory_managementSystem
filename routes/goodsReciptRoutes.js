import express from "express";
import { createGoodsReceipt,getAllGoodsReceipts,getSingleGoodsReceipt } from "../Controller/goodsReceiptCantroller.js";

const router = express.Router();


// CREATE GOODS RECEIPT
router.post("/", createGoodsReceipt);

// GET ALL GOODS RECEIPTS
router.get("/", getAllGoodsReceipts);

// GET SINGLE GOODS RECEIPT
router.get("/:id", getSingleGoodsReceipt);

export default router;