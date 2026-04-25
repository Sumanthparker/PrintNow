import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      alert("Registered successfully");
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="bg-gray-300 min-h-screen flex items-center justify-center font-nunito">

      <div className="w-[360px] bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Hero */}
        <div className="bg-[#7c4dbb] flex flex-col items-center justify-center relative py-10 px-8">

          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center mb-4">
            <span className="text-white text-xl">👤</span>
          </div>

          <h1 className="text-white text-4xl font-black mb-1">Register</h1>
          <p className="text-white/70 text-sm mb-10">
            For a better experience!
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-7">

          {/* Email */}
          <div className="mb-4">
            <label className="block text-[#7c4dbb] text-sm font-bold mb-1.5">
              Email ID
            </label>
            <input
              type="email"
              placeholder="your email?"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#e2d4f5] rounded-lg p-3"
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-[#7c4dbb] text-sm font-bold mb-1.5">
              User Name
            </label>
            <input
              type="text"
              placeholder="your name?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-[#e2d4f5] rounded-lg p-3"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-[#7c4dbb] text-sm font-bold mb-1.5">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#e2d4f5] rounded-lg p-3"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-7">
            <label className="block text-[#7c4dbb] text-sm font-bold mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-[#e2d4f5] rounded-lg p-3"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleRegister}
            className="w-full bg-[#7c4dbb] text-white font-bold text-base py-4 rounded-2xl hover:bg-[#6a3da8] active:scale-[0.97] transition-all"
          >
            Register
          </button>

        </div>

      </div>
    </div>
  );
}

export default Register;