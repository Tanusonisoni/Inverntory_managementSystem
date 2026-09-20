import {Router} from "express";
import { registerProduct ,getallProduct,getProById,
    updateProduct,deleteProduct
} from "../Controller/productController.js";

const router=Router();

router.post("/registerPro",registerProduct);
router.get("/getproduct",getallProduct);
router.get("/updateProduct/:id",getProById);
router.patch("/updatepro/:id",updateProduct);
router.delete("/deletePro/:id",deleteProduct);



export default router;
