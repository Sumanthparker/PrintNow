import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import Store from "./pages/Store";
import Upload from "./pages/Upload";
import Orders from "./pages/Orders";
import Success from "./pages/Success";
import Home from "./pages/Home";
import Register from "./pages/Register";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="Register" element={<Register/>}/>

        {/* User */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/orders" element={<Orders />} />

        {/* Store */}
        <Route path="/store" element={<Store />} />

        {/* Success */}
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;