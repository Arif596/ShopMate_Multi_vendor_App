import { useEffect, useState } from "react";
import { X, LogOut, Upload, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  logout,
  updatePassword,
  updateProfile,
} from "../../store/slices/authSlice";
import { toggleAuthPopup, toggleSidebar } from "../../store/slices/popupSlice";

const ProfilePanel = () => {
  const dispatch = useDispatch();
  const { isAuthPopupOpen } = useSelector((state) => state.popup);
  const { authUser, isUpdatingProfile, isUpdatingPassword } = useSelector(
    (state) => state.auth
  );
  const [name, setName] = useState(authUser?.name || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [avatar, setAvatar] = useState(null);
  useEffect(() => {
    if (authUser) {
      setName(authUser?.name || "");
      setEmail(authUser?.email || "");
      // setAvatar(authUser?.avatar||"");
    }
  }, [authUser]);
  const [showPassword, setShowPassword] = useState("");
  const [cuurentPassword, setcurrentPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [confirmNewPassword, setconfirmNewPassword] = useState("");
  const handleLogout = () => {
      console.log("Logout clicked");
    dispatch(logout()).then(() => {
      setShowPassword("");
    setEmail("");
    setcurrentPassword("");
    setnewPassword("");
    setconfirmNewPassword("");
    });
  };
  const handleUpdateProfile = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (avatar) formData.append("avatar", avatar);
    dispatch(updateProfile(formData));
  };
  const handleUpdatePassword = () => {
    const formData = new FormData();
    formData.append("cuurentPassword", cuurentPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmNewPassword", confirmNewPassword);
    dispatch(updatePassword(formData)).then(() => {
      setcurrentPassword("");
      setnewPassword("");
      setconfirmNewPassword("");
    });
  };
  if (!isAuthPopupOpen || !authUser) return null;
  return (
    <>
      {/* overLay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => dispatch(toggleSidebar())}
      />
      {/* Profile Panel */}
      <div className="fixed right-0 top-0 h-full w-96 z-50 glass-panel animate-slide-in-right overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[hsla(var(--glass-border))]">
          <h2 className="text-xl font-semibold text-primary">profile</h2>
          <button
            className="p-2 rounded-lg glass-card hover:glow-on-hover animate-smooth"
            onClick={() => dispatch(toggleAuthPopup())}
          >
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>
        <div className="p-6">
          {/* Avatra + Basic Inofr */}
          <div className="text-center mb-6">
            <img
              src={authUser?.avatar?.url || "/avatar-holder.avif"}
              alt={authUser?.name}
              className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-primary object-cover"
            />
            <h3 className="text-lg font-semibold text-foreground">
              {authUser?.name}
            </h3>
            <p className="text-muted-foreground">{authUser?.email}</p>
          </div>
          {/* Profile Update Form */}
          {authUser && (
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-primary">
                Update Profile
              </h3>
              <input
                type="text"
                className="w-full p-2 rounded border border-border bg-secondary text-foreground"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
              />
              <input
                type="email"
                className="w-full p-2 rounded border border-border bg-secondary text-foreground"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
              />
              <label
                htmlFor="avatar"
                className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground"
              >
                <Upload className="w-4 h-4 text-primary" />
                <span className="flex items-center">Upload Avatar</span>
                <input
                  type="file"
                   id="avatar"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setAvatar(e.target.files[0])}
                />
              </label>
              <button
                onClick={handleUpdateProfile}
                className="flex justify-center items-center space-x-3 p-3 rounded-lg glass-card hover:glow-on-hover animate-smooth group w-full"
              >
                {isUpdatingProfile ? (
                  <>
                    <div
                      className={`w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin`}
                    />
                    <span>Updating Profile .......</span>
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          )}
          {/* Update Password Form */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-primary">
              Update Password
            </h3>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-2 rounded border border-border bg-secondary text-foreground"
              value={cuurentPassword}
              onChange={(e) => setcurrentPassword(e.target.value)}
              placeholder=" Current Password "
            />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-2 rounded border border-border bg-secondary text-foreground"
              value={newPassword}
              onChange={(e) => setnewPassword(e.target.value)}
              placeholder="Enter New Password"
            />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-2 rounded border border-border bg-secondary text-foreground"
              value={confirmNewPassword}
              onChange={(e) => setconfirmNewPassword(e.target.value)}
              placeholder="Enter New Confirm Password"
            />
            <button
              className="text-xs text-muted-foreground flex items-center gap-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-primary" />
              ) : (
                <Eye className="w-4 h-4 text-primary" />
              )}
              {showPassword ? "Hide" : "show"}passwords
            </button>
            <button
              onClick={handleUpdatePassword}
              className="flex justify-center items-center space-x-3 p-3 rounded-lg glass-card hover:glow-on-hover animate-smooth group w-full"
            >
              {isUpdatingPassword ? (
                <>
                  <div
                    className={`w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin`}
                  />
                  <span>Updating Password .......</span>
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="my-6 flex items-center space-x-3 rounded-lg glass-card hover:glow-on-hover text-destructive hover:text-destructive-foreground group w-full "
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;
