import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // 🔥 role-based redirect
      if (user.role?.trim().toLowerCase() === "storekeeper") {
        navigate("/store");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="bg-gray-300 min-h-screen flex items-center justify-center font-nunito">

      {/* Card */}
      <div className="w-[360px] bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Hero */}
        <div className="bg-[#7c4dbb] flex flex-col items-center justify-center relative py-10 px-8">

          {/* Icon */}
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center mb-4">
            <span className="text-white text-xl">👤</span>
          </div>

          <h1 className="text-white text-4xl font-black mb-1">Login</h1>
          <p className="text-white/70 text-sm mb-6">
            For a better experience!
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">

          {/* Email */}
          <div className="mb-5">
            <label className="block text-[#7c4dbb] text-sm font-bold mb-1.5">
              Email
            </label>
            <input
              type="text"
              placeholder="example@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-purple-200 rounded-lg p-3"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-[#7c4dbb] text-sm font-bold mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-purple-200 rounded-lg p-3"
            />
          </div>

          

          {/* Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-[#7c4dbb] text-white font-bold text-base py-4 rounded-2xl hover:bg-[#6a3da8] active:scale-[0.97] transition-all"
          >
            Login
          </button>

        </div>
      </div>
    </div>
  );
}

export default Login;