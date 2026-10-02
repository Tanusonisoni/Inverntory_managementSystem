import { Schema, model } from "mongoose";

const supplierSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
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

export default model("Supplier", supplierSchema);