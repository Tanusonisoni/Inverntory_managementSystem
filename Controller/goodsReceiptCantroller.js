import GoodsReceipt from "../models/goodsReciptsModel.js";
import Purchase from "../models/purchaseModel.js";
import Product from "../models/productModel.js";
import { ApiResponse } from "../utils/resPattern.js";


// CREATE GOODS RECEIPT
export async function createGoodsReceipt(req, res, next) {
    try {
        const { purchase, items } = req.body;

        // Check purchase
        const purchaseExists = await Purchase.findById(purchase);

        if (!purchaseExists) {
            return res.status(404).json(
                new ApiResponse(false, null, "purchase not found")
            );
        }

        // Check items
        if (!items || items.length === 0) {
            return res.status(400).json(
                new ApiResponse(false, null, "goods receipt items are required")
            );
        }

        // Check products
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
        }

        // Create goods receipt
        const goodsReceipt = await GoodsReceipt.create({
            purchase,
            items
        });

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