import express from "express";
import { authCantroller } from "../Controller/authController.js";

const router=express.Router();

router.post("/login",authCantroller);

export default router;
