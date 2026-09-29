import Router from "express";
import { createStockMovement } from "../Controller/stockCantroller.js";

const router=Router();

router.post("/",createStockMovement);

export default router;