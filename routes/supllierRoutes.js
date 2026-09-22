import {Router} from 'express';
import { registerSupllier,getAllSupllier,updateSupplier, deleteSupllier,getById } from '../Controller/supllierCantroller.js';

const router=Router();

router.post("/supllierReg",registerSupllier);
router.get("/getSupllier",getAllSupllier)
router.patch("/:id", updateSupplier);
router.delete("/deleteSup/:id",deleteSupllier)
router.get("/getsupplier/:id",getById)

export default router