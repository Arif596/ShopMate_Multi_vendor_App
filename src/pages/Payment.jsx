import { useState, useEffect } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../components/PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { PlaceOrders } from "../store/slices/orderSlice";

const Payment = () => {
  const { authUser } = useSelector((state) => state.auth);
  const navigateTo = useNavigate();
  if (!authUser) return navigateTo("/product");
  const [stripePromise, setStripPromise] = useState(null);
  useEffect(() => {
    loadStripe(
      "pk_test_51Sabx5Lh3G3mWSWEvqOn8YEtfTUZUs8uDxeaoMTRreRJII4ZWUHAVcNj8NlMDIffu9bH3c3WDo2527GZEcO9MElH00etcQIXIM",
    )
      .then((stripe) => setStripPromise(stripe))
      .catch((err) => console.log(err));
  }, []);
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { orderStep } = useSelector((state) => state.order);
  const [shippingDetail, setShippingDetail] = useState({
    fullName: "",
    state: "Lahore",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    country: "Pakistan",
  });
  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  let totalWithTax = total + total * 0.18;
  if (total > 50) {
    totalWithTax += 2;
  }
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("full_name", shippingDetail.fullName);
    formData.append("state", shippingDetail.state);
    formData.append("phone", shippingDetail.phone);
    formData.append("address", shippingDetail.address);
    formData.append("city", shippingDetail.city);
    formData.append("pincode", shippingDetail.zipCode);
    formData.append("country", shippingDetail.country);
    formData.append("orderItem", JSON.stringify(cart));
    dispatch(PlaceOrders(formData));
  };
  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center glass-panel max-w-md">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            No Item in Cart
          </h1>
          <p className="text-muted-foreground mb-8">
            Add some items to your cart before processing to CheckOut
          </p>
          <Link
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg text-primary-foreground gradient-primary hover:glow-on-hover animate-smooth font-semibold"
            to={"/products"}
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
              <Link
                to={"/cart"}
                className="p-2 glass-card hover:glow-on-hover animate-smooth"
              >
                <ArrowLeft className="w-5 h-5 text-primary" />
              </Link>
            </div>
          </div>
          {/* Progress Step */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              {/* Step 1 */}
              <div
                className={`flex items-center space-x-2 ${orderStep >= 1 ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-8 h-8 rounded flex items-center justify-center ${orderStep >= 1 ? "gradient-primary text-primary-foreground" : "bg-secondary"}`}
                >
                  {orderStep > 1 ? <Check className="w-5 h-5" /> : "1"}
                </div>
                <span className="font-medium">Details</span>
              </div>
              <div
                className={`w-12 h-0 ${orderStep >= 2 ? "bg-primary" : "bg-border"}`}
              />
              {/* Step 2 */}
              <div
                className={`flex items-center space-x-2 ${orderStep >= 2 ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-8 h-8 rounded flex items-center justify-center ${orderStep >= 2 ? "gradient-primary text-primary-foreground" : "bg-secondary"}`}
                >
                  2
                </div>
                <span className="font-medium">Payment</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 justify-center">
              {orderStep === 1 ? (
                // Step 1 User Detail
                <form onSubmit={handlePlaceOrder} className="glass-panel">
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Shipping Information
                  </h2>
                  <div className="mb-6">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name*
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingDetail.fullName}
                        onChange={(e) =>
                          setShippingDetail({
                            ...shippingDetail,
                            fullName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        State*
                      </label>
                      <select
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground"
                        value={shippingDetail.state}
                        onChange={(e) =>
                          setShippingDetail({
                            ...shippingDetail,
                            state: e.target.value,
                          })
                        }
                      >
                        <option value="Karachi">Karachi</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Sindh">Sindh</option>
                        <option value="Balochistan">Balochistan</option>
                        <option value="Khyber Pakhtunkhwa(KPK)">
                          Khyber Pakhtunkhwa(KPK)
                        </option>
                        <option value="Azad Kashmir(AJK)">
                          Azad Kashmir(AJK)
                        </option>
                        <option value="Gilgit Baltistan(GB)">
                          Gilgit Baltistan(GB)
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone*
                      </label>
                      <input
                        type="telephone"
                        required
                        value={shippingDetail.phone}
                        onChange={(e) =>
                          setShippingDetail({
                            ...shippingDetail,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Address*
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingDetail.address}
                        onChange={(e) =>
                          setShippingDetail({
                            ...shippingDetail,
                            address: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        City*
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingDetail.city}
                        onChange={(e) =>
                          setShippingDetail({
                            ...shippingDetail,
                            city: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Zip Code*
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingDetail.zipCode}
                        onChange={(e) =>
                          setShippingDetail({
                            ...shippingDetail,
                            zipCode: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Country*
                      </label>
                      <select
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground"
                        value={shippingDetail.country}
                        onChange={(e) =>
                          setShippingDetail({
                            ...shippingDetail,
                            country: e.target.value,
                          })
                        }
                      >
                        <option value="Pakistan">Pakistan</option>
                      </select>
                    </div>
                  </div>
                  <button className="w-full py-3 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth font-semibold">
                    Continu to Payment
                  </button>
                </form>
              ) : (
                <>
                  <Elements stripe={stripePromise}>
                    <PaymentForm />
                  </Elements>
                </>
              )}
            </div>
            {/* Order Summery */}
            <div className="lg:col-span-1">
              <div className="glass-panel sticky top-24">
                <h2 className="text-xl font-semibold text-foreground">
                  Order Summery
                </h2>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => {
                    return (
                      <div
                        className="flex items-center space-x-3"
                        key={item.product.id}
                      >
                        <img
                          src={item.product.images[0].url}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.product.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-semibold">
                          ${Number(item.product.price) * item.quantity}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <div className="space-y-2 border-t border-[hsla(var(--glass-border))] pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sub Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-semibold text-green-500">
                      {totalWithTax <= 50 ? "free" : "$2"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{(total * 0.18).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">
                      {(total * 0.18).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
