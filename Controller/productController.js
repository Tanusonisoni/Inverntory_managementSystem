import Product from "../models/productModel.js";
import categoryModel from "../models/category.js"
import { ApiResponse } from "../utils/resPattern.js";

export async function registerProduct(req,res,next){
    try{

        const {category}=req.body;

        const categoryExist=await categoryModel.findById(category);

         if (!categoryExist) {
            return res.status(404).json(
                new ApiResponse(false, null, "category not found")
            );
        }


        const product =await Product.create(req.body);

        return res.status(201).json(new ApiResponse(true,product,"product created successfully"))
    }
    catch(error)
    {
        res.status(500).json(new ApiResponse(false,null,error.message || "internal server error"));
    }
}

export async function getProductByCategory(req,res,next){
    try{
        const {categoryId}=req.params;
        const product=await Product.find({
            category:categoryId
        }).populate("category");

        return res.status(200).json(new ApiResponse(true,product,"product fetched sucessfully"));
    }
    catch(error){
        return res.status(500).json(new ApiResponse(false,null,error.message || "internal server erro"))
    }
}

export async function getallProduct(req,res,next)
{
    try{
        let page=req.query.page > 0 ? req.query.page:1;
    let limit=req.query.limit <= 100 ?req.query.limit:25;
    let skip=page===1 ? 0: (page-1)*limit;

    let product=await Product.find()
    .populate("category")
    .skip(skip)
    .limit(limit)

    res.status(200).json(new ApiResponse(true,product,"sucess"));
    
    }
    catch(error)
    {
        res.status(500).json(new ApiResponse(false,null,error.message || "internal server error"));

    }
}

export async function getProById(req,res,next) {
    try{
        let product=await Product.findById(req.params.id);
        if(!product)
        {
            return res.status(404).json(new ApiResponse(false,null,"product not found"));
        }
        res.status(200).json(new ApiResponse(true ,product , "success"))
    }catch(error)
    {
        res.status(500).json(new ApiResponse(false , null,error.message || "internal server error"));
    }
}

export async function updateProduct(req,res,next) {
    try{
        let product=await Product.findByIdAndUpdate(req.params.id,
            req.body,{
                new:true,
                runValidators:true
            }
        );
        if(!product){
            return res.status(404).json(new ApiResponse(false , null ," product not found"))
        }
        return res.status(200).json(new ApiResponse(true,product,"product update successfully"));
    }catch(error){
        res.status(500).json(new ApiResponse(false,null,error.message || "internal server error"))
    }
}

export async function deleteProduct(req, res, next) {
    try {
        let product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json(
                new ApiResponse(false, null, "product not found")
            );
        }

        return res.status(200).json(
            new ApiResponse(true, product, "product deleted successfully")
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