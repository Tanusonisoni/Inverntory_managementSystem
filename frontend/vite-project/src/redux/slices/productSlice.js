import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addProduct, getAllProducts, updateProduct, deleteProduct, getProductById } from "../../services/productapi";

const normalizeError = (error) =>
  error?.response?.data?.message || error?.data?.message || error?.message || error?.error || "Something went wrong";

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const products = await getAllProducts();
      return products || [];
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const product = await getProductById(id);
      return product;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const product = await addProduct(productData);
      return product;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const editProduct = createAsyncThunk(
  "product/editProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const product = await updateProduct(id, productData);
      return product;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const removeProduct = createAsyncThunk(
  "product/removeProduct",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

const initialState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload || [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.products.unshift(action.payload);
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(editProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        if (!updatedProduct) return;
        const index = state.products.findIndex(
          (product) => String(product._id || product.id) === String(updatedProduct._id || updatedProduct.id)
        );
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(removeProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => String(product._id || product.id) !== String(action.payload)
        );
      })
      .addCase(removeProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;