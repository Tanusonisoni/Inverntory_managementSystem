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

export async function approvePurchase(id) {
    try {
        const response = await axiosClient.patch(
            `${Urls.purchases}/${id}`,
            {
                status: "approved"
            }
        );

        return response.data?.data ?? response.data;
    } catch (error) {
        throw error.response?.data || {
            message: "Unable to approve purchase"
        };
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

// export async function updatePurchase(id, data) {
//   try {
//     const response = await axiosClient.patch(`${Urls.purchases}/${id}`, data);
//     return response.data?.data ?? response.data;
//   } catch (error) {
//     console.error("UPDATE PURCHASE ERROR:", error);
//     throw error.response?.data || { message: "Unable to update purchase" };
//   }
// }
export async function cancelPurchase(id) {
  try {
    const response = await axiosClient.patch(
      `${Urls.purchases}/${id}/cancel`
    );
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("CANCEL PURCHASE ERROR:", error);
    throw error.response?.data || { message: "Unable to cancel purchase" };
  }
}


export async function updatePurchase(id, data) {
    try {
        const response = await axiosClient.patch(
            `${Urls.purchases}/${id}`,
           data
        );

        return response.data?.data ?? response.data;
    } catch (error) {
        throw error.response?.data || {
            message: "Unable to update purchase status"
        };
    }
}