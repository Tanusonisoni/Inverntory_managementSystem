import Router from "express";
import { createStockMovement ,getStockMovement,getAllStockMovement} from "../Controller/stockCantroller.js";

const router=Router();

router.post("/",createStockMovement);
router.get("/",getStockMovement);
router.get("/allstock",getAllStockMovement)

export default router;