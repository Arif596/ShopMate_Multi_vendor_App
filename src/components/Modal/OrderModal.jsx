import React from "react";
import { X, Package, Truck, CheckCircle, XCircle, CreditCard, Star } from "lucide-react";

const OrderModal = ({ isOpen, onClose, order, type }) => {
  if (!isOpen) return null;

  const getOrderSteps = () => {
    const steps = [
      { name: "Processing", icon: Package, status: "Processing" },
      { name: "Shipped", icon: Truck, status: "Shipped" },
      { name: "Delivered", icon: CheckCircle, status: "Delivered" },
    ];

    if (order.order_status === "Cancelled") {
      return [
        { name: "Processing", icon: Package, status: "Processing" },
        { name: "Cancelled", icon: XCircle, status: "Cancelled" },
      ];
    }

    return steps;
  };

  const getCurrentStepIndex = () => {
    const statusMap = {
      Processing: 0,
      Shipped: 1,
      Delivered: 2,
      Cancelled: 1,
    };
    return statusMap[order.order_status] || 0;
  };

  const getPaymentStatus = () => {
    // Check payment_status field from payments table
    const status = order.payment_status || "Pending";
    
    if (status === "Paid") {
      return { status: "Paid", color: "green", icon: "✓" };
    } else if (status === "Failed") {
      return { status: "Failed", color: "red", icon: "✗" };
    } else if (order.order_status === "Cancelled") {
      return { status: "Cancelled", color: "red", icon: "✗" };
    } else {
      return { status: "Pending", color: "yellow", icon: "⏳" };
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-600 text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  const steps = getOrderSteps();
  const currentStepIndex = getCurrentStepIndex();
  const paymentStatus = getPaymentStatus();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4 scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="glass-card p-6 rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              {type === "track" ? "🚚 Track Order" : "📦 Order Details"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Order Info */}
          <div className="mb-6 p-4 bg-white/5 rounded-lg">
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-mono text-xs sm:text-sm break-all">
              {order.id}
            </p>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="font-semibold text-lg text-primary">
                  ${order.total_price}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="text-sm">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Payment Status */}
            <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium">Payment Status</span>
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                    paymentStatus.color === "green"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : paymentStatus.color === "yellow"
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                  }`}
                >
                  <span className="text-sm font-semibold">
                    {paymentStatus.icon} {paymentStatus.status}
                  </span>
                </div>
              </div>
              
              {/* Payment Details */}
              <div className="mt-3 space-y-1">
                {order.payment_type && (
                  <p className="text-xs text-muted-foreground">
                    Payment Method: <span className="text-foreground">{order.payment_type}</span>
                  </p>
                )}
                {order.payment_intent_id && (
                  <p className="text-xs text-muted-foreground">
                    Transaction ID: <span className="text-foreground font-mono">{order.payment_intent_id}</span>
                  </p>
                )}
                {order.payment_created_at && (
                  <p className="text-xs text-muted-foreground">
                    {paymentStatus.status === "Paid" ? "Paid" : "Initiated"} on:{" "}
                    <span className="text-foreground">
                      {new Date(order.payment_created_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Track Order Section */}
          {type === "track" && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-6">Order Status</h3>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-white/20" />
                <div
                  className="absolute left-6 top-8 w-0.5 bg-gradient-to-b from-blue-500 to-blue-600 transition-all duration-700 ease-in-out"
                  style={{
                    height: `${((currentStepIndex / (steps.length - 1)) * 100)}%`,
                  }}
                />

                {/* Steps */}
                <div className="space-y-8">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isCompleted = index <= currentStepIndex;
                    const isCancelled =
                      step.status === "Cancelled" &&
                      order.order_status === "Cancelled";

                    return (
                      <div
                        key={index}
                        className="relative flex items-start animate-smooth"
                      >
                        {/* Icon */}
                        <div
                          className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500 ${
                            isCompleted
                              ? isCancelled
                                ? "bg-red-500 border-red-500 shadow-lg shadow-red-500/50"
                                : "bg-blue-500 border-blue-500 shadow-lg shadow-blue-500/50"
                              : "bg-background border-white/20"
                          }`}
                        >
                          <StepIcon
                            className={`w-6 h-6 transition-all duration-300 ${
                              isCompleted ? "text-white" : "text-muted-foreground"
                            }`}
                          />
                        </div>

                        {/* Content */}
                        <div className="ml-4 flex-1">
                          <h4
                            className={`font-semibold text-lg ${
                              isCompleted
                                ? isCancelled
                                  ? "text-red-400"
                                  : "text-blue-400"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step.name}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {isCompleted
                              ? index === currentStepIndex
                                ? "✨ Current Status"
                                : "✓ Completed"
                              : "⏳ Pending"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Info */}
              {order.shipping_info && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Shipping Address
                  </h4>
                  <p className="text-sm font-medium">
                    {order.shipping_info.full_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.shipping_info.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.shipping_info.city}, {order.shipping_info.state}{" "}
                    {order.shipping_info.pincode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.shipping_info.country}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    📞 {order.shipping_info.phone}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* View Details Section */}
          {type === "details" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.order_items?.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 border border-white/10">
                      {/* Product Image */}
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.title}
                        className="w-20 h-20 object-cover rounded-lg shadow-lg"
                      />

                      {/* Product Info */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-blue-400 mt-1">
                          ${item.price} × {item.quantity} = $
                          {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Product Review (if exists) */}
                    {item.review && (
                      <div className="ml-4 mt-2 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold">Your Review</span>
                          </div>
                          {renderStars(item.review.rating)}
                        </div>
                        <p className="text-sm text-foreground italic">
                          "{item.review.comment}"
                        </p>
                        {item.review.created_at && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Posted on:{" "}
                            {new Date(item.review.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg space-y-2 border border-purple-500/20">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>
                    $
                    {(
                      order.total_price -
                      order.total_price * order.tax_price -
                      order.shipping_price
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Tax ({(order.tax_price * 100).toFixed(0)}%)
                  </span>
                  <span>${(order.total_price * order.tax_price).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${order.shipping_price}</span>
                </div>
                <div className="border-t border-white/10 pt-2 mt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${order.total_price}</span>
                </div>
              </div>

              {/* Shipping Info in Details */}
              {order.shipping_info && (
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Delivery Address
                  </h4>
                  <p className="text-sm font-medium">
                    {order.shipping_info.full_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.shipping_info.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.shipping_info.city}, {order.shipping_info.state}{" "}
                    {order.shipping_info.pincode}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.shipping_info.country}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    📞 {order.shipping_info.phone}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 glass-card hover:glow-on-hover animate-smooth font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;