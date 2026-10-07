import { axiosClient } from "./apiClient";
import { Urls } from "./urls";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload) return [];
  return payload.data ?? payload.suppliers ?? payload.items ?? [];
};

export async function getAllSuppliers() {
  const response = await axiosClient.get(Urls.supplier, { params: { page: 1, limit: 100 } });
  return normalizeList(response.data);
}

export async function addSupplier(data) {
  try {
    const response = await axiosClient.post(Urls.addSupplier || Urls.supplier || "/supplier", data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("ADD SUPPLIER ERROR:", error);
    throw error.response?.data || { message: "Unable to add supplier" };
  }
}

export async function updateSupplier(id, data) {
  try {
    const response = await axiosClient.patch(`${Urls.updateSupplier}/${id}`, data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("UPDATE SUPPLIER ERROR:", error);
    throw error.response?.data || { message: "Unable to update supplier" };
  }
}

export async function deleteSupplier(id) {
  try {
    const response = await axiosClient.delete(`${Urls.deleteSupplier || Urls.supplier || "/supplier"}/${id}`);
    return response.data?.data ?? response.data ?? { id };
  } catch (error) {
    console.error("DELETE SUPPLIER ERROR:", error);
    throw error.response?.data || { message: "Unable to delete supplier" };
  }
}
