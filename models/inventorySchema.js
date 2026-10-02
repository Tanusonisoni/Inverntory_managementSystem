import { Schema, model } from "mongoose";

const inventorySchema = new Schema(
    {
        product: 
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: [true,"Product is required"]
        },
        location: 
        {
            type: Schema.Types.ObjectId,
            ref: "Location",
            required: [true,"Location is required"]
        },
        quantity: 
        {
            type: Number,
            required: [true,"Quantity is required"],
            min: [0,"Quantity cannot be negative"],
            default: 0
        },
        minStock: 
        {
            type: Number,
            required: [true,"Minimum stock is required"],
            min: [0,"Minimum stock cannot be negative"],
            default: 0
        }
    },
    {
        timestamps: true
    }
);

const inventoryModel = model("Inventory", inventorySchema);

export default inventoryModel;