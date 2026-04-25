import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col items-center justify-center text-white px-4">

      {/* Title */}
      <h1 className="text-3xl font-bold mb-8 text-purple-400">
        PrintNow
      </h1>

      {/* Main Card */}
      <div className="bg-[#1e1e2f] p-6 rounded-2xl w-full max-w-sm text-center shadow-lg">

        <h2 className="text-xl font-semibold mb-2">
          Welcome, {user?.name || "User"} 👋
        </h2>

        <p className="text-sm text-gray-400 mb-6">
          Upload, track and collect your documents easily
        </p>

        {/* Upload Button */}
        <button
          onClick={() => navigate("/upload")}
          className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg mb-4 font-medium transition"
        >
          Upload Document
        </button>

        {/* Orders Button */}
        <button
          onClick={() => navigate("/orders")}
          className="w-full bg-gray-700 hover:bg-gray-600 p-3 rounded-lg mb-4 font-medium transition"
        >
          My Orders
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 p-3 rounded-lg font-medium transition"
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default Dashboard;