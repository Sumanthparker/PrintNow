const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const { getStoreOrders } = require("../controllers/storeController");

router.get("/orders", authenticate, getStoreOrders);

module.exports = router;