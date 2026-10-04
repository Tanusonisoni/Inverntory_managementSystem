import { axiosClient } from "./apiClient";
import { Urls } from "./urls";

export async function loginUser(credentials) {
  try {
    const response = await axiosClient.post(Urls.login, credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed" };
  }
}

export async function getCurrentUser() {
  try {
    const response = await axiosClient.get(Urls.users);
    return response.data?.data ?? response.data?.user ?? response.data ?? [];
  } catch (error) {
    throw error.response?.data || { message: "Unable to fetch current user" };
  }
}
