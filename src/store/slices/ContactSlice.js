import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const SendContactForm = createAsyncThunk(
  "contact/send",
  async (formData, thunkApi) => {
    console.log("All Data", formData);
    try {
      const res = await axiosInstance.post("/contact/send/message", formData);
      toast.success(res.data?.message || "Message sent successfully!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
      return thunkApi.rejectWithValue(error.response?.data?.message);
    }
  },
);

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(SendContactForm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(SendContactForm.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(SendContactForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default contactSlice.reducer;
