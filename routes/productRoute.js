import {Router} from "express";
import { registerProduct ,getallProduct,getProById,
    updateProduct,deleteProduct,getProductByCategory,
    getProductQR
} from "../Controller/productController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
const router=Router();

router.post("/registerPro", authMiddleware,allowRoles("inventory"), registerProduct);

router.get("/getproduct", authMiddleware, getallProduct);

router.get("/qr/:id", authMiddleware, getProductQR);

router.get("/updateProduct/:id", authMiddleware,allowRoles("inventory"), getProById);

router.patch("/updatepro/:id", allowRoles("inventory"),updateProduct);

router.delete("/deletePro/:id", authMiddleware, allowRoles("inventory"),deleteProduct);

router.get("/proCategory", authMiddleware,allowRoles("inventory"), getProductByCategory);

export default router;
