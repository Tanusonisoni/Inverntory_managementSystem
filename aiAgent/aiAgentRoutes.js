import {Router} from "express";
import { askAI } from "./agent.js";

const router=Router();

router.get("/test",(req,res,next)=>(
    res.json({success:true,
        message:"Ai agent route is working"
    })
))

router.post("/ask",async(req,res)=>{
    try{
        const{message}=req.body;
        const answer=await askAI(message);
        res.json({
            success:true,
            answer
        })
    }catch(error)
    {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
})
export default router;