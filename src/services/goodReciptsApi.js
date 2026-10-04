import { axiosClient } from "./apiClient";
import { Urls } from "./urls";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload) return [];
  return payload.data ?? payload.goodsReceipts ?? payload.items ?? [];
};

export async function getAllGoodsReceipts() {
  try {
    const response = await axiosClient.get(Urls.goodsReceipt);
    return normalizeList(response.data);
  } catch (error) {
    console.error("GOODS RECEIPT API ERROR:", error);
    return [];
  }
}

export async function addGoodsReceipt(data) {
  try {
    const response = await axiosClient.post(Urls.goodsReceipt, data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("ADD GOODS RECEIPT ERROR:", error);
    throw error.response?.data || { message: "Unable to add goods receipt" };
  }
}

export async function updateGoodsReceipt(id, data) {
  try {
    const response = await axiosClient.patch(`${Urls.goodsReceipt}/${id}`, data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("UPDATE GOODS RECEIPT ERROR:", error);
    throw error.response?.data || { message: "Unable to update goods receipt" };
  }
}

export async function deleteGoodsReceipt(id) {
  try {
    const response = await axiosClient.delete(`${Urls.goodsReceipt}/${id}`);
    return response.data?.data ?? response.data ?? { id };
  } catch (error) {
    console.error("DELETE GOODS RECEIPT ERROR:", error);
    throw error.response?.data || { message: "Unable to delete goods receipt" };
  }
}
