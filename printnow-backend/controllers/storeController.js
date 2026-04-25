const pool = require("../db");

const getStoreOrders = async (req, res) => {
  try {
    if (req.user.role !== "storekeeper") {
      return res.status(403).json({ message: "Access denied" });
    }

    const result = await pool.query(
      `
      SELECT
        o.id,
        o.pickup_time,
        o.unique_code,
        f.file_name,
        f.file_url,
        f.pages,
        f.color
      FROM orders o
      JOIN order_files f ON o.id = f.order_id
      WHERE o.status = 'pending'
      ORDER BY o.pickup_time ASC
      `,
    );

    res.json({
      orders: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getStoreOrders };
