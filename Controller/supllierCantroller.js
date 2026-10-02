import { ApiResponse } from "../utils/resPattern.js";
import supllier from '../models/supllierModel.js'

export async function registerSupllier(req,res,next){
    try
    {
        const supllier=await supplier.create(req.body);

        return res.status(201).json(new ApiResponse(true,supplier,"supplier created successfully"));
    }
    catch(error)
    {
        return res.status(500).json(new ApiResponse(false,null , error.message || "internal server error"));
    }
}

export async function getAllSupllier(req,res,next){
 try{
    let page=req.query.page > 0? Number(req.query.page) : 1;
    let limit = req.query.limit <= 100 ? Number(req.query.limit) : 25;
    let skip=(page-1)*limit;

    const suppliers = await supllier.find()
    .skip(skip)
    .limit(limit)

    return res.status(200).json(new ApiResponse(true,suppliers,"supplier fetched successfully"));
 }catch(error){
    return res.status(500).json
    (new ApiResponse(false,null,error.message|| "internal server error" 
        ));
 }
}

export async function updateSupplier(req, res, next) {
    try {

        const { name, email, phone, gstNumber, address, paymentTerms } = req.body;

        const supplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email,
                phone,
                gstNumber,
                address,
                paymentTerms
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!supplier) {
            return res.status(404).json(
                new ApiResponse(
                    false,
                    null,
                    "supplier not found"
                )
            );
        }

        return res.status(200).json(
            new ApiResponse(
                true,
                supplier,
                "supplier updated successfully"
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

export async function deleteSupllier(req,res,next){
    try {
        const supplier=await supllier.findByIdAndDelete(req.params.id,{returnDocument:"after"});
        if(!supplier){
            return res.status(404).json(new ApiResponse(false,null,"supplier not found"));
        }

        return res.status(200).json(new ApiResponse(true,supplier,"supplier deleted successfully"));

    }catch(error){
        return res.status(500).json(new ApiResponse(false,null, error.message || "inernal server error"));
    }
}

export async function getById(req,res,next){
    try{
        let supplier=await supllier.findById(req.params.id);
        if(!supplier) {
            return res.status(404).json(new ApiResponse(false,null,"supplier is not found"));
        }
        res.status(200).json(new ApiResponse(true,supplier,"get supplier"));

    }catch(error)
    {
        return res.status(500).json(new ApiResonse(false,null,"internal server erorr", error.message))
    }
}