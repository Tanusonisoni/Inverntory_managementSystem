import { Router } from "express";
import { registerCategory,getAllCategory,updateCategory,deleteCategory} from "../Controller/categoryController.js";

const router=Router();
router.post("/proCategory",registerCategory)
router.get("/allCategory",getAllCategory)
router.patch("/updateCategory/:id",updateCategory)
router.delete("/deleteCategory/:id",deleteCategory)
 

export default router;