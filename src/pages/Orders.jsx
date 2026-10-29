import React, { useEffect, useState } from "react";
import { Filter, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchMyOrders } from "../store/slices/orderSlice";
import OrderModal from "../components/Modal/OrderModal";

const Orders = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    order: null,
  });
  const [statusFilter, setStatusFilter] = useState("All");
  const { myOrders } = useSelector((state) => state.order);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const filterOrders = myOrders.filter(
    (order) => statusFilter === "All" || order.order_status === statusFilter,
  );
  const getStatusIcons = (status) => {
    switch (status) {
      case "Processing":
        return <Package className="w-5 h-5 text-yellow-500" />;
      case "Shipped":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "Delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-yellow-500" />;
    }
  };
  const getStatusColour = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-500/20 text-yellow-400";
      case "Shipped":
        return "bg-blue-500/20 text-blue-400";
      case "Delivered":
        return "bg-green-500/20 text-green-400";
      case "Cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };
  const statusArray = [
    "All",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const { authUser } = useSelector((state) => state.auth);
  const navigateTo = useNavigate();
  if (!authUser) return navigateTo("/products");
  const openModal = (order, type) => {
    setModalState({
      isOpen: true,
      type: type,
      order: order,
    });
  };
  const CloseModal = (order, type) => {
    setModalState({
      isOpen: false,
      type: null,
      order: null,
    });
  };
  return (
    <>
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              My Order
            </h1>
            <p className="text-muted-foreground">
              Track and Manage Your Order History.
            </p>
          </div>

          {/* Status filter */}
          <div className="glass-card p-4 mb-8">
            <div className="flex items-center space-x-4 flex-wrap">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-primary" />
                <span className="font-medium">Filter By Status</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {statusArray.map((status) => {
                  return (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${statusFilter === status ? "gradient-primary text-primary-foreground" : "glass-card hover:glow-on-hover text-foreground"}`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order List */}

          {filterOrders.length === 0 ? (
            <div className="text-center glass-panel mx-auto max-w-md">
              <Package className="text-muted-foreground w-16 h-16 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2 ">
                {" "}
                No Orders Found
              </h2>
              <p className="text-muted-foreground">
                {statusFilter === "All"
                  ? "You haven't placed any orders yet"
                  : `No Orders with status "${statusFilter}" found`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filterOrders.map((orders) => {
                return (
                  <div className="glass-card p-6" key={orders.id}>
                    {/* Orders Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                      <div className="">
                        <h3 className="text-lg text-foreground font-semibold mb-1">
                          Orders:#{orders.id}
                        </h3>
                        <p className="text-muted-foreground">
                          Placed on{""}
                          {new Date(orders.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-4">
                          {getStatusIcons(orders.order_status)}
                          <span
                            className={`px-3 py-1 rounded text-sm font-medium capitalize ${getStatusColour(orders.order_status)}`}
                          >
                            {orders.order_status}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-xl font-bold text-primary">
                            ${orders.total_price}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Order item */}
                    <div className="space-y-4">
                      {orders.order_items.map((item) => {
                        return (
                          <div
                            key={item.product_id}
                            className="flex items-center space-x-4 p-4 bg-secondary/50 rounded-lg"
                          >
                            <img
                              src={item.image}
                              alt="item.title"
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground truncate">
                                {item.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-foreground">
                                ${item.price}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Order action */}
                    <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-[hsla(var(--glass-border))]">
                      <button
                        onClick={() => openModal(orders, "details")}
                        className="px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => openModal(orders, "track")}
                        className="px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm"
                      >
                        Track Order
                      </button>
                      {/* {orders.status === "Delivered" && ( */}
                      {orders.order_items?.map((item) => (
                        <div key={item.product_id}>
                          <Link
                            to={`/product/${orders.order_items[0]?.product_id}`}
                            className="px-4 py-2 me-2 glass-card hover:glow-on-hover animate-smooth text-sm"
                          >
                            Write Review
                          </Link>
                          <button className="px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm">
                            Reorder
                          </button>
                        </div>
                      ))}
                      {/* )} */}

                      {orders.status === "Processing" && (
                        <button className="px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm text-destructive">
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* // Modal Component */}
      <OrderModal
        isOpen={modalState.isOpen}
        onClose={CloseModal}
        order={modalState.order}
        type={modalState.type}
      />
      ;
    </>
  );
};

export default Orders;
