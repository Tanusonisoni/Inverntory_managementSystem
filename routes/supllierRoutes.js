import {Router} from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import allowRoles from '../middleware/roleMiddleware.js';
import { registerSupllier,getAllSupllier,updateSupplier, deleteSupllier,getById } from '../Controller/supllierCantroller.js';

const router=Router();

router.post("/supllierReg",authMiddleware,allowRoles("admin"),registerSupllier);
router.get("/getSupllier",getAllSupllier)
router.patch("/:id",authMiddleware,allowRoles("admin"), updateSupplier);
router.delete("/deleteSup/:id",authMiddleware,allowRoles("admin"),deleteSupllier)
router.get("/getsupplier/:id",getById)

export default router