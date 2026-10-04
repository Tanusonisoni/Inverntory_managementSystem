import { axiosClient } from "./apiClient";
import { Urls } from "./urls";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload) return [];
  return payload.data ?? payload.inventory ?? payload.items ?? [];
};

export async function getAllInventory() {
  try {
    const response = await axiosClient.get(Urls.inventory);
    return normalizeList(response.data);
  } catch (error) {
    console.error("INVENTORY API ERROR:", error);
    return [];
  }
}

export async function addInventory(data) {
  try {
    const response = await axiosClient.post(Urls.inventory, data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("ADD INVENTORY ERROR:", error);
    throw error.response?.data || { message: "Unable to add inventory" };
  }
}

export async function updateInventory(id, data) {
  try {
    const response = await axiosClient.patch(`${Urls.inventory}/${id}`, data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("UPDATE INVENTORY ERROR:", error);
    throw error.response?.data || { message: "Unable to update inventory" };
  }
}

export async function deleteInventory(id) {
  try {
    const response = await axiosClient.delete(`${Urls.inventory}/${id}`);
    return response.data?.data ?? response.data ?? { id };
  } catch (error) {
    console.error("DELETE INVENTORY ERROR:", error);
    throw error.response?.data || { message: "Unable to delete inventory" };
  }
}
