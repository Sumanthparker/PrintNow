import { useLocation, useNavigate } from "react-router-dom";

function Success() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    code,
    fileName,
    pages,
    total_price,
    color,
    pickup_time
  } = location.state || {};

  return (
    <div className="min-h-screen bg-purple-500 flex items-center justify-center px-4">

      <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-lg">

        <h2 className="text-xl font-bold text-purple-600 mb-4">
          Order Receipt
        </h2>

        <div className="text-left text-gray-700 space-y-2 text-sm">
          <p><b>Document Name:</b> {fileName}</p>
          <p><b>Print Type:</b> {color ? "Colour" : "B/W"}</p>
          <p><b>Pages:</b> {pages}</p>
          <p><b>Total Price:</b> ₹{total_price}</p>
          <p><b>Pickup Time:</b> {new Date(pickup_time).toLocaleString()}</p>
        </div>

        {/* Payment Status */}
        <div className="bg-purple-500 text-white py-2 rounded-lg mt-4">
          Payment Pending (Gateway Later)
        </div>

        <hr className="my-4" />

        {/* Pickup Code */}
        <h3 className="text-lg font-semibold text-purple-600">
          Pickup Code
        </h3>

        <div className="border border-purple-400 rounded-lg p-3 mt-2 text-xl font-bold text-purple-600">
          #{code}
        </div>

        <p className="text-xs text-gray-500 mt-2">
          Show this code at the store to collect your printout
        </p>

        {/* Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-5 w-full bg-purple-600 text-white py-2 rounded-lg"
        >
          Go to Dashboard
        </button>

      </div>
    </div>
  );
}

export default Success;