const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createOrder,
  verifyOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
} = require("../controllers/orderController");

router.post("/", authenticate, upload.single("file"), createOrder);

// only storekeeper can verify orders
router.post("/verify", authenticate, verifyOrder);

router.get("/", authenticate, getUserOrders);
router.get("/:id", authenticate, getOrderById);

// cancel order
router.patch("/:id/cancel", authenticate, cancelOrder);

module.exports = router;
