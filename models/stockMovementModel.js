import { Schema, model } from "mongoose";

const stockMovementSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product is required"]
        },

        location: {
            type: Schema.Types.ObjectId,
            ref: "Location",
            required: [true, "Location is required"]
        },

        type: {
            type: String,
            enum: ["in", "out"],
            required: [true, "Movement type is required"]
        },

        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [1, "Quantity must be greater than 0"]
        }
    },
    {
        timestamps: true
    }
);

const stockMovementModel = model(
    "StockMovement",
    stockMovementSchema
);

export default stockMovementModel;