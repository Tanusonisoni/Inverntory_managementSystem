import { Schema, model } from "mongoose";

const purchaseSchema = new Schema(
    {
        supplier: {
            type: Schema.Types.ObjectId,
            ref: "Supplier",
            required: true
        },

        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },

                purchasePrice: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ],

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "received",
                "cancelled"
            ],
            default: "pending"
        },

        orderDate: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

export default model("Purchase", purchaseSchema);