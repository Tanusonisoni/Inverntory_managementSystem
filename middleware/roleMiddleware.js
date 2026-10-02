import { ApiResponse } from "../utils/resPattern.js";

export default function allowRoles(...roles){
    return function (req,res,next){
        if(roles.includes(req.user.role)){
            return next();
        }
        if (roles.includes(req.user.department)) {
            return next();
        }
         else {
            return res.status(403).json(new ApiResponse(false,null,"Forbidden"))
        }
    }
};