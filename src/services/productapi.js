import { axiosClient } from "./apiClient";
import { Urls } from "./urls";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload) return [];
  return payload.data ?? payload.products ?? payload.items ?? [];
};

export async function getAllProducts() {
  try {
    const response = await axiosClient.get(Urls.allProducts, {
      params: {
        page: 1,
        limit: 50,
      },
    });
    return normalizeList(response.data);
  } catch (error) {
    console.error("PRODUCT API ERROR:", error);
    return [];
  }
}

export async function getProductById(id) {
  try {
    const response = await axiosClient.get(`${Urls.productById}/${id}`);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("GET PRODUCT BY ID ERROR:", error);
    return null;
  }
}

export async function addProduct(productData) {
  try {
    const response = await axiosClient.post(Urls.registerProduct, productData);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("ADD PRODUCT ERROR:", error);
    throw error.response?.data || { message: "Unable to add product" };
  }
}

export async function updateProduct(id, productData) {
  try {
    const response = await axiosClient.patch(`${Urls.updateProduct}/${id}`, productData);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    throw error.response?.data || { message: "Unable to update product" };
  }
}

export async function deleteProduct(id) {
  try {
    const response = await axiosClient.delete(`${Urls.deleteProduct}/${id}`);
    return response.data?.data ?? response.data ?? { id };
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    throw error.response?.data || { message: "Unable to delete product" };
  }
}
