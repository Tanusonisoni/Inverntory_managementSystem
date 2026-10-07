import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllInventory, addInventory, updateInventory, deleteInventory } from "../../services/inventoryApi";

const normalizeError = (error) =>
  error?.response?.data?.message || error?.data?.message || error?.message || error?.error || "Something went wrong";

export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",
  async (_, { rejectWithValue }) => {
    try {
      const inventory = await getAllInventory();
      return inventory || [];
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const createInventory = createAsyncThunk(
  "inventory/createInventory",
  async (payload, { rejectWithValue }) => {
    try {
      return await addInventory(payload);
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const editInventory = createAsyncThunk(
  "inventory/editInventory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateInventory(id, data);
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const removeInventory = createAsyncThunk(
  "inventory/removeInventory",
  async (id, { rejectWithValue }) => {
    try {
      await deleteInventory(id);
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

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    clearInventoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createInventory.fulfilled, (state, action) => {
        if (action.payload) state.items.unshift(action.payload);
      })
      .addCase(editInventory.fulfilled, (state, action) => {
        const item = action.payload;
        if (!item) return;
        const index = state.items.findIndex((entry) => String(entry._id || entry.id) === String(item._id || item.id));
        if (index !== -1) state.items[index] = item;
      })
      .addCase(removeInventory.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => String(item._id || item.id) !== String(action.payload));
      });
  },
});

export const { clearInventoryError } = inventorySlice.actions;
export default inventorySlice.reducer;
