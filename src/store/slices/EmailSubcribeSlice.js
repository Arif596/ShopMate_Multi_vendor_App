import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const AddSubcribeEmailUser = createAsyncThunk(
  "addemail/user",
  async (email, thunkApi) => {
    console.log("Thank You", email);
    try {
      const res = await axiosInstance.post("email/add/subcribe", { email });
      toast.success(res.data?.message || "Succcesfully Subcripbe Shopmate");
      return res.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to Subcripbe Shopmate",
      );
      return thunkApi.rejectWithValue(error.response?.data?.message);
    }
  },
);
