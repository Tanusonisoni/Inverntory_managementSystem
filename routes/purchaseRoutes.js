import express from "express";

import {
    creatPurchase,
    getAllPurchase,
    getSinglePurchase,
    updatePurchase,
    cancelPurchase
} from "../Controller/puchaseController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware,creatPurchase);

router.get("/",authMiddleware, getAllPurchase);

router.get("/:id",authMiddleware, getSinglePurchase);

router.patch("/:id", authMiddleware , allowRoles("admin"),updatePurchase);

router.patch("/:id/cancel", authMiddleware,cancelPurchase);

export default router;