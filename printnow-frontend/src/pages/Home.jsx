import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">

      {/* Phone container */}
      <div className="w-[320px] h-[640px] bg-white rounded-[36px] overflow-hidden shadow-2xl relative">

        {/* HERO SECTION */}
        <div className="bg-purple-600 h-[72%] relative flex flex-col items-center justify-center text-white">

          {/* Circle */}
          <div className="absolute -top-16 -left-16 w-[200px] h-[200px] rounded-full bg-white/10"></div>

          {/* Dots */}
          <div className="absolute top-4 right-4 grid grid-cols-6 gap-1">
            {Array.from({ length: 30 }).map((_, i) => (
              <span key={i} className="w-[5px] h-[5px] bg-white/30 rounded-full"></span>
            ))}
          </div>

          {/* Arc */}
          <div className="absolute -bottom-10 -right-10 w-[130px] h-[130px] border-[18px] border-white/20 rounded-full"></div>

          {/* Icon */}
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-3 shadow-lg">
            🖨️
          </div>

          <h1 className="text-2xl font-bold">PrintNow</h1>

          <p className="text-xs text-white/70 text-center max-w-[180px] mt-2">
            Stay organised and efficient with timely, automated print solutions.
          </p>
        </div>

        {/* BOTTOM SECTION */}
        <div className="h-[28%] flex flex-col items-center justify-center gap-4 px-6">

          <button
            onClick={() => navigate("/register")}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold"
          >
            Create Account
          </button>

          <button
            onClick={() => navigate("/login")}
            className="text-gray-500 font-medium"
          >
            Sign in
          </button>

        </div>

      </div>
    </div>
  );
}

export default Home;