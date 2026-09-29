import stockMovementModel from "../models/stockMovementModel.js";
import { ApiResponse } from "../utils/resPattern.js";

export async function createStockMovement(req,res,next)
{
    try{
        let movement=await stockMovementModel.create(req.body);
        return res.status(201).json(new ApiResponse(true,movement,"stock movement sucessfull"));

    }
    catch(error)
    {
        return res.status(500).json(new ApiResponse(false,null,error.message || "intenal server error"));
    }
}