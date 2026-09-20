import {verifyToken} from "../Config/jwt.js";
import userModel from "../models/userModel.js";
import { ApiResponse } from "../utils/resPattern.js";

export default async function authMiddleware(req,res,next)
{
    try{
        const token=req.headers.authorization?.split(" ")[1];
        if(!token)
        {
            return res.status(401).json(new ApiResponse(false,null,unauthorized))
        }
        let tokenData=verifyToken(token);

        if(!tokenData) return res.status(401).json(new ApiResponse(false,null,"unautharized or invalud token"));

        let user=await userModel.findOne({_id:tokenData.id,role:tokenData.role,isDeleted:false});
        if(!user)
        {
            return res.status(404).json(new ApiResponse(false,null,"user not found"));

        }
      user =user.toObject();

      delete user.password;
      delete user.isDeleted;
      delete user.__v;

      req.user=user;
      next();
      
    }catch(error)
    {
        console.log('Error in authmiddleWare:',error);
        return res.status(500).json(new ApiResponse(false,null,"inernal server error"));
    }
}