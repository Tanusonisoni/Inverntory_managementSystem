import inventoryModel from "../models/inventorySchema.js";

export async function getLowStockProduct()
{
    const inventory=await inventoryModel.find({$expr:{
        $lte:["$quantity","$minStock"]
    }})
    .populate("product")
    .populate("location")

    console.log("low stock",inventory);

    return inventory;
}