import express from "express";

import {
    creatPurchase,
    getAllPurchase,
    getSinglePurchase,
    updatePurchase,
    cancelPurchase
} from "../Controller/puchaseController.js";

const router = express.Router();

router.post("/", creatPurchase);

router.get("/", getAllPurchase);

router.get("/:id", getSinglePurchase);

router.patch("/:id", updatePurchase);

router.patch("/:id/cancel", cancelPurchase);

export default router;