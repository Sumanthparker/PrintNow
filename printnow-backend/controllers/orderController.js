const pool = require("../db");
const supabase = require("../utils/supabaseClient");
const generateCode = require("../utils/generateCode");
const pdfParse = require("pdf-parse");

const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { color, pickup_time } = req.body;

    const file = req.file;

    // 🔥 File required check
    if (!file) {
      return res.status(400).json({
        message: "File is required",
      });
    }

    // 🔥 Only PDF allowed
    if (file.mimetype !== "application/pdf") {
      return res.status(400).json({
        message: "Only PDF files are allowed",
      });
    }

    // 🔥 File size limit (10MB)
    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      return res.status(400).json({
        message: "File size must be less than 10MB",
      });
    }

    // 🔥 Pickup time validation
    if (!pickup_time) {
      return res.status(400).json({
        message: "Pickup time is required",
      });
    }

    const pickupDate = new Date(pickup_time);
    const currentDate = new Date();

    // Maximum allowed pickup = next 3 days
    const maxDate = new Date();
    maxDate.setDate(currentDate.getDate() + 3);

    // Must be future time
    if (pickupDate <= currentDate) {
      return res.status(400).json({
        message: "Pickup time must be in the future",
      });
    }

    // Must be within next 3 days
    if (pickupDate > maxDate) {
      return res.status(400).json({
        message: "Pickup time must be within 3 days",
      });
    }
    const originalName = file.originalname;

    // 🔥 Auto-detect PDF pages
    const pdfData = await pdfParse(file.buffer);
    const pages = pdfData.numpages;

    if (!pages || pages <= 0) {
      return res.status(400).json({
        message: "Unable to detect PDF pages",
      });
    }

    // Generate filename
    const fileName = `${Date.now()}-${originalName}`;

    // Upload file to Supabase
    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error(error);
      return res.status(500).json({
        message: "File upload failed",
      });
    }

    // Generate public URL
    const fileUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${fileName}`;

    // 🔥 Generate unique pickup code safely
    let uniqueCode;
    let codeExists = true;

    while (codeExists) {
      uniqueCode = generateCode();

      const existingCode = await pool.query(
        `SELECT id FROM orders WHERE unique_code = $1`,
        [uniqueCode],
      );

      if (existingCode.rows.length === 0) {
        codeExists = false;
      }
    }

    // 🔥 Price calculation
    const pricePerPage = color ? 5 : 2;
    const totalPrice = pages * pricePerPage;

    // Create order
    const orderResult = await pool.query(
      `INSERT INTO orders
       (user_id, pickup_time, unique_code, total_price)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [userId, pickup_time, uniqueCode, totalPrice],
    );

    const orderId = orderResult.rows[0].id;

    // Insert file details
    await pool.query(
      `INSERT INTO order_files
       (order_id, file_url, file_name, pages, color)
       VALUES ($1, $2, $3, $4, $5)`,
      [orderId, fileUrl, originalName, pages, color],
    );

    res.status(201).json({
      message: "Order created successfully",
      order: {
        id: orderId,
        unique_code: uniqueCode,
        status: "pending",
        total_price: totalPrice,
        pages: pages,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};
const verifyOrder = async (req, res) => {
  try {
    // 1) Authorization: only storekeeper
    if (req.user.role !== "storekeeper") {
      return res
        .status(403)
        .json({ message: "Only storekeepers can verify orders" });
    }

    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Pickup code is required" });
    }

    // 2) Find the order
    const orderResult = await pool.query(
      `SELECT id, status FROM orders WHERE unique_code = $1`,
      [code],
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({ message: "Invalid pickup code" });
    }

    const order = orderResult.rows[0];

    // 3) Check status
    if (order.status === "completed") {
      return res.status(400).json({ message: "Order already completed" });
    }

    const orderId = order.id;

    // 4) Get all files for this order
    const filesResult = await pool.query(
      `SELECT file_url FROM order_files WHERE order_id = $1`,
      [orderId],
    );

    // 5) Delete files from Supabase
    const filePaths = filesResult.rows.map((row) => {
      // extract path after /documents/
      const parts = row.file_url.split("/documents/");
      return parts[1];
    });

    if (filePaths.length > 0) {
      const { error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .remove(filePaths);

      if (error) {
        console.error(error);
      }
    }

    // 6) Update order status
    await pool.query(`UPDATE orders SET status = 'completed' WHERE id = $1`, [
      orderId,
    ]);

    res.json({
      message: "Order verified and completed successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT 
  o.id AS order_id,
  o.status,
  o.pickup_time,
  o.created_at,
  o.unique_code, 
  o.total_price,
  f.file_url,
  f.file_name, 
  f.pages,
  f.color
FROM orders o
JOIN order_files f ON o.id = f.order_id
WHERE o.user_id = $1
ORDER BY o.created_at DESC
      `,
      [userId],
    );

    res.json({
      orders: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orderId = req.params.id;

    // Find order and verify ownership
    const orderResult = await pool.query(
      `SELECT id, status FROM orders
       WHERE id = $1 AND user_id = $2`,
      [orderId, userId],
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const order = orderResult.rows[0];

    // Only pending orders can be cancelled
    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Only pending orders can be cancelled",
      });
    }

    // Get file URLs
    const filesResult = await pool.query(
      `SELECT file_url FROM order_files WHERE order_id = $1`,
      [orderId],
    );

    // Extract file paths
    const filePaths = filesResult.rows.map((row) => {
      const parts = row.file_url.split("/documents/");
      return parts[1];
    });

    // Delete files from Supabase
    if (filePaths.length > 0) {
      const { error } = await supabase.storage
        .from(process.env.SUPABASE_BUCKET)
        .remove(filePaths);

      if (error) {
        console.error(error);
      }
    }

    // Update status instead of deleting row
    await pool.query(
      `UPDATE orders
       SET status = 'cancelled'
       WHERE id = $1`,
      [orderId],
    );

    res.json({
      message: "Order cancelled successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};
const getOrderById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orderId = req.params.id;

    const result = await pool.query(
      `
      SELECT 
        o.id AS order_id,
        o.status,
        o.pickup_time,
        o.created_at,
        o.total_price,
        f.file_url,
        f.file_name,
        f.pages,
        f.color
      FROM orders o
      JOIN order_files f ON o.id = f.order_id
      WHERE o.id = $1 AND o.user_id = $2
      `,
      [orderId, userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      order: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  createOrder,
  verifyOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
};
