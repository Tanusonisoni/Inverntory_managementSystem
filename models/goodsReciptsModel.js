import { Schema, model } from "mongoose";

const goodsReceiptSchema = new Schema(
    {
        purchase: {
            type: Schema.Types.ObjectId,
            ref: "Purchase",
            required: true
        },

        location: {
            type: Schema.Types.ObjectId,
            ref: "Location",
            required: true
        },

        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                orderedQuantity: {
                    type: Number,
                    required: true,
                    min: 1
                },

                receivedQuantity: {
                    type: Number,
                    required: true,
                    min: 0
                },

                acceptedQuantity: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ],

        receivedDate: {
            type: Date,
            default: Date.now
        },

        status: {
            type: String,
            enum: ["pending", "received", "cancelled"],
            default: "received"
        }
    },
    {
        timestamps: true
    }
);

export default model("GoodsReceipt", goodsReceiptSchema);