import { ApiResponse } from "../utils/resPattern.js";
import locationModel from "../models/locationModel.js";
import productModel from "../models/productModel.js"
import inventoryModel from "../models/inventorySchema.js";
import stockMovementModel from "../models/stockMovementModel.js";


export async function createInventory(req, res, next) {

    try {

        let product=await productModel.findById(req.body.product);

        if(!product) {
        return res.status(404).json(new ApiResponse(false,null,"prodct is not found"));
        };

        let location=await locationModel.findById(req.body.location);
        if(!location)
        {
         return res.status(404).json(new ApiResponse(false,null,"location is not found"));
        }
        let inventory = await inventoryModel.create(req.body);


        return res.status(201).json(new ApiResponse(true, inventory, "inventory created"));

    } catch (error) {
        return res.status(500).json(new ApiResponse(false, null, error.message || "inernal server error"))
    }
}

export async function getInventoryById(req, res, next) {
    try {
        let inventory = await inventoryModel.findById(req.params.id).populate("product")
        if (!inventory) {
            return res.status(404).json(new ApiResponse(false, null, "inventory not found"))
        }
        return res.status(200).json(new ApiResponse(true, inventory, "successfull"))
    } catch (error) {
        return res.status(500).json(new ApiResponse(false, null, error.message || "internal server error"))
    }
}

export async function upateInventory(req, res, next) {
    try {

        if(req.body.product){
            let product=await productModel.findById(req.body.product);

            if(!product)
            {
                return res.status(404).json(new ApiResponse(false,null,"product is not found"));
            }
        }
        if(req.body.location)
        {
            let location=await locationModel.findById(req.body.location);

            if(!location)
            {
                return res.status(404).json(new ApiResponse(false,null,"location is not found"));out
            }
        }
        let inventory = await inventoryModel.findByIdAndUpdate(req.params.id, req.body, {
            returnDocument: "after",
            runValidators: true
        });
        if (!inventory) {
            return res.status(404).json(new ApiResponse(false, null, "inventory is not found"));
        }
        return res.status(200).json(new ApiResponse(true, inventory, "successfull"))

    } catch (error) {
        return res.status(500).json(new ApiResponse(false, null, error.message || "internal server error"));

    }
}

export async function getAllInventory(req, res, next) {
    try {
        let page = req.query.page > 0 ? Number(req.query.page) : 1;
        let limit = req.query.limit <= 100 ? Number(req.query.limit) : 25;
        let skip = (page - 1) * limit;

        const inventory = await inventoryModel.find()
            .skip(skip)
            .limit(limit)

        return res.status(200).json(new ApiResponse(true, inventory, "supplier fetched successfully"));
    } catch (error) {
        return res.status(500).json
            (new ApiResponse(false, null, error.message || "internal server error"
            ));
    }
}

export async function deleteInventory(req, res, next) {
    try {
        let inventory = await inventoryModel.findByIdAndDelete(req.params.id, { returnDocument: "after" });
        if (!inventory) {
            res.status(404).json(new ApiResponse(false, null, "inventory is not define"))
        }
        res.status(200).json(new ApiResponse(false, null, "deletion sucessfull"))
    }
    catch (error) {
        res.status(500).json(new ApiResponse(false, null, error.message || "internal server error"))
    }
}

export async function stockIn(req, res, next) {
    try {
        let inventory = await inventoryModel.findById(req.params.id);
        if (!inventory) {
            return res.status(404).json(new ApiResponse(false, null, "internal server error"));

        }
        let quantity = Number(req.body.quantity);

        if (!quantity || quantity <= 0) {
            return res.status(400).json(new ApiResponse(false, null, "quantity  must be grater than 0"))
        }
        inventory.quantity += quantity;
        await inventory.save();

        await stockMovementModel.create({
            product: inventory.product,
            location: inventory.location,
            type: "in",
            quantity: sold
        })

        return res.status(200).json(new ApiResponse(true, inventory, "stock updated sucessfully"))

    } catch (error) {
        res.status(500).json(new ApiResponse(false, null, error.message || "internal server error"));
    }
}
export async function stockOut(req, res, next) {
    try {
        // let inventory = await inventoryModel.findById(req.params.id);

        let inventory = await inventoryModel
            .findById(req.params.id)
            // .populate("product")
            // .populate("location");

        console.log("PRODUCT:", inventory.product);
        console.log("LOCATION:", inventory.location);

        if (!inventory) {
            return res.status(404).json(new ApiResponse(false, null, "inventory is not found"));

        }
        let sold = Number(req.body.sold);
        if (!sold || sold <= 0) {
            return res.status(200).json(new ApiResponse(false, null, "sold qua is required"));
        }

        if (sold > inventory.quantity) {
            return res.status(400).json(new ApiResponse(false, null, "insufficient stock"));
        }
        inventory.quantity = inventory.quantity - sold;

        await inventory.save();

        // await stockMovementModel.create({
        //     product: inventory.product,
        //     location: inventory.location,
        //     type: "out",
        //     quantity: sold
        // })

        await inventory.save();

console.log("MOVEMENT DATA:", {
    product: inventory.product,
    location: inventory.location,
    type: "out",
    quantity: sold
});

await stockMovementModel.create({
    product: inventory.product,
    location: inventory.location,
    type: "out",
    quantity: sold
});

        return res.status(200).json(new ApiResponse(true, inventory, "stock out successfully"));

    } catch (error) {
        return res.status(500).json(new ApiResponse(false, null, error.message || "intenal server error"));
    }
}

export async function minStock(req, res, next) {
    try {
        let inventory = await inventoryModel.find({
            $expr: {
                $lte: ["$quantity", "$minStock"]
            }
        }).populate("product");
        return res.status(200).json(
            new ApiResponse(
                true,
                inventory,
                "low stock inventory fetched successfully"
            )
        );
    }
    catch (error) {
        res.status(500).json(new ApiResponse(false, null, error.message || "internal server error"));
    }
}