import Router from "express";
import { createInventory,getAllInventory,
    getInventoryById,stockIn,upateInventory,stockOut } from "../Controller/inventoryController.js";

const router=Router();

router.post("/",createInventory)
router.get("/",getAllInventory)
router.patch("/:id",upateInventory)
router.get("/:id",getInventoryById)

router.post("/:id/stock-in",stockIn);
router.post("/:id/stock-out",stockOut)

export default router;
