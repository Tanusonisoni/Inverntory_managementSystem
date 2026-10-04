import { axiosClient } from "./apiClient";
import { Urls } from "./urls";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload) return [];
  return payload.data ?? payload.movements ?? payload.items ?? [];
};

export async function getAllStockMovements() {
  try {
    const response = await axiosClient.get(Urls.stockMovement);
    return normalizeList(response.data);
  } catch (error) {
    console.error("STOCK MOVEMENT API ERROR:", error);
    return [];
  }
}

export async function addStockMovement(data) {
  try {
    const response = await axiosClient.post(Urls.stockMovement, data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("ADD STOCK MOVEMENT ERROR:", error);
    throw error.response?.data || { message: "Unable to add stock movement" };
  }
}

export async function updateStockMovement(id, data) {
  try {
    const response = await axiosClient.patch(`${Urls.stockMovement}/${id}`, data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("UPDATE STOCK MOVEMENT ERROR:", error);
    throw error.response?.data || { message: "Unable to update stock movement" };
  }
}

export async function deleteStockMovement(id) {
  try {
    const response = await axiosClient.delete(`${Urls.stockMovement}/${id}`);
    return response.data?.data ?? response.data ?? { id };
  } catch (error) {
    console.error("DELETE STOCK MOVEMENT ERROR:", error);
    throw error.response?.data || { message: "Unable to delete stock movement" };
  }
}
