import { Router } from "express";
import { registerCategory,getAllCategory,updateCategory,deleteCategory} from "../Controller/categoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router=Router();
router.post("/proCategory",authMiddleware,registerCategory)
router.get("/allCategory",authMiddleware,getAllCategory)
router.patch("/updateCategory/:id",authMiddleware,updateCategory)
router.delete("/deleteCategory/:id",authMiddleware,deleteCategory)
 

export default router;