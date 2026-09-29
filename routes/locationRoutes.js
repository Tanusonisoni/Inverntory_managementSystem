import Router from "express";
import {createLocation, getAllLocation,getLocationById
    ,updateLocation,deleteLocation
} from "../Controller/locationCantoller.js";
import { getProById } from "../Controller/productController.js";

const router=Router();

router.post("/",createLocation);
router.get("/",getAllLocation);
router.get("/:id",getLocationById)
router.patch("/:id",updateLocation);
router.delete("/:id",deleteLocation);

export default router;