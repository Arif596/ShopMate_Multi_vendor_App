import { Search, Sparkles, Star, Filter } from "lucide-react";
import { categories } from "../data/products";
import ProductCard from "../components/Products/ProductCard";
import Pagination from "../components/Products/Pagination";
import AISearchModal from "../components/Products/AISearchModal";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchAllProduct } from "../store/slices/productSlice";
import { toggleAIModal } from "../store/slices/popupSlice";

const Products = () => {
  const { products, totalProducts } = useSelector((state) => state.product);
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const query = useQuery();
  const searchTerm = query.get("search");
  const searchCategory = query.get("category");
  const [searchQuery, setSearchQuery] = useState(searchTerm || "");
  const [selectCategory, setSelectCategory] = useState(searchCategory || "");
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedRating, setSelectRating] = useState(0);
  const [availability, setAvailability] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      fetchAllProduct({
        category: selectCategory,
        price: `${priceRange[0]}-${priceRange[1]}`,
        search: searchQuery,
        rating: selectedRating,
        availability: availability,
        page: currentPage,
      }),
    );
  }, [
    dispatch,
    selectCategory,
    priceRange[0],
    priceRange[1],
    searchQuery,
    selectedRating,
    availability,
    currentPage,
  ]);

  // Total Pages
  const totalPage = Math.ceil(totalProducts / 10);

  return (
    <>
      <div className="min-h-screen pt-20">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Mobile Filter Toggle */}
            <button
              className="lg:hidden mb-4 p-3 glass-card hover:glow-on-hover animate-smooth flex items-center space-x-2"
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            >
              <Filter className="w-5 h-5" />
              <span>Filter</span>
            </button>
            {/* Sidear Filter */}
            <div
              className={`lg:block ${
                isMobileFilterOpen ? "block" : "hidden"
              } w-full lg:w-80 space-y-6`}
            >
              <div className="glass-panel">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Filters
                </h2>
                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    Price Range
                  </h3>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min={0}
                      max={1000000}
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], parseInt(e.target.value)])
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                {/* Rating  */}
                {/* <div className="mb-6">
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    Rating
                  </h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => {
                      return (
                        <button
                          key={rating}
                          onClick={() =>
                            setSelectRating(
                              selectedRating === rating ? 0 : rating
                            )
                          }
                          className={`flex items-center space-x-2 w-full p-2 rounded ${
                            selectedRating === rating
                              ? "bg-primary/20"
                              : "hover:bg-secondary"
                          }`}
                        >
                          
                          {[...Array(5)].map((_, i) => {
                            const rating = Number(products.ratings) || 0;
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
                        </button>
                      );
                    })}
                  </div>
                </div> */}
                {/* // Products.js - FIX the rating filter section */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    Rating
                  </h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() =>
                          setSelectRating(
                            selectedRating === rating ? 0 : rating,
                          )
                        }
                        className={`flex items-center space-x-2 w-full p-2 rounded ${
                          selectedRating === rating
                            ? "bg-primary/20"
                            : "hover:bg-secondary"
                        }`}
                      >
                        {/* This shows stars for the FILTER rating, not product rating */}
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating ? "text-yellow-400 " : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-muted-foreground ml-2">
                          & above
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Availability */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    Availability
                  </h3>
                  <div className="space-y-2">
                    {["in-stock", "limited", "out-of-stock"].map((status) => {
                      return (
                        <button
                          key={status}
                          onClick={() =>
                            setAvailability(
                              availability === status ? "" : status,
                            )
                          }
                          className={`w-full p-2 text-left rounded ${
                            availability === status
                              ? "bg-primary/20"
                              : "hover:bg-secondary"
                          }`}
                        >
                          {status === "in-stock"
                            ? "In stcok"
                            : status === "limited"
                              ? "Limited Stock"
                              : "Out of stock"}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Category */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-foreground mb-3">
                    Category
                  </h3>
                  <button
                    onClick={() => setSelectCategory("")}
                    className={`w-full p-2 text-left rounded ${
                      !selectCategory ? "bg-primary/20" : "hover:bg-secondary"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`w-full p-2 text-left rounded ${
                        selectCategory === category.name
                          ? "bg-primary/20"
                          : "hover:bg-secondary"
                      }`}
                      onClick={() => setSelectCategory(category.name)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-8 flex max-[440px]:flex-col items-center gap-2">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground " />
                  <input
                    type="text"
                    placeholder="Search Product...."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none text-foreground placeholder-muted-foreground"
                  />
                </div>
                <button
                  className="relative inline-flex items-center justify-center p-0.5 
                overflow-hidden text-sm font-medium text-gray-900 rounded-lg group 
                bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 
                group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 
                focus:outline-none focus:ring-purple-200 
                dark:focus:ring-purple-800 max-[440px]:min-w-full min-w-[132px]"
                  onClick={() => dispatch(toggleAIModal())}
                >
                  <span
                    className="relative w-full px-5 py-3 transition-all ease-in duration-75 
                bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent 
                group-hover:dark:bg-transparent flex justify-center items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>AI Search</span>
                  </span>
                </button>
              </div>

              {/* Show Product  */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {/*   Pagination */}
              {totalPage > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPage}
                  onPageChange={setCurrentPage}
                />
              )}
              {/* No Result */}
              {products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No Products Found Matching Your Criteria
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* AI Search Modal */}
        <AISearchModal />
      </div>
    </>
  );
};

export default Products;
