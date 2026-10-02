import { Schema, model } from "mongoose";

const locationSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Location name is required"],
            trim: true,
            minLength: [2, "Location name is too short"],
            maxLength: [50, "Location name is too long"],
            unique: true
        },

        address: {
            type: String,
            required: [true, "Address is required"],
            trim: true,
            minLength: [5, "Address is too short"],
            maxLength: [200, "Address is too long"]
        },

        description: {
            type: String,
            trim: true,
            maxLength: [300, "Description is too long"]
        }
    },
    {
        timestamps: true
    }
);

const locationModel = model("Location", locationSchema);

export default locationModel;