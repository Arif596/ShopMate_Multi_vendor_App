// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { ThemeProvider } from "./contexts/ThemeContext";
// import { ToastContainer } from "react-toastify";

// // Layout Components
// import Navbar from "./components/Layout/Navbar";
// import Sidebar from "./components/Layout/Sidebar";
// import SearchOverlay from "./components/Layout/SearchOverlay";
// import CartSidebar from "./components/Layout/CartSidebar";
// import ProfilePanel from "./components/Layout/ProfilePanel";
// import LoginModal from "./components/Layout/LoginModal";
// import Footer from "./components/Layout/Footer";
// import ChatWidget from "./components/Layout/ChatWidget";
// // Pages
// import Index from "./pages/Home";
// import Products from "./pages/Products";
// import ProductDetail from "./pages/ProductDetail";
// import Cart from "./pages/Cart";
// import Orders from "./pages/Orders";
// import Payment from "./pages/Payment";
// import About from "./pages/About";
// import FAQ from "./pages/FAQ";
// import Contact from "./pages/Contact";
// import NotFound from "./pages/NotFound";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { GetUser } from "./store/slices/authSlice";
// import { Loader } from "lucide-react";
// import { fetchAllProduct } from "./store/slices/productSlice";
// import VendorRequestModal from "./components/VendorRequestModal";
// import VendorDashboard from "./Vendors/Pages/VendorDashboard";
// import VendorRoute from "./Vendors/Component/VendorRoute";

// const App = () => {
//   const { authUser, isCheckingAuth } = useSelector((state) => state.auth);
//   const { products, loading } = useSelector((state) => state.product);
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(GetUser());
//   }, [GetUser]);
//   useEffect(() => {
//     dispatch(
//       fetchAllProduct({
//         category: "",
//         price: `0-10000`,
//         search: "",
//         rating: "",
//         availability: "",
//         page: 1,
//       }),
//     );
//   }, []);
//   // const{products}=useSelector((state)=>state.product)
//   if ((isCheckingAuth && !authUser) || !products) {
//     return (
//       <div className="flex item-center justify-center h-screen">
//         <Loader className="size-10 animate-spin" />
//       </div>
//     );
//   }
//   return (
//     <>
//       <ThemeProvider>
//         <BrowserRouter>
//           <div className="min-h-screen bg-background">
//             <Navbar />
//             <Sidebar />
//             <SearchOverlay />
//             <CartSidebar />
//             <ProfilePanel />
//             <LoginModal />
//             <VendorRequestModal />
//             <Routes>
//               <Route path="/" element={<Index />} />
//               <Route path="/password/reset/:token" element={<Index />} />
//               <Route path="/products" element={<Products />} />
//               <Route path="/product/:id" element={<ProductDetail />} />
//               <Route path="/cart" element={<Cart />} />
//               <Route path="/orders" element={<Orders />} />
//               <Route path="/payment" element={<Payment />} />
//               <Route path="/about" element={<About />} />
//               <Route path="/faq" element={<FAQ />} />
//               <Route path="/contact" element={<Contact />} />
//               <Route path="*" element={<NotFound />} />
//               <Route
//                 path="/vendor/dashboard"
//                 element={
//                   <VendorRoute>
//                     <VendorDashboard />
//                   </VendorRoute>
//                 }
//               />
//             </Routes>

//             <Footer />
//             <ChatWidget />
//           </div>
//           <ToastContainer />
//         </BrowserRouter>
//       </ThemeProvider>
//     </>
//   );
// };

// export default App;



import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./contexts/ThemeContext";

// Layout Components
import Navbar from "./components/Layout/Navbar";
import Sidebar from "./components/Layout/Sidebar";
import SearchOverlay from "./components/Layout/SearchOverlay";
import CartSidebar from "./components/Layout/CartSidebar";
import ProfilePanel from "./components/Layout/ProfilePanel";
import LoginModal from "./components/Layout/LoginModal";
import Footer from "./components/Layout/Footer";
import ChatWidget from "./components/Layout/ChatWidget";
import PageLoader from "./components/Layout/PageLoader";
import VendorRequestModal from "./components/VendorRequestModal";

// Pages
import Index from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Payment from "./pages/Payment";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import VendorDashboard from "./Vendors/Pages/VendorDashboard";
import VendorRoute from "./Vendors/Component/VendorRoute";

// Store
import { GetUser } from "./store/slices/authSlice";
import { fetchAllProduct } from "./store/slices/productSlice";

const App = () => {
  const dispatch = useDispatch();
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);
  const { products } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(GetUser());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchAllProduct({
        category: "",
        price: `0-10000`,
        search: "",
        rating: "",
        availability: "",
        page: 1,
      }),
    );
  }, [dispatch]);

  const showLoader = (isCheckingAuth && !authUser) || !products;

  return (
    <ThemeProvider>
      {showLoader ? (
        <PageLoader />
      ) : (
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navbar />
            <Sidebar />
            <SearchOverlay />
            <CartSidebar />
            <ProfilePanel />
            <LoginModal />
            <VendorRequestModal />

            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/password/reset/:token" element={<Index />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/vendor/dashboard"
                element={
                  <VendorRoute>
                    <VendorDashboard />
                  </VendorRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>

            <Footer />
            <ChatWidget />
          </div>
          <ToastContainer />
        </BrowserRouter>
      )}
    </ThemeProvider>
  );
};

export default App;