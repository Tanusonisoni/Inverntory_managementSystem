import axios from "axios";

export const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:9000",
    headers: {
        Accept: "*",
        "Content-Type": "application/json"
    }
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")?.trim();

        if (token) {
            const accessToken = token.replace(/^Bearer\s+/i, "");
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginRequest = error.config?.url?.includes("/auth/login");

        if (error.response?.status === 401 && !isLoginRequest && typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            if (window.location.pathname !== "/login") {
                window.location.assign("/login?session=expired");
            }
        }

        return Promise.reject(error);
    }
);