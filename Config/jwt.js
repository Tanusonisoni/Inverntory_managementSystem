import jwt from 'jsonwebtoken'
import { config } from 'dotenv'

config();

export function genrateToken(data){
    try{
        let token=jwt.sign(data,process.env.TOKEN_SECRET,{expiresIn:"1d"});
      //   console.log(" is this is token-----",token);
        return token;
    }
   catch(error)
   {
    console.log(error);
   }
}

export function verifyToken(token){
 try{
    let tokenData=jwt.verify(token,process.env.TOKEN_SECRET);
    return tokenData;
 }
 catch(error)
 {
    console.log(error);
    return false;
 }
}