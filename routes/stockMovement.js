import Router from "express";
import { createStockMovement ,getStockMovement,getAllStockMovement} from "../Controller/stockCantroller.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router=Router();

router.post("/",authMiddleware,createStockMovement);
router.get("/",authMiddleware,getStockMovement);
router.get("/allstock",authMiddleware,getAllStockMovement)

export default router;