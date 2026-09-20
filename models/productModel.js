import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    barcode: {
      type: String,
      unique: true,
      sparse: true
    },

    category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true
},

    brand: {
      type: String
    },

    unit: {
      type: String,
      required: true
    },

    purchasePrice: {
      type: Number,
      required: true,
      min: 0
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0
    },

    reorderLevel: {
      type: Number,
      default: 0
    },
  
    isDeleted:{
        type:Boolean,
        default:false
    },
    
    reorderQuantity: {
      type: Number,
      default: 0
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

export default model("Product", productSchema);