import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllStockMovements, addStockMovement, updateStockMovement, deleteStockMovement } from "../../services/stockMovementApi";

const normalizeError = (error) =>
  error?.message || error?.error || error?.data?.message || "Something went wrong";

export const fetchStockMovements = createAsyncThunk(
  "stockMovement/fetchStockMovements",
  async (_, { rejectWithValue }) => {
    try {
      const movements = await getAllStockMovements();
      return movements || [];
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const createStockMovement = createAsyncThunk(
  "stockMovement/createStockMovement",
  async (payload, { rejectWithValue }) => {
    try {
      return await addStockMovement(payload);
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const editStockMovement = createAsyncThunk(
  "stockMovement/editStockMovement",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateStockMovement(id, data);
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const removeStockMovement = createAsyncThunk(
  "stockMovement/removeStockMovement",
  async (id, { rejectWithValue }) => {
    try {
      await deleteStockMovement(id);
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

const stockMovementSlice = createSlice({
  name: "stockMovement",
  initialState,
  reducers: {
    clearStockMovementError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStockMovements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStockMovements.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchStockMovements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearStockMovementError } = stockMovementSlice.actions;
export default stockMovementSlice.reducer;
