import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Plus,
  Minus,
  Loader,
  CircleDollarSign,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import ReviewsContainer from "../components/Products/ReviewsContainer";
import { addCart } from "../store/slices/cartSlice";
import {
  clearProductDetails,
  FetchSingleProduct,
} from "../store/slices/productSlice";
import { toast } from "react-toastify";
import {
  AddWishList,
  fetchWishlist,
  removeFromWishlist,
} from "../store/slices/wishlistSlice";

const ProductDetail = () => {
  const { id } = useParams();
  // const { id } = useParams();
  console.log("Product ID from URL:", id);

  const dispatch = useDispatch();
  const product = useSelector((state) => state.product?.productDetails);
  const Wishlist = useSelector((state) => state.wishlist?.items||[]);
   const { authUser } = useSelector((state) => state.auth);
  const { loading, productReviews } = useSelector((state) => state.product);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const handleAddtoCart = () => {
    dispatch(addCart({ product, quantity }));
  };
  const navigateTo = useNavigate();
  console.log("Product data:", product);
  useEffect(() => {
    dispatch(clearProductDetails());
    dispatch(FetchSingleProduct(id));
  }, [dispatch, id]);
  useEffect(() => {
   
    if (authUser) {
      dispatch(fetchWishlist());
    } else {
      console.log("❌ User is NOT logged in, skipping wishlist fetch");
    }
  }, [dispatch, authUser]);
  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-foreground mb-4"></h1>
          <p className="text-muted-foreground">
            the Product You're Looking for does not exist
          </p>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  console.log("Product data:", product);
  console.log("Product reviews:", productReviews);
  console.log(
    "Product rating:",
    product.ratings,
    "Type:",
    typeof product.ratings,
  );
  const HandleCopyUrl = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        toast.success("Url Copy", currentUrl);
      })
      .catch(() => {
        console.log("copy  Fialed Url");
      });
  };
  const handleBuyNow = () => {
    if (!product) {
      toast.error("Product not loaded yet");
      return;
    }
    dispatch(addCart({ product, quantity }));
    navigateTo("/payment");
  };
  
  const isWishListed = Wishlist?.some(
    (item) => item.product_id === product?.id || item.id === product?.id,
  );
  const handleWishlist = () => {
    if (!authUser) {
      toast.error("Please Login to use WishList");
      return;
    }
    if (isWishListed) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(AddWishList(product.id));
    }
  };
  return (
    <>
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <div className="glass-card p-4 mb-4 relative">
                {product.created_at &&
                  Date.now() - new Date(product.created_at).getTime() <
                    30 * 24 * 60 * 60 * 1000 && (
                    <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      NEW
                    </span>
                  )}

                {/* Top Rated badge */}
                {product.rating >= 4.5 && (
                  <span className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-rose-500 text-white text-xs px-2 py-1 rounded font-semibold">
                    Top Rated
                  </span>
                )}
                {product.images?.length > 0 ? (
                  <img
                    className="w-full h-96 object-contain rounded-lg"
                    src={product.images[selectedImage]?.url}
                    alt={product.name}
                  />
                ) : (
                  <div className="w-full glass-card min-h-[418px] text-center flex justify-center items-center p-4 mb-4 animate-pulse">
                    No Image Available
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                {product.images &&
                  product?.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={image?.url}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
              </div>
            </div>
            <div>
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {product.name}
                </h1>
                {/* <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => {
                     const rating = parseFloat(products.rating || products.ratings || 0);
                    return (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    );
                  })}
                  <span className="text-foreground font-medium">
                    {parseFloat(products.rating || products.ratings || 0).toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    ({productReviews?.length}) reviews
                  </span>
                </div> */}
                {/* // ProductDetail.jsx - UPDATE the rating section */}
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => {
                    // Convert string to number: "0.00" → 0
                    const ratingValue = parseFloat(product.ratings || 0);
                    return (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(ratingValue)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    );
                  })}
                  <span className="text-foreground font-medium">
                    {parseFloat(product.ratings || 0).toFixed(1)}
                  </span>
                  <span className="text-muted-foreground">
                    ({productReviews?.length || 0}) reviews
                  </span>
                </div>
                {/* Price */}
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-2xl font-bold text-primary">
                    ${product.price}
                  </span>
                </div>
                {/* Category*/}
                <div className="flex items-center space-x-6  mb-6">
                  <span className="text-muted-foreground">
                    Cateory: {product.category}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      product.stock > 5
                        ? "bg-green-500/20 text-green-600"
                        : product.stock > 0
                          ? "bg-yellow-500/20 text-yellow-600"
                          : "bg-red-500/20 text-red-600"
                    }`}
                  >
                    {product.stock > 5
                      ? "In Stock"
                      : product.stock > 0
                        ? "Limited Stock"
                        : "Out of Stock"}
                  </span>
                </div>
                <div className="glass-card p-6 mb-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-lg font-medium">Quantity:</span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 glass-card hover:glow-on-hover animate-smooth"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-semibold text-lg">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 glass-card hover:glow-on-hover animate-smooth"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={handleAddtoCart}
                      disabled={!product || product.stock === 0}
                      className="flex items-center justify-center space-x-2 py-3 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      disabled={!product || product.stock === 0}
                      onClick={handleBuyNow}
                      className="flex items-center justify-center space-x-2 py-3 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CircleDollarSign className="w-4 h-4" />{" "}
                      <span>Buy Now</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-4 mt-4">
                    <button
                      onClick={handleWishlist}
                      className={`flex items-center space-x-2 animate-smooth ${
                        isWishListed
                          ? "text-red-500"
                          : "text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <Heart
                        className="w-5 h-5"
                        fill={isWishListed ? "red" : "none"}
                      />
                      <span>
                        {isWishListed ? "Wishlisted" : "Add to Wishlist"}
                      </span>
                    </button>
                    
                    <button
                      onClick={HandleCopyUrl}
                      className="flex items-center space-x-2 text-muted-foreground hover:text-primary animate-smooth"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="glass-panel">
            <div className="flex border-b border-[hsla(var(--glass-border))]">
              {["description", "reviews"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-6 font-medium capitalize transition-all ${
                    activeTab === tab
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="p-6">
              {activeTab === "description" && (
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Product Description
                  </h3>
                  <p className="text-muted-foreground loading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
              {activeTab === "reviews" && (
                <>
                  <ReviewsContainer
                    productReviews={productReviews}
                    product={product}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
