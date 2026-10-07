import { Schema, model } from "mongoose";

const inventoryBalanceSchema = new Schema(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
            unique: true
        },

        quantity: {
            type: Number,
            default: 0,
            min: 0
        },

        reservedQuantity: {
            type: Number,
            default: 0,
            min: 0
        },

        availableQuantity: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

export default model("InventoryBalance", inventoryBalanceSchema);