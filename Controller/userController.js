import { genrateHash } from "../Config/bcrypt.js";
import userModel from "../models/userModel.js";
import { ApiResponse } from "../utils/resPattern.js";

export async function registerUser(req,res,next) {
    try{
        const {email,name,password}=req.body;
        let hash=await genrateHash(password);

        let user=await userModel.create({email,name,password:hash})
        res.status(201).json
        (new ApiResponse(true,user,"success"));
    }
    catch(error)
    {
        res.status(500).json(new ApiResponse(false,null,error.message || "internal server error"));
    }
}
export async function getallUser(req,res,next) {
    try{
        let page=req.query.page > 0 ? req.query.page:1;
        let limit=req.query.limit<=100 ? req.query.limit:25;
        let skip=page===1 ? 0 :(page-1)*limit;

        let users=await userModel.find({role:"user"})
        .skip(skip)
        .limit(limit);
        res.status(200).json(new ApiResponse(true,users,"success"));

    }catch(error)
    {
        res.staus(500).json(new ApiResponse(false,null,"inernal server error" || error.message))
    }
}

export async function updateUser(req,res,next) {
    try{
        // const{name,email,phone,gender,address}=req.body;
        // if(!name || !email || !phone || !gender || !address)
        // {
        //  return res.status(400).json(new ApiResponse(false,null,"all fields are required"));
        // }
        let userStatus=await userModel.findByIdAndUpdate(req.params.id,req.body,{returnDocumnet:"after"});
        if(!userStatus) return res.staus(404).json(new ApiResponse(false,null,"user not found"));

        res.status(200).json(new ApiResponse(true,userStatus,"updated successfully"));
    }catch(error)
    {
        res.status(500).json(new ApiResponse(false,error,"internal server error"));
    }

}
export async function deleteUser(req,res,next)
{
    try{
        let user=await userModel.findByIdAndUpdate(req.user._id,{isDeleted:true},{returnDocument:"after"});
        if(!user) return res.status(404).json(new ApiResponse(false,null,"user not found"));

        res.status(200).json(new ApiResponse(true,user,"user deleted successfully!"));

    }catch(error)
    {
        res.status(500).json(new ApiResponse(false,error.message || "internal server error"));

    }
}

