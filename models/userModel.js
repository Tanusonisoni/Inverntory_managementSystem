// import {Schema,model}from "mongoose";

import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name:
    {
        type:String,
        required:[true,"user Name is required"],
        trim:true,
        maxLength:[32,"Name length is too long"],
        minLength:[2,"name lengt is too short"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        trim:true,
        unique:true,
        lowerCase:true,
        trim:true,
        
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        minLength:6,

    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user",
    },
    status:{
      type:String,
      enum:["active","inactive","blocked"],
      default:"active",
    },
    phone:{
        type:String,
        trim:true,
        validtae:{
            validator:function(v){
                 return /^(?:\+91|91)?[6-9]\d{9}$/.test(v)
            },
            message:(prop)=>`$(props.value) is not a valid phone number`
        }
    },
    gender:{
        type:String,
        enum:["male","female","other"]
    },
    address:{
       type:String,
       trim:true,
       default:null 
    }
},{timestamps:true});

const userModel= model("User",userSchema);

export default userModel;
