import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, getCurrentUser } from "../../services/authApi";

const storedToken = localStorage.getItem("token");
const storeUser = localStorage.getItem("user");

const initialState = {
    user: storeUser ? JSON.parse(storeUser) : null,
    token: storedToken || null,
    isAuthenticated: !!storedToken,
    loading: false,
    error: null,
};
export const login = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await loginUser(credentials);

            const token = response?.data?.accessToken || null;
            const user = response?.data || null;

            if (token) {
                localStorage.setItem("token", token);
            }

            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
            }

            return { user, token };
        } catch (error) {
            return rejectWithValue(error?.message || "Login failed");
        }
    }
);

export const fetchCurrentUser = createAsyncThunk(
    "auth/fetchCurrentUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getCurrentUser();
            const user = response?.user || response?.data?.user || response;
            return user;
        } catch (error) {
            return rejectWithValue(error?.message || "Unable to fetch user");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = !!action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
