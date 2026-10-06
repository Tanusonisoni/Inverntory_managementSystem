import Supplier from "../models/supllierModel.js";
import Purchase from "../models/purchaseModel.js";
import Product from "../models/productModel.js";
import { ApiResponse } from "../utils/resPattern.js";

// CREATE PURCHASE
export async function creatPurchase(req, res, next) {
    try {
        const { supplier, items } = req.body;

        const supplierExists = await Supplier.findById(supplier);

        if (!supplierExists) {
            return res.status(404).json(
                new ApiResponse(false, null, "supplier not found")
            );
        }

        if (!items || items.length === 0) {
            return res.status(400).json(
                new ApiResponse(false, null, "purchase items are required")
            );
        }

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

        const purchase = await Purchase.create({
            supplier,
            items
        });

        return res.status(201).json(
            new ApiResponse(
                true,
                purchase,
                "purchase created successfully"
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


// GET ALL PURCHASE
export async function getAllPurchase(req, res, next) {
    try {
        const purchases = await Purchase.find()
            .populate("supplier")
            .populate("items.product");

        return res.status(200).json(
            new ApiResponse(
                true,
                purchases,
                "purchases fetched successfully"
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


// GET SINGLE PURCHASE
export async function getSinglePurchase(req, res, next) {
    try {
        const purchase = await Purchase.findById(req.params.id)
            .populate("supplier")
            .populate("items.product");

        if (!purchase) {
            return res.status(404).json(
                new ApiResponse(false, null, "purchase not found")
            );
        }

        return res.status(200).json(
            new ApiResponse(
                true,
                purchase,
                "purchase fetched successfully"
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


// UPDATE PURCHASE
export async function updatePurchase(req, res, next) {
    try {
        const { supplier, items,status } = req.body;

        const purchase = await Purchase.findByIdAndUpdate(
            req.params.id,
            {
                supplier,
                items,
                status
            },
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        if (!purchase) {
            return res.status(404).json(
                new ApiResponse(false, null, "purchase not found")
            );
        }

        return res.status(200).json(
            new ApiResponse(
                true,
                purchase,
                "purchase updated successfully"
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


// CANCEL PURCHASE
export async function cancelPurchase(req, res, next) {
    try {
        const purchase = await Purchase.findByIdAndUpdate(
            req.params.id,
            {
                status: "cancelled"
            },
            {
                returnDocument: "after"
            }
        );

        if (!purchase) {
            return res.status(404).json(
                new ApiResponse(false, null, "purchase not found")
            );
        }

        return res.status(200).json(
            new ApiResponse(
                true,
                purchase,
                "purchase cancelled successfully"
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