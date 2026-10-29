import { useRef } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addCart } from "../../store/slices/cartSlice";

const ProductSlider = ({ title, products = [] }) => {
  const scrollRef = useRef(null);
  const dispatch = useDispatch();

  // horizontal scroll
  const scroll = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  // add to cart
  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addCart({ product, quantity: 1 }));
  };

  if (!products.length) return null;

  return (
    <section className="py-16">
      {/* Title + Arrows */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-foreground">{title}</h2>

        <div className="flex gap-2">
          <button onClick={() => scroll("left")} className="glass-card p-2">
            <ChevronLeft />
          </button>
          <button onClick={() => scroll("right")} className="glass-card p-2">
            <ChevronRight />
          </button>
        </div>
      </div>
      {/* Slider */}
      <div
        ref={scrollRef}
        className="flex space-x-6 overflow-x-auto scrollbar-hide">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative w-80 flex-shrink-0 glass-card group">
            {/* Product Link */}
            <Link to={`/product/${product.id}`}>
              <div className="relative">
                {/* Image */}
                <img
                  src={product.images?.[0]?.url || "/placeholder.png"}
                  alt={product.name}
                  className="h-48 w-full object-contain"
                />

                {/* NEW badge */}
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
              </div>

              {/* Product Info */}
              <div className="mt-4 space-y-1">
                <h3 className="font-semibold text-foreground line-clamp-1">
                  {product.name}
                </h3>

                <p className="text-lg font-semibold mb-2  text-muted-foreground group-hover:text-primary transition-colors">
                  Rs {product.price}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 text-yellow-400 mb-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(product.rating)
                          ? "fill-yellow-400"
                          : "fill-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-foreground ml-1">
                    {product.rating?.toFixed(1) || "0.0"}
                  </span>
                </div>
                {/* Availability */}
                <div>
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
                      ? "Low Stock"
                      : "Out of Stock"}
                  </span>
                </div>
              </div>
            </Link>

            {/* Add to Cart */}
            <button
              onClick={(e) => handleAddToCart(e, product)}
              disabled={product.stock === 0}
              className="absolute bottom-3 right-3 p-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 glass-card"
            >
              <ShoppingCart className="w-5 h-5 text-primary" />
              Add
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductSlider;
