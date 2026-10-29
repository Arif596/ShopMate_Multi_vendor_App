// import { useState, useEffect } from "react";
// import { X, Mail, Lock, User } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import { toggleAuthPopup } from "../../store/slices/popupSlice";
// import {
//   forgotPassword,
//   login,
//   register,
//   resetPassword,
// } from "../../store/slices/authSlice";

// const LoginModal = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const { authUser, isSigningUp, isLoggingIn, isRequestingForToken } =
//     useSelector((state) => state.auth);
//   const { isAuthPopupOpen } = useSelector((state) => state.popup);
//   const [mode, setMode] = useState("signin"); //signin,signUp,forgot,reset
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   const resetForm = () => {
//     setFormData({
//       name: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     });
//   };
//   // Detect reset Password URL amd open popup with reset mode
//   useEffect(() => {
//     if (location.pathname.startsWith("/password/reset/")) {
//       setMode("reset");
//       dispatch(toggleAuthPopup());
//     }
//   }, [location.pathname, dispatch]);
//   // Reset Form
//   useEffect(() => {
//     resetForm();
//   }, [mode]);
//   // Reset login form when user logs out
//   useEffect(() => {
//     if (!authUser) {
//       setFormData({ name: "", email: "", password: "", confirmPassword: "" });
//       // Sirf tab signin pe jao jab reset URL nahi hai
//       if (!location.pathname.startsWith("/password/reset/")) {
//         setMode("signin");
//       }
//     }
//   }, [authUser, location.pathname]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const data = new FormData();
//     data.append("email", formData.email);
//     data.append("password", formData.password);
//     if (mode === "signup") data.append("name", formData.name);
//     if (mode === "forgot") {
//       dispatch(forgotPassword({ email: formData.email })).then(() => {
//         dispatch(toggleAuthPopup());
//         setMode("signin");
//       });
//       return;
//     }
//     // Reset Mode
//     // if (mode === "reset") {
//     //   const token = location.pathname.split("/").pop();
//     //   dispatch(
//     //     resetPassword({
//     //       token,
//     //       password: formData.password,
//     //       confirmPassword: formData.confirmPassword,
//     //     })
//     //   );
//     //   return;
//     // }
//     if (mode === "reset") {
//       const token = location.pathname.split("/").pop();
//       dispatch(
//         resetPassword({
//           token,
//           password: formData.password,
//           confirmPassword: formData.confirmPassword,
//         }),
//       ).then((result) => {
//         if (result.meta.requestStatus === "fulfilled") {
//           navigate("/"); // ✅ Home pe bhejo
//           dispatch(toggleAuthPopup()); // popup band karo
//           setMode("signin");
//         }
//       });
//       return;
//     }
//     if (mode === "signup") {
//       dispatch(register(data)).then((result) => {
//         if (result.meta.requestStatus === "fulfilled") {
//           setMode("signin");
//           resetForm();
//         }
//       });
//     } else {
//       dispatch(login(data)).then((result)=>{
//         if(result.meta.requestStatus==="fulfilled"){
//           resetForm();
//           dispatch(toggleAuthPopup())
//         }
//       });
//     }
//     if (authUser) {
//       setFormData({ name: "", email: "", password: "", confirmPassword: "" });
//     }
//   };
//   if (!isAuthPopupOpen || authUser) return null;
//   let loadingState = isSigningUp || isLoggingIn || isRequestingForToken;

//   return (
//     <>
//       <div className="fixed inset-0 z-50 flex items-center justify-center">
//         {/* Overlay */}
//         <div className="absolute inset-0 backdrop-blur-md bg-[hsla(var(--glass-bg))]" />
//         <div className="relative z-10 glass-panel w-full max-w-md mx-4 animate-fade-in-up">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-2xl font-bold text-primary">
//               {mode === "reset"
//                 ? "Reset Password"
//                 : mode === "signup"
//                   ? "Create Account"
//                   : mode === "forgot"
//                     ? "Forgot password"
//                     : "Welcome Back"}
//             </h2>
//             <button
//               className="p-2 rounded-lg glass-card hover:glow-on-hover animate-smooth"
//               onClick={() => dispatch(toggleAuthPopup())}
//             >
//               <X className="w-5 h-5 text-primary" />
//             </button>
//           </div>
//           {/* Authenticated Form */}
//           <form className="space-y-4" onSubmit={handleSubmit}>
//             {/* Full Name Only for Signup */}
//             {mode === "signup" && (
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-foreground" />
//                 <input
//                   type="text"
//                   placeholder="Full Name"
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData({ ...formData, name: e.target.value })
//                   }
//                   className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none"
//                 />
//               </div>
//             )}
//             {/* Email always Visible except Reset Mode */}
//             {mode !== "reset" && (
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-foreground" />
//                 <input
//                   type="email"
//                   placeholder="Enter Email Address"
//                   value={formData.email}
//                   onChange={(e) =>
//                     setFormData({ ...formData, email: e.target.value })
//                   }
//                   className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none"
//                 />
//               </div>
//             )}
//             {/* PASSWORD ALWAYS VISIBLE EXCEPT FOR FORGOT MODE */}
//             {mode !== "forgot" && (
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-foreground" />
//                 <input
//                   type="password"
//                   placeholder="Enter Password"
//                   value={formData.password}
//                   onChange={(e) =>
//                     setFormData({ ...formData, password: e.target.value })
//                   }
//                   className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none"
//                 />
//               </div>
//             )}
//             {/* CONFIRM PASSWORD ONLY SHOW   FOR RESET PASSWORD MODE */}
//             {mode === "reset" && (
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-foreground" />
//                 <input
//                   type="password"
//                   placeholder="Enter Confirm Password"
//                   value={formData.confirmPassword}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       confirmPassword: e.target.value,
//                     })
//                   }
//                   className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none"
//                 />
//               </div>
//             )}
//             {/* FORGOT PASSWORD TOGGLE BUTTON/LINK */}
//             {mode === "signin" && (
//               <div className="text-right text-sm">
//                 <button
//                   type="button"
//                   onClick={() => setMode("forgot")}
//                   className="text-primary hover:text-accent animate-smooth"
//                 >
//                   Forgot Password?
//                 </button>
//               </div>
//             )}
//             {/* Submit Button */}
//             <button
//               type="submit"
//               className={`w-full py-3 gradient-primary flex justify-center items-center gap-2 text-primary-foreground rounded-lg font-semibold animate-smooth ${
//                 loadingState
//                   ? "opacity-70 cursor-not-allowed"
//                   : "hover-glow-on-hover"
//               }`}
//               disabled={loadingState}
//             >
//               {loadingState ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                   <span>
//                     {mode === "reset"
//                       ? "Reseting Password..."
//                       : mode === "signup"
//                         ? "Signing Up"
//                         : mode === "forgot"
//                           ? "Request for Email ..."
//                           : "Signining..."}{" "}
//                     {""}
//                   </span>
//                 </>
//               ) : mode === "reset" ? (
//                 "Reset Password"
//               ) : mode === "signup" ? (
//                 "Creating Account"
//               ) : mode === "forgot" ? (
//                 "Send Reset Email"
//               ) : (
//                 "signin"
//               )}
//             </button>
//           </form>
//           {/* Toggle Mode */}
//           {["signin", "signup"].includes(mode) && (
//             <div className="text-center mt-6">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setMode((prev) => (prev === "signup" ? "signin" : "signup"));
//                 }}
//                 className="text-primary hover:text-accent animate-smooth"
//               >
//                 {mode === "signup"
//                   ? "Already have Account? sign in"
//                   : "Don't have a account? sign Up"}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

import { useState, useEffect } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toggleAuthPopup } from "../../store/slices/popupSlice";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from "../../store/slices/authSlice";

const LoginModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { authUser, isSigningUp, isLoggingIn, isRequestingForToken } =
    useSelector((state) => state.auth);
  const { isAuthPopupOpen } = useSelector((state) => state.popup);
  const [mode, setMode] = useState("signin"); // signin, signup, forgot, reset
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  // Reset password URL detect karke popup reset mode mein kholna
  useEffect(() => {
    if (location.pathname.startsWith("/password/reset/")) {
      setMode("reset");
      dispatch(toggleAuthPopup());
    }
  }, [location.pathname, dispatch]);

  // Mode badalne par form clear
  useEffect(() => {
    resetForm();
  }, [mode]);

  // Logout ke baad form reset
  useEffect(() => {
    if (!authUser) {
      resetForm();
      if (!location.pathname.startsWith("/password/reset/")) {
        setMode("signin");
      }
    }
  }, [authUser, location.pathname]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "forgot") {
      dispatch(forgotPassword({ email: formData.email })).then(() => {
        dispatch(toggleAuthPopup());
        setMode("signin");
      });
      return;
    }

    if (mode === "reset") {
      const token = location.pathname.split("/").pop();
      dispatch(
        resetPassword({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      ).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          navigate("/");
          dispatch(toggleAuthPopup());
          setMode("signin");
        }
      });
      return;
    }

    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);

    if (mode === "signup") {
      // role nahi bhejna, backend hamesha 'User' banata hai
      data.append("name", formData.name);
      dispatch(register(data)).then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          setMode("signin");
          resetForm();
        }
      });
      return;
    }

    // signin: role frontend se nahi jata, backend DB se tay karta hai
    dispatch(login(data)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        const loggedUser = result.payload?.user ?? result.payload;
        resetForm();
        dispatch(toggleAuthPopup());

        if (loggedUser?.must_change_password) {
          toast.info(
            "Your account is now a Vendor account. Please change your temporary password from your profile.",
          );
          // yahan profile panel kholne ka action dispatch kar sakte hain
        } else if (loggedUser?.role === "Vendor") {
          toast.success("Welcome, Vendor!");
          navigate("/vendor/dashboard");
        }
      }
    });
  };

  if (!isAuthPopupOpen || authUser) return null;
  const loadingState = isSigningUp || isLoggingIn || isRequestingForToken;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Overlay */}
        <div className="absolute inset-0 backdrop-blur-md bg-[hsla(var(--glass-bg))]" />
        <div className="relative z-10 glass-panel w-full max-w-md mx-4 animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-primary">
              {mode === "reset"
                ? "Reset Password"
                : mode === "signup"
                  ? "Create Account"
                  : mode === "forgot"
                    ? "Forgot password"
                    : "Welcome Back"}
            </h2>
            <button
              className="p-2 rounded-lg glass-card hover:glow-on-hover animate-smooth"
              onClick={() => dispatch(toggleAuthPopup())}
            >
              <X className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full name: sirf signup */}
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-foreground" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none"
                />
              </div>
            )}

            {/* Email: reset ke ilawa hamesha */}
            {mode !== "reset" && (
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-foreground" />
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none"
                />
              </div>
            )}

            {/* Password: forgot ke ilawa hamesha */}
            {mode !== "forgot" && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-foreground" />
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none"
                />
              </div>
            )}

            {/* Confirm password: sirf reset */}
            {mode === "reset" && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary-foreground" />
                <input
                  type="password"
                  placeholder="Enter Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none"
                />
              </div>
            )}

            {/* Forgot password link */}
            {mode === "signin" && (
              <div className="text-right text-sm">
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-primary hover:text-accent animate-smooth"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className={`w-full py-3 gradient-primary flex justify-center items-center gap-2 text-primary-foreground rounded-lg font-semibold animate-smooth ${
                loadingState
                  ? "opacity-70 cursor-not-allowed"
                  : "hover-glow-on-hover"
              }`}
              disabled={loadingState}
            >
              {loadingState ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>
                    {mode === "reset"
                      ? "Resetting password..."
                      : mode === "signup"
                        ? "Creating account..."
                        : mode === "forgot"
                          ? "Sending email..."
                          : "Signing in..."}
                  </span>
                </>
              ) : mode === "reset" ? (
                "Reset Password"
              ) : mode === "signup" ? (
                "Create Account"
              ) : mode === "forgot" ? (
                "Send Reset Email"
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Signin <-> Signup */}
          {["signin", "signup"].includes(mode) && (
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() =>
                  setMode((prev) => (prev === "signup" ? "signin" : "signup"))
                }
                className="text-primary hover:text-accent animate-smooth"
              >
                {mode === "signup"
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginModal;