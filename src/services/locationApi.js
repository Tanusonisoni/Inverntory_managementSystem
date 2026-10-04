import { axiosClient } from "./apiClient";
import { Urls } from "./urls";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload) return [];
  return payload.data ?? payload.locations ?? payload.items ?? [];
};

export async function getAllLocations() {
  try {
    const response = await axiosClient.get(Urls.locations);
    return normalizeList(response.data);
  } catch (error) {
    console.error("LOCATION API ERROR:", error);
    return [];
  }
}

export async function addLocation(data) {
  try {
    const response = await axiosClient.post(Urls.locations, data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("ADD LOCATION ERROR:", error);
    throw error.response?.data || { message: "Unable to add location" };
  }
}

export async function updateLocation(id, data) {
  try {
    const response = await axiosClient.patch(`${Urls.locations}/${id}`, data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("UPDATE LOCATION ERROR:", error);
    throw error.response?.data || { message: "Unable to update location" };
  }
}

export async function deleteLocation(id) {
  try {
    const response = await axiosClient.delete(`${Urls.locations}/${id}`);
    return response.data?.data ?? response.data ?? { id };
  } catch (error) {
    console.error("DELETE LOCATION ERROR:", error);
    throw error.response?.data || { message: "Unable to delete location" };
  }
}
