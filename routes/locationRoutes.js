import Router from "express";
import {createLocation, getAllLocation,getLocationById
    ,updateLocation,deleteLocation
} from "../Controller/locationCantoller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { getProById } from "../Controller/productController.js";

const router=Router();

router.post("/",authMiddleware,createLocation);
router.get("/",authMiddleware,getAllLocation);
router.get("/:id",authMiddleware,getLocationById)
router.patch("/:id",authMiddleware,updateLocation);
router.delete("/:id",authMiddleware,deleteLocation);

export default router;