import stockMovementModel from "../models/stockMovementModel.js";
import { ApiResponse } from "../utils/resPattern.js";

export async function createStockMovement(req, res, next) {
    try {
        let movement = await stockMovementModel.create(req.body);
        return res.status(201).json(new ApiResponse(true, movement, "stock movement sucessfull"));

    }
    catch (error) {
        return res.status(500).json(new ApiResponse(false, null, error.message || "intenal server error"));
    }
}

export async function getStockMovement(req, res, next) {
    try {
        let page = req.query.page > 0 ? Number(req.query.page) : 1;
        let limit = req.query.limit > 0 && req.query.list <= 100 ? Number(req.query.limit) : 25;
        let skip = (page - 1) * limit;

        let movement = await stockMovementModel.find()
            .populate("product")
            .populate("location")
            .skip(skip)
            .limit(limit)


        return res.status(200).json(new ApiResponse(true, movement, "stock movement fetched sucessfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(false, null, error.message || "inernal server error"));
    }
}

export async function getAllStockMovement(req, res, next) {
    try {
        let page = req.query.page > 0 ? Number(req.query.page) : 1;
        let limit = req.query.limit > 0 && req.query.limit <= 100 ? Number(req.query.limit) : 25;
        let skip = (page - 1) * limit;
        let movement = await stockMovementModel.find()
            .populate("product")
            .populate("location")
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit)

        let total = await stockMovementModel.countDocuments();
        let totalPages = Math.ceil(total / limit);

        return res.status(200).json(new ApiResponse(true, {
            movement,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
            },
        "stock movement fetched sucessfully"
    )
);
}catch (error) {
        return res.status(500).json(
            new ApiResponse(
                false,
                null,
                error.message || "internal server error"
            )
        ); 
}
}