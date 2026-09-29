import locationModel from "../models/locationModel.js";
import { ApiResponse } from "../utils/resPattern.js";

export async function createLocation(req, res, next) {
    try {
        const location = await locationModel.create(req.body);
        if (!location) {
            return res.status(404).json(new ApiResponse(false, null, "location is required"));
        }

        return res.status(200).json(new ApiResponse(true, location, "location sucessfully created"))
    }
    catch (error) {
        return res.status(500).json(new ApiResponse(false, null, error.message || "internal server error"));
    }
}

export async function getAllLocation(req, res, next) {
    try {
        let location = await locationModel.find();

        if (!location) {
            return res.status(404).json(new ApiResponse(false, null, "location not found"))
        }
        return res.status(200).json(new ApiResponse(true, location, "successfull"))
    }
    catch (error) {
        return res.status(500).json(new ApiResponse(false, null, error.message || "internal server error"));
    }
}

export async function getLocationById(req, res, next) {
    try {
        let location = await locationModel.findById(req.params.id);

        if (!location) {
            return res.status(404).json(
                new ApiResponse(false, null, "location is not define")
            );
        }

        return res.status(200).json(
            new ApiResponse(
                true,
                location,
                "location fetched successfully"
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

export async function updateLocation(req, res, next) {
    try {
        let location = await locationModel.findByIdAndUpdate(req.params.id, req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        )
        if (!location) {
            return res.status(404).json(new ApiResponse(false, null, "location is not found"));

        }
        return res.status(200).json(new ApiResponse(true, location, "data update successfully"));
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

export async function deleteLocation(req, res, next) {
    try {
        let location = await locationModel.findByIdAndDelete(req.params.id);
        if (!location) {
            return res.status(404).json(new ApiResponse(false, null, "location is not define"))
        }
        return res.status(200).json(new ApiResponse(true, location, "deleted sucessfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(false, null, error.message || "internal server error"));
    }
}