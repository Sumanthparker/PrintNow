import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Upload() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [color, setColor] = useState(false);
  const [pickup_time, setPickupTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }
    if (!pickup_time) {
      alert("Please select a pickup time");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("color", color);
      formData.append("pickup_time", pickup_time);

      const res = await axios.post("http://localhost:5000/api/orders", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/success", {
        state: {
          code: res.data.order.unique_code,
          fileName: file.name,
          pages: res.data.order.pages,
          total_price: res.data.order.total_price,
          color,
          pickup_time,
        },
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center px-4">
      <div className="bg-[#1e1e2f] rounded-2xl p-6 w-full max-w-sm border border-white/[0.08]">

        <h2 className="text-white text-lg font-medium text-center mb-6">
          Upload document
        </h2>

        {/* File Drop Zone */}
        <div className="mb-4">
          <label className="block text-[11px] text-white/40 uppercase tracking-widest mb-2">
            PDF file
          </label>
          <label
            className="flex flex-col items-center gap-2 border border-dashed border-white/15 rounded-xl p-4 cursor-pointer bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
          >
            <svg
              width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            <span className="text-[13px] text-white/40">
              {file ? (
                <span className="text-violet-400">{file.name}</span>
              ) : (
                "Click to select a PDF"
              )}
            </span>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>
        </div>

        {/* Color Print Toggle */}
        <div
          onClick={() => setColor(!color)}
          className={`flex items-center gap-3 rounded-xl px-3.5 py-3 mb-4 cursor-pointer transition-colors ${
            color ? "bg-violet-500/10" : "bg-white/[0.04]"
          }`}
        >
          <div
            className={`w-[18px] h-[18px] rounded-[5px] flex items-center justify-center flex-shrink-0 transition-all border ${
              color
                ? "bg-violet-500 border-violet-500"
                : "bg-transparent border-white/20"
            }`}
          >
            {color && (
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
                <polyline points="2,6 5,9 10,3" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-[14px] text-white/85 font-medium leading-none mb-1">
              Color print
            </p>
            <p className="text-[12px] text-white/35">
              Black &amp; white by default
            </p>
          </div>
        </div>

        {/* Pickup Time */}
        <div className="mb-5">
          <label className="block text-[11px] text-white/40 uppercase tracking-widest mb-2">
            Pickup time
          </label>
          <input
            type="datetime-local"
            value={pickup_time}
            onChange={(e) => setPickupTime(e.target.value)}
            className="w-full bg-[#2c2c3f] border border-white/10 rounded-xl px-3 py-2.5 text-white/75 text-sm outline-none focus:border-violet-500/50 transition-colors [color-scheme:dark]"
          />
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl py-3 text-[15px] font-medium transition-colors"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

      </div>
    </div>
  );
}

export default Upload;