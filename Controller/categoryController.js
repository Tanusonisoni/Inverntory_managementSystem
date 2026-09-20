import category from "../models/category.js";
import category from "../models/category.js";
import { ApiResponse  } from "../utils/resPattern.js";

export async function registerCategory(req,res,next) {
    try{
        const category=await category.create(req.body);

        return res.status(201).json(new ApiResponse(true,category,"category created successfully"));
    }
    catch(error){
        return res.status(500).json(new ApiResponse(false,null, error.message ||"internal servr error"));
    }
}