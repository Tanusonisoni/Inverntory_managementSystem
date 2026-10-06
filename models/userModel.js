import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please enter a valid email address"
            ]
        },

        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        },

        department: {
            type: String,
            enum: ['purchase', 'inventory', 'sales'],
            default: 'inventory'
        },

        password:{
            type:String,
            required:true,
            minLength:6

        },
        gender:{
            type:String,
            enum:["male","female","other"],
            required:true
        },

        phone: {
            type: String,
            required: true,
            trim: true,

            validate: {
                validator: function (v) {
                    return /^(?:\+91|91)?[6-9]\d{9}$/.test(v);
                },
                message: (props) =>
                    `${props.value} is not a valid phone number`
            }
        },

        gstNumber: {
            type: String,
            trim: true
        },

        address: {
            type: String,
            trim: true
        },

        paymentTerms: {
            type: String,
            trim: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export default model("user", userSchema);