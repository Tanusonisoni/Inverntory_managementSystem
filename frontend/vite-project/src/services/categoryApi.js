import { axiosClient } from "./apiClient";
import { Urls } from "./urls";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload) return [];
  return payload.data ?? payload.categories ?? payload.items ?? [];
};

export async function getAllCategories() {
  const response = await axiosClient.get(Urls.allCategories);
  return normalizeList(response.data);
}

export async function addCategory(categoryData) {
  try {
    const response = await axiosClient.post(Urls.addCategory, categoryData);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("ADD CATEGORY ERROR:", error);
    throw error.response?.data || { message: "Unable to add category" };
  }
}

export async function updateCategory(id, categoryData) {
  try {
    const response = await axiosClient.patch(`${Urls.updateCategory}/${id}`, categoryData);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);
    throw error.response?.data || { message: "Unable to update category" };
  }
}

export async function deleteCategory(id) {
  try {
    const response = await axiosClient.delete(`${Urls.deleteCategory}/${id}`);
    return response.data?.data ?? response.data ?? { id };
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);
    throw error.response?.data || { message: "Unable to delete category" };
  }
}
