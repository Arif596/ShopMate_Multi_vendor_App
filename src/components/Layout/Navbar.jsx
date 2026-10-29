import {
  Menu,
  User,
  ShoppingCart,
  Sun,
  Moon,
  Search,
  Store,
  LayoutDashboard 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import DbToggle from "../../components/DbToggle";
import RoleBadge from "../Common/RoleBadge";
import {
  toggleAuthPopup,
  toggleCart,
  toggleSearchBar,
  toggleSidebar,
  toggleVendorModal,
} from "../../store/slices/popupSlice";
const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  // const user = useSelector((state) => state.auth?.user);
  const user = useSelector((state) => state.auth?.authUser);
  const rawRole = user?.role;

  const role =
    typeof rawRole === "string"
      ? ({ vendor: "Vendor", user: "User" }[rawRole.trim().toLowerCase()] ??
        rawRole)
      : null;
  const canRequestVendor = user && role === "User";
  const { cart } = useSelector((state) => state.cart);
  let cartItemCount = 0;
  if (cart) {
    cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  }
  return (
    <nav className="fixed left-0 top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Menu Icons */}
          <button
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => dispatch(toggleSidebar())}
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          {/* Center Logo */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold text-primary">Shop Mate</h1>
          </div>
          {/* Right side Icons */}
          <div className="flex items-center space-x-2">
            {/* Theme Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-foreground" />
              ) : (
                <Moon className="w-5 h-5 text-foreground" />
              )}
            </button>
            <button
              onClick={() => dispatch(toggleSearchBar())}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <Search className="w-5 h-6 text-foreground" />
            </button>
            {canRequestVendor && (
              <button
                onClick={() => dispatch(toggleVendorModal())}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                <Store className="w-4 h-4" />
                <span className="hidden sm:inline">Become a Vendor</span>
              </button>
            )}
            {/* {role === "Vendor" && (
              <Link
                to="/vendor/dashboard"
                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )} */}
            {/* User Profile */}
            {/* <button
              onClick={() => dispatch(toggleAuthPopup())}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <User className="w-5 h-6 text-foreground" />
            </button> */}
            {/* User Profile */}
            <button
              onClick={() => dispatch(toggleAuthPopup())}
              className="flex h-10 items-center gap-2 rounded-lg px-2 transition-colors hover:bg-secondary"
            >
              <User className="w-5 h-5 text-foreground shrink-0" />
              {user && (
                <div className="hidden items-center gap-2 md:flex">
                  <span className="max-w-[120px] truncate text-sm font-medium text-foreground">
                    {user.name}
                  </span>
                  <RoleBadge role={role} />
                </div>
              )}
            </button>
            {/* Cart */}
            <button
              onClick={() => dispatch(toggleCart())}
              className=" relative p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <ShoppingCart className="w-5 h-6 text-foreground" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground">
                  {cartItemCount}
                </span>
              )}
            </button>
            {/* <DbToggle /> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
