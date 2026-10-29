import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../lib/axios";
import { setAuthUser } from "../store/slices/authSlice";

const AuthRefresher = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth?.authUser);

  useEffect(() => {
    // Sirf tab check karo jab user login hai aur abhi tak "User" hai
    if (!user || user.role !== "User") return;

    const check = async () => {
      try {
        const res = await axiosInstance.get("/auth/get-user");
        const fresh = res.data?.user ?? res.data;
        if (fresh?.role && fresh.role !== user.role) {
          dispatch(setAuthUser(fresh));
        }
      } catch {
        /* ignore */
      }
    };

    const id = setInterval(check, 15000);
    const onFocus = () => check();
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [user?.id, user?.role, dispatch]);

  return null;
};

export default AuthRefresher;