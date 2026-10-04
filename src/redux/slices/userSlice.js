import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUsers, addUser, updateUser, deleteUser } from "../../services/userApi";

const normalizeError = (error) =>
  error?.message || error?.error || error?.data?.message || "Something went wrong";

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
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
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
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
