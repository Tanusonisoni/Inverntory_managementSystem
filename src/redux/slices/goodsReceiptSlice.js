import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllGoodsReceipts, addGoodsReceipt, updateGoodsReceipt, deleteGoodsReceipt } from "../../services/goodReciptsApi";

const normalizeError = (error) =>
  error?.message || error?.error || error?.data?.message || "Something went wrong";

export const fetchGoodsReceipts = createAsyncThunk(
  "goodsReceipt/fetchGoodsReceipts",
  async (_, { rejectWithValue }) => {
    try {
      const receipts = await getAllGoodsReceipts();
      return receipts || [];
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const createGoodsReceipt = createAsyncThunk(
  "goodsReceipt/createGoodsReceipt",
  async (payload, { rejectWithValue }) => {
    try {
      return await addGoodsReceipt(payload);
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const editGoodsReceipt = createAsyncThunk(
  "goodsReceipt/editGoodsReceipt",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateGoodsReceipt(id, data);
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const removeGoodsReceipt = createAsyncThunk(
  "goodsReceipt/removeGoodsReceipt",
  async (id, { rejectWithValue }) => {
    try {
      await deleteGoodsReceipt(id);
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

const goodsReceiptSlice = createSlice({
  name: "goodsReceipt",
  initialState,
  reducers: {
    clearGoodsReceiptError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoodsReceipts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoodsReceipts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchGoodsReceipts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearGoodsReceiptError } = goodsReceiptSlice.actions;
export default goodsReceiptSlice.reducer;
