import { axiosClient } from "./apiClient";
import { Urls } from "./urls";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload) return [];
  return payload.data ?? payload.purchases ?? payload.items ?? [];
};

export async function getAllPurchases() {
  try {
    const response = await axiosClient.get(Urls.purchases);
    return normalizeList(response.data);
  } catch (error) {
    console.error("PURCHASE API ERROR:", error);
    return [];
  }
}

export async function addPurchase(data) {
  try {
    const response = await axiosClient.post(Urls.purchases, data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("ADD PURCHASE ERROR:", error);
    throw error.response?.data || { message: "Unable to add purchase" };
  }
}

export async function updatePurchase(id, data) {
  try {
    const response = await axiosClient.patch(`${Urls.purchases}/${id}`, data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("UPDATE PURCHASE ERROR:", error);
    throw error.response?.data || { message: "Unable to update purchase" };
  }
}

export async function deletePurchase(id) {
  try {
    const response = await axiosClient.delete(`${Urls.purchases}/${id}`);
    return response.data?.data ?? response.data ?? { id };
  } catch (error) {
    console.error("DELETE PURCHASE ERROR:", error);
    throw error.response?.data || { message: "Unable to delete purchase" };
  }
}
