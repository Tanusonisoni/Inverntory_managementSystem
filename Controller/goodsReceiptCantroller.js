import GoodsReceipt from "../models/goodsReciptsModel.js";
import Purchase from "../models/purchaseModel.js";
import Product from "../models/productModel.js";
import Location from "../models/locationModel.js";
import Inventory from "../models/inventorySchema.js";
import StockMovement from "../models/stockMovementModel.js";
import { ApiResponse } from "../utils/resPattern.js";


// CREATE GOODS RECEIPT
export async function createGoodsReceipt(req, res, next) {
    try {
        const { purchase, location, items } = req.body;

        // Check purchase
        const purchaseExists = await Purchase.findById(purchase);

        if (!purchaseExists) {
            return res.status(404).json(
                new ApiResponse(false, null, "purchase not found")
            );
        }

        if (purchaseExists.status !== "approved") {
            return res.status(400).json(
                new ApiResponse(false, null, "purchase must be approved before receiving goods")
            );
        }

        const locationExists = await Location.findById(location);
        if (!locationExists) {
            return res.status(404).json(new ApiResponse(false, null, "location not found"));
        }

        // Check items
        if (!items || items.length === 0) {
            return res.status(400).json(
                new ApiResponse(false, null, "goods receipt items are required")
            );
        }

        if (new Set(items.map((item) => String(item.product))).size !== items.length) {
            return res.status(400).json(new ApiResponse(false, null, "each product can only appear once per receipt"));
        }

        const previousReceipts = await GoodsReceipt.find({ purchase }).select("items");
        const previouslyAccepted = new Map();
        const previouslyReceived = new Map();
        for (const receipt of previousReceipts) {
            for (const receiptItem of receipt.items) {
                const key = String(receiptItem.product);
                previouslyAccepted.set(key, (previouslyAccepted.get(key) || 0) + Number(receiptItem.acceptedQuantity));
                previouslyReceived.set(key, (previouslyReceived.get(key) || 0) + Number(receiptItem.receivedQuantity));
            }
        }

        // Check products
        const productsById = new Map();
        for (const item of items) {

            const productExists = await Product.findById(item.product);

            if (!productExists) {
                return res.status(404).json(
                    new ApiResponse(
                        false,
                        null,
                        `product not found: ${item.product}`
                    )
                );
            }
            productsById.set(String(item.product), productExists);

            const orderedItem = purchaseExists.items.find(
                (purchaseItem) => String(purchaseItem.product) === String(item.product)
            );
            const receivedQuantity = Number(item.receivedQuantity);
            const acceptedQuantity = Number(item.acceptedQuantity);
            const orderedQuantity = Number(item.orderedQuantity);
            const alreadyReceived = previouslyReceived.get(String(item.product)) || 0;

            if (!orderedItem || !Number.isFinite(receivedQuantity) || !Number.isFinite(acceptedQuantity)
                || !Number.isFinite(orderedQuantity) || receivedQuantity < 0
                || acceptedQuantity < 0 || acceptedQuantity > receivedQuantity
                || orderedQuantity !== Number(orderedItem.quantity)
                || alreadyReceived + receivedQuantity > Number(orderedItem.quantity)) {
                return res.status(400).json(
                    new ApiResponse(false, null, "goods receipt quantities are invalid")
                );
            }
        }

        // Persist the receipt and apply accepted stock to the selected location.
        const goodsReceipt = await GoodsReceipt.create({
            purchase,
            location,
            items
        });

        for (const item of items) {
            const acceptedQuantity = Number(item.acceptedQuantity);
            if (acceptedQuantity <= 0) continue;

            const inventory = await Inventory.findOneAndUpdate(
                { product: item.product, location },
                { $inc: { quantity: acceptedQuantity } },
                { new: true }
            );

            const updatedInventory = inventory || await Inventory.create({
                product: item.product,
                location,
                quantity: acceptedQuantity,
                minStock: Number(productsById.get(String(item.product))?.reorderLevel || 0)
            });

            await StockMovement.create({
                product: item.product,
                location,
                type: "in",
                quantity: acceptedQuantity
            });

            if (updatedInventory.quantity < 0) {
                throw new Error("inventory quantity cannot be negative");
            }
        }

        const acceptedByProduct = new Map(previouslyAccepted);
        for (const item of items) {
            const key = String(item.product);
            acceptedByProduct.set(key, (acceptedByProduct.get(key) || 0) + Number(item.acceptedQuantity));
        }
        const fullyReceived = purchaseExists.items.every(
            (item) => (acceptedByProduct.get(String(item.product)) || 0) >= Number(item.quantity)
        );
        if (fullyReceived) {
            purchaseExists.status = "received";
            await purchaseExists.save();
        }

        return res.status(201).json(
            new ApiResponse(
                true,
                goodsReceipt,
                "goods receipt created successfully"
            )
        );

    } catch (error) {
        return res.status(500).json(
            new ApiResponse(
                false,
                null,
                error.message || "internal server error"
            )
        );
    }
}


// GET ALL GOODS RECEIPTS
export async function getAllGoodsReceipts(req, res, next) {
    try {

        const goodsReceipts = await GoodsReceipt.find()
            .populate("purchase")
            .populate("location")
            .populate("items.product");

        return res.status(200).json(
            new ApiResponse(
                true,
                goodsReceipts,
                "goods receipts fetched successfully"
            )
        );

    } catch (error) {
        return res.status(500).json(
            new ApiResponse(
                false,
                null,
                error.message || "internal server error"
            )
        );
    }
}


// GET SINGLE GOODS RECEIPT
export async function getSingleGoodsReceipt(req, res, next) {
    try {

        const goodsReceipt = await GoodsReceipt.findById(req.params.id)
            .populate("purchase")
            .populate("location")
            .populate("items.product");

        if (!goodsReceipt) {
            return res.status(404).json(
                new ApiResponse(false, null, "goods receipt not found")
            );
        }

        return res.status(200).json(
            new ApiResponse(
                true,
                goodsReceipt,
                "goods receipt fetched successfully"
            )
        );

    } catch (error) {
        return res.status(500).json(
            new ApiResponse(
                false,
                null,
                error.message || "internal server error"
            )
        );
    }
}