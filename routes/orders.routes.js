const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

const {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orders.controller");

router.post("/", auth, role(["owner","client"]), createOrder);
router.get("/", auth, getOrders);
router.get("/:id", auth, getOrder);
router.patch("/:id", auth, role(["owner"]), updateOrder);
router.delete("/:id", auth, role(["owner"]), deleteOrder);

module.exports = router;