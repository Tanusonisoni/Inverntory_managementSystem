import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllPurchases, addPurchase, updatePurchase, deletePurchase } from "../../services/purchaseApi";

const normalizeError = (error) =>
  error?.message || error?.error || error?.data?.message || "Something went wrong";

export const fetchPurchases = createAsyncThunk(
  "purchase/fetchPurchases",
  async (_, { rejectWithValue }) => {
    try {
      const purchases = await getAllPurchases();
      return purchases || [];
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const createPurchase = createAsyncThunk(
  "purchase/createPurchase",
  async (payload, { rejectWithValue }) => {
    try {
      return await addPurchase(payload);
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const editPurchase = createAsyncThunk(
  "purchase/editPurchase",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updatePurchase(id, data);
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const removePurchase = createAsyncThunk(
  "purchase/removePurchase",
  async (id, { rejectWithValue }) => {
    try {
      await deletePurchase(id);
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

const purchaseSlice = createSlice({
  name: "purchase",
  initialState,
  reducers: {
    clearPurchaseError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearPurchaseError } = purchaseSlice.actions;
export default purchaseSlice.reducer;
