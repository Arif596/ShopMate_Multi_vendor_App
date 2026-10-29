import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { toggleAIModal } from "./popupSlice";
import { useSelector } from "react-redux";

export const fetchAllProduct = createAsyncThunk(
  "product/fetchAll",
  async (
    {
      availability = "",
      category = "",
      price = "",
      search = "",
      rating = "",
      page = 1,
    },
    thukApi,
  ) => {
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (price && price !== "0-1000000") params.append("price", price);
      if (search) params.append("search", search);
      if (rating) params.append("rating", rating);
      if (availability) params.append("availability", availability);
      if (page) params.append("page", page);
      const res = await axiosInstance.get(
        `/product/all-product?${params.toString()}`,
      );
      console.log("API RESPONSE SUCCESS:", res.data);
      return res.data;
    } catch (error) {
      console.error("API RESPONSE ERROR:", error?.response || error);
      return thukApi.rejectWithValue(
        error.response.data.message || "Failed to Fetch All Product",
      );
    }
  },
);
export const FetchSingleProduct = createAsyncThunk(
  "product/singleProduct",
  async (id, thukApi) => {
    console.log("Thunk started");
    try {
      console.log(id);
      const res = await axiosInstance.get(`/product/single-product/${id}`);
      console.log("=== API Response Structure ===");
      console.log("Full response:", res.data);
      console.log("Product object:", res.data.product);
      console.log("Does product exist?", !!res.data.product);
      console.log(
        "Product keys:",
        res.data.product ? Object.keys(res.data.product) : "No product",
      );
      console.log("Has reviews property?", res.data.product?.reviews);
      console.log("Reviews type:", typeof res.data.product?.reviews);
      console.log("Reviews value:", res.data.product?.reviews);
      console.log("============================");
      return res.data.product;
    } catch (error) {
      return thukApi.rejectWithValue(
        error.response.data.message || "Failed to Fetch Product Details",
      );
    }
  },
);
export const PostReview = createAsyncThunk(
  "product/post-new/review",
  async ({ productId, review }, thukApi) => {
    const state = thukApi.getState();
    const authUser = state.auth.authUser;
    try {
      const res = await axiosInstance.put(
        `/product/post-new/review/${productId}`,
        review,
      );
      console.log("APi resposne", res);
      toast.success(res.data.message);
      return {
        review: res.data.review,
        authUser,
      };
    } catch (error) {
      toast.error(error.response.data.message || "Failed to Post  new Review ");
      return thukApi.rejectWithValue(
        error.response.data.message || "Failed to Post  new Review ",
      );
    }
  },
);
export const DeleteReview = createAsyncThunk(
  "product/Delete/review",
  async ({ productId, reviewId }, thukApi) => {
    try {
      const res = await axiosInstance.delete(
        `/product/delete/review/${productId}`,
        {
          data: { reviewId },
        },
      );
      (console.log("Api response is ", res), toast.success(res.data.message));
      return reviewId;
    } catch (error) {
      toast.error(error.response.data.message || "Failed to Delete Review ");
      return thukApi.rejectWithValue(
        error.response.data.message || "Failed to Delete Review ",
      );
    }
  },
);
export const FetchProductWithAI = createAsyncThunk(
  "product/ai-search",
  async (UserPrompt, thukApi) => {
    try {
      console.log(UserPrompt);
      const res = await axiosInstance.post("/product/ai-search-product", {
        UserPrompt,
      });
      thukApi.dispatch(toggleAIModal());
      return res.data;
    } catch (error) {
      return thukApi.rejectWithValue(
        error.response.data.message || "Failed to Fetch AI Filtered Products ",
      );
    }
  },
);
// const { authUser } = useSelector((state) => state.auth);
const productSlice = createSlice({
  name: "product",
  initialState: {
    loading: false,
    products: [],
    productDetails: {},
    totalProducts: 0,
    topRatedProducts: [],
    newProducts: [],
    aiSearching: false,
    isReviewDeleting: false,
    isPostingReview: false,
    productReviews: [],
  },
  reducers: {
    clearProductDetails: (state) => {
      state.productDetails = null;
      state.productReviews = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.product || [];
      state.newProducts = action.payload.newProductResult || [];
      state.topRatedProducts = action.payload.TopratedProductResult || [];
      state.totalProducts =
        action.payload.totalProductsResult?.[0]?.count || state.products.length;
    });
    builder.addCase(fetchAllProduct.rejected, (state) => {
      state.loading = false;
    });
    // For Fetch Single Product
    builder.addCase(FetchSingleProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(FetchSingleProduct.fulfilled, (state, action) => {
      console.log("FULFILLED PAYLOAD:", action.payload);
      state.loading = false;
      state.productDetails = action.payload;
      state.productReviews = action.payload.reviews || [];
    });

    builder.addCase(FetchSingleProduct.rejected, (state) => {
      state.loading = false;
    });
    // For Post Review Product
    builder.addCase(PostReview.pending, (state) => {
      state.isPostingReview = true;
    });
    builder.addCase(PostReview.fulfilled, (state, action) => {
      state.isPostingReview = false;
      // state.productReviews = [action.payload, ...state.productReviews];
      const newReviews = action.payload.review;
      const authUser = action.payload.authUser;

      const existingReviewIndex = state.productReviews.findIndex(
        (rev) => rev.reviewer?.id === newReviews.user_id,
      );
      if (existingReviewIndex !== -1) {
        state.productReviews[existingReviewIndex].rating = Number(
          newReviews.rating,
        );
        state.productReviews[existingReviewIndex].comment = newReviews.comment;
      } else {
        state.productReviews = [
          {
            ...newReviews,
            reviewer: {
              id: authUser?.id,
              name: authUser?.name,
              avatar: authUser?.avatar?.url,
            },
            ...state.productReviews,
          },
        ];
      }
    });
    builder.addCase(PostReview.rejected, (state) => {
      state.isPostingReview = false;
    });
    // For Delete Review Product
    builder.addCase(DeleteReview.pending, (state) => {
      state.isReviewDeleting = true;
    });
    builder.addCase(DeleteReview.fulfilled, (state, action) => {
      state.isReviewDeleting = false;
      state.productReviews = state.productReviews.filter(
        (review) => review.review_id !== action.payload,
      );
    });
    builder.addCase(DeleteReview.rejected, (state) => {
      state.isReviewDeleting = false;
    });
    // For Search Product With AI
    builder.addCase(FetchProductWithAI.pending, (state) => {
      state.aiSearching = true;
    });
    builder.addCase(FetchProductWithAI.fulfilled, (state, action) => {
      state.aiSearching = false;
      state.products = action.payload.products;
      state.totalProducts = action.payload.products.length;
    });
    builder.addCase(FetchProductWithAI.rejected, (state) => {
      state.aiSearching = false;
    });
  },
});
export const { clearProductDetails } = productSlice.actions;
export default productSlice.reducer;
