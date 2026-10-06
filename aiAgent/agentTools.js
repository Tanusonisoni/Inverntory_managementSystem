

import inventoryModel from "../models/inventorySchema.js";
import productModel from "../models/productModel.js";
import stockMovement from "../models/stockMovementModel.js"

export async function getLowStockProduct() {

    const inventory = await inventoryModel.find({
        $expr: {
            $lte: ["$quantity", "$minStock"]
        }
    });

    console.log("inventory",inventory)
  const result = await Promise.all(
    inventory.map(async (item) => {

        console.log("Inventory Product ID:", item.product);

        const product = await getProById(item.product);

        console.log("Product from inventory:", product);

        return {
            product: product?.name || null,
            sku: product?.sku || null,
            location: item.location,
            quantity: item.quantity,
            minStock: item.minStock
        };
    })
);

console.log("AI low stock data:", result);
    
    return result;
}
export async function getTopStockOutProduct(){
    const result = await stockMovement.aggregate([
        {
            $match:{
                type:"out"
            }
        },
        {
            $group:{
                _id:"$product",
                totalOut:{
                    $sum:"$quantity"
                }
            },
        },
        {
             $sort:{
                totalOut:-1
            }
        },
        {
            $limit:10
        }
    ])
    console.log("top stock out",result);
    return result;
}

export async function getProById(productId){
    const product=await productModel.findById(productId);

    console.log("PRO Data::",product);
    if(!product){
        return null;
    }
    else{
        return {
            id:product._id,
            name:product.name,
            sku:product.sku,
            barcode:product.barcode
        };
    }
}