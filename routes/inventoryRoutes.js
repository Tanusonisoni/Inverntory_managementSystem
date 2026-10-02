import Router from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createInventory,getAllInventory,minStock,
    getInventoryById,stockIn,upateInventory,stockOut } from "../Controller/inventoryController.js";

const router=Router();

router.post("/", authMiddleware, createInventory);

router.get("/", authMiddleware, getAllInventory);

router.patch("/:id", authMiddleware, upateInventory);

router.get("/low-stock", authMiddleware, minStock);

router.get("/:id", authMiddleware, getInventoryById);

router.post("/:id/stock-in", authMiddleware, stockIn);

router.post("/:id/stock-out", authMiddleware, stockOut);


export default router;
