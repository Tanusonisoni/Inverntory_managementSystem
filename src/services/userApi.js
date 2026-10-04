import { axiosClient } from "./apiClient";
import { Urls } from "./urls";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload) return [];
  return payload.data ?? payload.users ?? payload.items ?? [];
};

export async function getAllUsers() {
  try {
    const response = await axiosClient.get(Urls.users);
    return normalizeList(response.data);
  } catch (error) {
    console.error("USER API ERROR:", error);
    return [];
  }
}

export async function addUser(data) {
  try {
    const response = await axiosClient.post(Urls.users, data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("ADD USER ERROR:", error);
    throw error.response?.data || { message: "Unable to add user" };
  }
}

export async function updateUser(id, data) {
  try {
    const response = await axiosClient.patch(`${Urls.users}/${id}`, data);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    throw error.response?.data || { message: "Unable to update user" };
  }
}

export async function deleteUser(id) {
  try {
    const response = await axiosClient.delete(`${Urls.users}/${id}`);
    return response.data?.data ?? response.data ?? { id };
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    throw error.response?.data || { message: "Unable to delete user" };
  }
}
