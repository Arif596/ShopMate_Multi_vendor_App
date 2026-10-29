import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const VendorRoute = ({ children }) => {
  const user = useSelector((state) => state.auth?.authUser);
  if (!user || user.role !== "Vendor") return <Navigate to="/" replace />;
  return children;
};

export default VendorRoute;