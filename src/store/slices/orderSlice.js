import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
export const fetchMyOrders = createAsyncThunk(
  "order/orders/me",
  async (_, thunkApi) => {
    try {
      const res = await axiosInstance.get("/order/get-MyOrder/me");
      return res.data.orderResult;
    } catch (error) {
      return thunkApi.rejectWithValue(error.response.data.message);
    }
  },
);
export const PlaceOrders = createAsyncThunk(
  "order/new",
  async (data, thunkApi) => {
    try {
      const res = await axiosInstance.post("/order/new/order", data);
      toast.success(res.data.message);
      return res.data;
    } catch (error) {
      toast.error(
        error.response.data.message ||
          "Failed to place order please try again ",
      );
      return thunkApi.rejectWithValue(error.response.data.message);
    }
  },
);
const orderSlice = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    fetchingOrders: false,
    placingOrder: false,
    finalPrice: null,
    orderStep: 1,
    paymentIntent: "",
  },
  reducers: {
    toggleOrderStep(state) {
      state.orderStep = 1;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyOrders.pending, (state) => {
      state.fetchingOrders = true;
    });
    builder.addCase(fetchMyOrders.fulfilled, (state, action) => {
      state.fetchingOrders = false;
      state.myOrders = action.payload;
    });
    builder.addCase(fetchMyOrders.rejected, (state) => {
      state.fetchingOrders = false;
    });
    builder.addCase(PlaceOrders.pending, (state) => {
      state.placingOrder = true;
    });
    builder.addCase(PlaceOrders.fulfilled, (state, action) => {
      state.placingOrder = false;
      state.finalPrice = action.payload.total_price;
      state.paymentIntent = action.payload.paymentIntent;
      state.orderStep = 2;
    });
    builder.addCase(PlaceOrders.rejected, (state) => {
      state.placingOrder = fasle;
    });
  },
});

export default orderSlice.reducer;
export const { toggleOrderStep } = orderSlice.actions;
