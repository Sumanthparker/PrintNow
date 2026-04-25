import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "https://printnow-backend-nbe7.onrender.com/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch orders");
    }
  };

  const handleCancel = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `https://printnow-backend-nbe7.onrender.com/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order cancelled successfully");
      fetchOrders();

    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Cancel failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] px-4 py-8 text-white">
      <div className="max-w-2xl mx-auto">

        <h2 className="text-2xl font-bold text-center text-purple-400 mb-8">
          My Orders
        </h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-400">
            No orders found
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-[#1e1e2f] rounded-2xl p-5 mb-5 shadow-lg"
            >
              <p><b>Status:</b> {order.status}</p>
              <p><b>File:</b> {order.file_name}</p>
              <p><b>Pages:</b> {order.pages}</p>
              <p><b>Print Type:</b> {order.color ? "Color" : "B/W"}</p>
              <p><b>Total Price:</b> ₹{order.total_price}</p>
              <p><b>Pickup Time:</b> {new Date(order.pickup_time).toLocaleString()}</p>
              <p><b>Pickup Code:</b> {order.unique_code}</p>

              {order.status === "pending" && (
                <button
                  onClick={() => handleCancel(order.order_id)}
                  className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default Orders;