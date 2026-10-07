import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllCategories, addCategory, updateCategory, deleteCategory } from "../../services/categoryApi";

const normalizeError = (error) =>
  error?.response?.data?.message || error?.data?.message || error?.message || error?.error || "Something went wrong";

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const categories = await getAllCategories();
      return categories || [];
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (payload, { rejectWithValue }) => {
    try {
      return await addCategory(payload);
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const editCategory = createAsyncThunk(
  "category/editCategory",
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      return await updateCategory(id, categoryData);
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const removeCategory = createAsyncThunk(
  "category/removeCategory",
  async (id, { rejectWithValue }) => {
    try {
      await deleteCategory(id);
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

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.items.unshift(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(editCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.loading = false;
        const item = action.payload;
        if (!item) return;
        const index = state.items.findIndex((entry) => String(entry._id || entry.id) === String(item._id || item.id));
        if (index !== -1) state.items[index] = item;
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(removeCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => String(item._id || item.id) !== String(action.payload));
      })
      .addCase(removeCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
