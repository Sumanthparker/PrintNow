const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");


const app = express();

const orderRoutes = require("./routes/orderRoutes");

const storeRoutes = require("./routes/storeRoutes");


app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/store", storeRoutes);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "PrintNow Backend v2 Running 🚀",
      databaseTime: result.rows[0].now
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Database connection failed");
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});