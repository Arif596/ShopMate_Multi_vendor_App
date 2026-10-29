import {
  X,
  Home,
  // Package,
  // Info,
  // HelpCircle,
  // ShoppingCart,
  // List,
  // Phone,
  LayoutDashboard,
  // PlusSquare,
  // ClipboardList,
  // User,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../store/slices/popupSlice";

// ================= USER MENU =================
// Abhi sirf Home active hai. Baqi pages ready hon to uncomment karein
// (aur upar lucide-react import mein unke icons bhi uncomment karein).
const userMenu = (/* authUser */) =>
  [
    { name: "Home", icon: Home, path: "/" },
    // { name: "Products", icon: Package, path: "/products" },
    // { name: "About", icon: Info, path: "/about" },
    // { name: "FAQ", icon: HelpCircle, path: "/faq" },
    // { name: "Contact", icon: Phone, path: "/contact" },
    // { name: "Cart", icon: ShoppingCart, path: "/cart" },
    // authUser && { name: "My Orders", icon: List, path: "/orders" },
  ].filter(Boolean);

// ================= VENDOR MENU =================
// Abhi sirf Dashboard aur Store Home. Baqi pages/routes bane to uncomment karein.
const vendorMenu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/vendor/dashboard" },
  // { name: "My Products", icon: Package, path: "/vendor/products" },
  // { name: "Add Product", icon: PlusSquare, path: "/vendor/products/new" },
  // { name: "Orders", icon: ClipboardList, path: "/vendor/orders" },
  // { name: "Profile", icon: User, path: "/profile" },
  { name: "Store Home", icon: Home, path: "/" },
];

const Sidebar = () => {
  const { authUser } = useSelector((state) => state.auth);
  const { isSidebarOpen } = useSelector((state) => state.popup);
  const dispatch = useDispatch();

  if (!isSidebarOpen) return null;

  const isVendor = authUser?.role === "Vendor";
  const menuItems = isVendor ? vendorMenu : userMenu(authUser);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => dispatch(toggleSidebar())}
      />
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 z-50 glass-panel animate-slide-in-left">
        <div className="flex items-center justify-between p-6 border-b border-[hsla(var(---glass-border))]">
          <h2 className="text-xl font-semibold text-primary">
            {isVendor ? "Vendor Menu" : "Menu"}
          </h2>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg glass-card hover:glow-on-hover animate-smooth"
          >
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>
        <nav className="p-6">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => dispatch(toggleSidebar())}
                  className="flex items-center space-x-3 p-3 rounded-lg glass-card hover:glow-on-hover animate-smooth text-foreground hover:text-primary group"
                >
                  <item.icon className="w-5 h-5 group-hover:text-primary" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;