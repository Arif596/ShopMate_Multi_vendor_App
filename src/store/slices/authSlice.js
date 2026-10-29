import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { toggleAuthPopup } from "./popupSlice";

export const register = createAsyncThunk(
  "auth/register",
  async (data, thunkApi) => {
    try {
      const res = await axiosInstance.post("/auth/register", data);
      toast.success(res?.data?.message);
      thunkApi.dispatch(toggleAuthPopup());
      return res.data.user;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Register Failed");
      return thunkApi.rejectWithValue(
        error?.response?.data?.message || "Register Failed",
      );
    }
  },
);
//Login
export const login = createAsyncThunk("auth/login", async (data, thunkApi) => {
  try {
    const res = await axiosInstance.post("/auth/login", data);
    toast.success(res?.data?.message);
    thunkApi.dispatch(toggleAuthPopup());
    return res?.data?.user;
  } catch (error) {
    const message = error?.response?.data?.message || "Login failed ❌";
    toast.error(message);
    return thunkApi.rejectWithValue(message);
  }
});
// Get User
export const GetUser = createAsyncThunk(
  "auth/get-user",
  async (_, thunkApi) => {
    try {
      const res = await axiosInstance.get("/auth/get-user");
      return res?.data?.user;
    } catch (error) {
      return thunkApi.rejectWithValue(null);
    }
  },
);
// Logout
export const logout = createAsyncThunk("auth/logout", async (_, thunkApi) => {
  console.log("Logout thunk triggered"); // 🔹
  try {
    const res = await axiosInstance.get("/auth/logout");
    console.log("Logout API response:", res); // 🔹
    // thunkApi.dispatch(toggleAuthPopup());
    // toast.success("Logout Successfully");
    return null;
  } catch (error) {
    console.error("Logout error:", error); // 🔹
    toast.error(error?.response?.data?.message);
    return thunkApi.rejectWithValue(
      error.response.data.message || "Failed to Logout",
    );
  }
});
// Forgot Password
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, thunkApi) => {
    const frontendUrl = window.location.origin;
    try {
      const res = await axiosInstance.post(
        //
        `/auth/password/reset?frontendUrl=${encodeURIComponent(frontendUrl)}`,
        email,
      );
      toast.success(res?.data?.message);
      return null;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return thunkApi.rejectWithValue(error?.response?.data?.message);
    }
  },
);
// Forgot Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password, confirmPassword }, thunkApi) => {
    try {
      const res = await axiosInstance.put(`/auth/password/reset/${token}`, {
        password,
        confirmPassword,
      });
      toast.success(res?.data?.message);
      return res?.data?.user;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "SomeThing Went Wrong Please Try again";
      toast.error(message);
      return thunkApi.rejectWithValue(message);
    }
  },
);
// Update Password
export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (data, thunkApi) => {
    try {
      const res = await axiosInstance.put(`/auth/password/update`, data);
      toast.success(res?.data?.message);
      return null;
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
      return thunkApi.rejectWithValue(message);
    }
  },
);
// Update Profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, thunkApi) => {
    try {
      const res = await axiosInstance.put(`/auth/profile/update`, data);
      toast.success(res?.data?.message);
      return res.data.user;
    } catch (error) {
      const message = error?.response?.data?.message;
      toast.error(message);
      return thunkApi.rejectWithValue(message);
    }
  },
);
const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isUpdatingPassword: false,
    isRequestingForToken: false,
    isCheckingAuth: true,
  },
  reducers: {
  setAuthUser: (state, action) => {
    state.authUser = action.payload;
  },
},
  extraReducers: (builder) => {
    // Register
    builder.addCase(register.pending, (state) => {
      state.isSigningUp = true;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.isSigningUp = false;
      // state.authUser = action.payload;
    });
    builder.addCase(register.rejected, (state) => {
      state.isSigningUp = false;
    });
    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoggingIn = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoggingIn = false;
      state.authUser = action.payload;
    });
    builder.addCase(login.rejected, (state) => {
      state.isLoggingIn = false;
    });
    // GetUser
    builder.addCase(GetUser.pending, (state) => {
      state.isCheckingAuth = true;
      state.authUser = null;
    });
    builder.addCase(GetUser.fulfilled, (state, action) => {
      state.isCheckingAuth = false;
      state.authUser = action.payload;
    });
    builder
      .addCase(GetUser.rejected, (state) => {
        state.isCheckingAuth = false;
        state.authUser = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
      });
    builder.addCase(logout.rejected, (state, action) => {
      state.authUser = state.authUser;
    });
    // Forgot Password
    builder.addCase(forgotPassword.pending, (state) => {
      state.isRequestingForToken = true;
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.isRequestingForToken = false;
      // state.authUser = action.payload;
    });
    builder.addCase(forgotPassword.rejected, (state) => {
      state.isRequestingForToken = false;
    });
    //reset password
    builder.addCase(resetPassword.pending, (state) => {
      state.isUpdatingPassword = true;
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.isUpdatingPassword = false;
      // state.authUser = action.payload;
    });
    builder.addCase(resetPassword.rejected, (state) => {
      state.isUpdatingPassword = false;
    });
    //Update password
    builder.addCase(updatePassword.pending, (state) => {
      state.isUpdatingPassword = true;
    });
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      state.isUpdatingPassword = false;
    });
    builder.addCase(updatePassword.rejected, (state) => {
      state.isUpdatingPassword = false;
    });
    //Update password
    builder.addCase(updateProfile.pending, (state) => {
      state.isUpdatingProfile = true;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.isUpdatingProfile = false;
      state.authUser = action.payload;
    });
    builder.addCase(updateProfile.rejected, (state) => {
      state.isUpdatingProfile = false;
    });
  },
});
export const { setAuthUser } = authSlice.actions;
export default authSlice.reducer;
