import { useEffect, useState } from "react";
import axios from "axios";

function Store() {
  const [orders, setOrders] = useState([]);
  const [enteredCode, setEnteredCode] = useState("");

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/store/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data.orders);

    } catch (err) {
      console.error(err);
      
    }
  };

  const verifyOrder = async () => {
    if (!enteredCode.trim()) {
      alert("Please enter customer pickup code");
      return;
    }

    const confirmAction = window.confirm(
      "Confirm this order completion?"
    );

    if (!confirmAction) return;

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/orders/verify",
        { code: enteredCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order verified successfully");
      setEnteredCode("");
      fetchOrders();

    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Verification failed"
      );
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] px-4 py-8 text-white">
      <div className="max-w-3xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-purple-400">
            Storekeeper Dashboard
          </h2>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Manual Code Verification */}
        <div className="bg-[#1e1e2f] rounded-2xl p-5 mb-8 shadow-lg">
          <h3 className="text-lg font-semibold mb-4 text-purple-300">
            Verify Customer Pickup
          </h3>

          <input
            type="text"
            placeholder="Enter customer pickup code"
            value={enteredCode}
            onChange={(e) => setEnteredCode(e.target.value.toUpperCase())}
            className="w-full p-3 rounded-lg bg-[#2c2c3f] border border-white/10 outline-none mb-4"
          />

          <button
            onClick={verifyOrder}
            className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg font-medium"
          >
            Verify & Complete Order
          </button>
        </div>

        {/* Pending Orders */}
        {orders.length === 0 ? (
          <p className="text-center text-gray-400">
            No pending orders
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-[#1e1e2f] rounded-2xl p-5 mb-5 shadow-lg"
            >
              <p><b>File:</b> {order.file_name}</p>
              <p><b>Pages:</b> {order.pages}</p>
              <p><b>Print Type:</b> {order.color ? "Color" : "B/W"}</p>
              <p><b>Pickup Time:</b> {new Date(order.pickup_time).toLocaleString()}</p>

              <a
                href={order.file_url}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-3 text-purple-400 hover:text-purple-300"
              >
                Open PDF
              </a>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default Store;