import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllLocations, addLocation, updateLocation, deleteLocation } from "../../services/locationApi";

const normalizeError = (error) =>
  error?.message || error?.error || error?.data?.message || "Something went wrong";

export const fetchLocations = createAsyncThunk(
  "location/fetchLocations",
  async (_, { rejectWithValue }) => {
    try {
      const locations = await getAllLocations();
      return locations || [];
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const createLocation = createAsyncThunk(
  "location/createLocation",
  async (payload, { rejectWithValue }) => {
    try {
      return await addLocation(payload);
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const editLocation = createAsyncThunk(
  "location/editLocation",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateLocation(id, data);
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const removeLocation = createAsyncThunk(
  "location/removeLocation",
  async (id, { rejectWithValue }) => {
    try {
      await deleteLocation(id);
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

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    clearLocationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(createLocation.fulfilled, (state, action) => {
        if (action.payload) state.items.unshift(action.payload);
      })
      .addCase(editLocation.fulfilled, (state, action) => {
        const item = action.payload;
        if (!item) return;
        const index = state.items.findIndex((entry) => String(entry._id || entry.id) === String(item._id || item.id));
        if (index !== -1) state.items[index] = item;
      })
      .addCase(removeLocation.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => String(item._id || item.id) !== String(action.payload));
      });
  },
});

export const { clearLocationError } = locationSlice.actions;
export default locationSlice.reducer;
