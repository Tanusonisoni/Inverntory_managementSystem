import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllSuppliers, addSupplier, updateSupplier, deleteSupplier } from "../../services/supplierApi";

const normalizeError = (error) =>
  error?.response?.data?.message || error?.data?.message || error?.message || error?.error || "Something went wrong";

export const fetchSuppliers = createAsyncThunk(
  "supplier/fetchSuppliers",
  async (_, { rejectWithValue }) => {
    try {
      const suppliers = await getAllSuppliers();
      return suppliers || [];
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const createSupplier = createAsyncThunk(
  "supplier/createSupplier",
  async (payload, { rejectWithValue }) => {
    try {
      return await addSupplier(payload);
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const editSupplier = createAsyncThunk(
  "supplier/editSupplier",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateSupplier(id, data);
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const removeSupplier = createAsyncThunk(
  "supplier/removeSupplier",
  async (id, { rejectWithValue }) => {
    try {
      await deleteSupplier(id);
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

const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    clearSupplierError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        if (action.payload) state.items.unshift(action.payload);
      })
      .addCase(editSupplier.fulfilled, (state, action) => {
        const item = action.payload;
        if (!item) return;
        const index = state.items.findIndex((entry) => String(entry._id || entry.id) === String(item._id || item.id));
        if (index !== -1) state.items[index] = item;
      })
      .addCase(removeSupplier.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => String(item._id || item.id) !== String(action.payload));
      });
  },
});

export const { clearSupplierError } = supplierSlice.actions;
export default supplierSlice.reducer;
