import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

// Add to Wishlist
export const AddWishList = createAsyncThunk(
  "wishlist/add",
  async (productId, thunkApi) => {
    try {
      const res = await axiosInstance.post("/wishlist/addwishlist", {
        productId,
      });
      toast.success(res.data?.message || "Added to wishlist");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to wishlist");
      return thunkApi.rejectWithValue(error.response?.data?.message);
    }
  },
);

// Fetch Wishlist
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, thunkApi) => {
    try {
      const res = await axiosInstance.get("/wishlist/getwishlist");
      return res.data;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist",
      );
    }
  },
);

// Remove from Wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (productId, thunkApi) => {
    try {
      const res = await axiosInstance.delete(`/wishlist/${productId}`);
      toast.success(res.data.message || "Removed from wishlist");
      return res.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to remove from wishlist",
      );
      return thunkApi.rejectWithValue(error.response?.data?.message);
    }
  },
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false; // ❌ WAS: state.loading = true (BUG!)
        state.items = action.payload.wishlist || action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Wishlist
      .addCase(AddWishList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AddWishList.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.wishlist) {
          state.items = action.payload.wishlist;
        }
      })
      .addCase(AddWishList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.wishlist) {
          state.items = action.payload.wishlist;
        }
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
