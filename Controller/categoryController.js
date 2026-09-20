import categorySchema from "../models/category.js";
import { ApiResponse  } from "../utils/resPattern.js";

export async function registerCategory(req,res,next) {
    try{
        const category=await categorySchema.create(req.body);

        return res.status(201).json(new ApiResponse(true,category,"category created successfully"));
    }
    catch(error){
        return res.status(500).json(new ApiResponse(false,null, error.message ||"internal servr error"));
    }
} 

export async function getAllCategory(req, res, next) {
    try {
        let page = req.query.page > 0 ? Number(req.query.page) : 1;

        let limit = req.query.limit <= 100
            ? Number(req.query.limit)
            : 25;

        let skip = page === 1 ? 0 : (page - 1) * limit;

        let categories = await categorySchema
            .find()
            .skip(skip)
            .limit(limit);

        return res
            .status(200)
            .json(new ApiResponse(true, categories, "success"));

    } catch (error) {
        return res
            .status(500)
            .json(new ApiResponse(false, null, error.message || "internal server error"));
    }
}
export async function updateCategory(req, res, next) {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json(
                new ApiResponse(
                    false,
                    null,
                    "all fields are required"
                )
            );
        }

        let categoryStatus = await categorySchema.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { returnDocument: "after" }
        );

        if (!categoryStatus) {
            return res.status(404).json(
                new ApiResponse(
                    false,
                    null,
                    "category not found"
                )
            );
        }

        return res.status(200).json(
            new ApiResponse(
                true,
                categoryStatus,
                "updated successfully"
            )
        );

    } catch (error) {
        return res.status(500).json(
            new ApiResponse(
                false,
                null,
                error.message || "internal server error"
            )
        );
    }
}

export async function deleteCategory(req,res,next){
    try{
    let category=await categorySchema.findByIdAndDelete(req.params.id);

    if(!category){
        return res.status(404).json(new ApiResponse(false,null,"category not found"));
    }

    return res.status(200).json(new ApiResponse(true,category,"deleted successfully"));
    }
    catch(error)
    {
        res.status(500).json(new ApiResponse(false,null, error.message || "internal server error"))
    }
}