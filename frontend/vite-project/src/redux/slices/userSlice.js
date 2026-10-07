import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUsers, addUser, updateUser, deleteUser, getUserById } from "../../services/userApi";

const normalizeError = (error) =>
    error?.response?.data?.message || error?.data?.message || error?.message || error?.error || "Something went wrong";

export const fetchUsers = createAsyncThunk(
    "user/fetchUsers",
    async (_, { rejectWithValue }) => {
        try {
            const users = await getAllUsers();
            return users || [];
        } catch (error) {
            return rejectWithValue(normalizeError(error));
        }
    }
);

export const createUser = createAsyncThunk(
    "user/createUser",
    async (payload, { rejectWithValue }) => {
        try {
            return await addUser(payload);
        } catch (error) {
            return rejectWithValue(normalizeError(error));
        }
    }
);

export const fetchUserById = createAsyncThunk(
    "user/fetchUserById",
    async (id, { rejectWithValue }) => {
        try {
            return await getUserById(id);
        } catch (error) {
            return rejectWithValue(normalizeError(error));
        }
    }
);

export const editUser = createAsyncThunk(
    "user/editUser",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await updateUser(id, data);
        } catch (error) {
            return rejectWithValue(normalizeError(error));
        }
    }
);

export const removeUser = createAsyncThunk(
    "user/removeUser",
    async (id, { rejectWithValue }) => {
        try {
            await deleteUser(id);
            return id;
        } catch (error) {
            return rejectWithValue(normalizeError(error));
        }
    }
);

const initialState = {
    items: [],
    loading: false,
    error: null,
    selectedUser: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUserError: (state) => {
            state.error = null;
        },
        clearSelectedUser: (state) => {
            state.selectedUser = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload || [];
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload) {
                    state.items.unshift(action.payload);
                }
            })

            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })

            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedUser = action.payload;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(editUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.loading = false;
                const updatedUser = action.payload;
                if (!updatedUser) return;
                const index = state.items.findIndex(
                    (user) => String(user._id || user.id) === String(updatedUser._id || updatedUser.id)
                );
                if (index !== -1) state.items[index] = updatedUser;
                if (String(state.selectedUser?._id) === String(updatedUser._id)) {
                    state.selectedUser = updatedUser;
                }
            })
            .addCase(editUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(removeUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(
                    (user) => String(user._id || user.id) !== String(action.payload)
                );
                if (String(state.selectedUser?._id) === String(action.payload)) {
                    state.selectedUser = null;
                }
            })
            .addCase(removeUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
    },
});

export const { clearUserError, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;
