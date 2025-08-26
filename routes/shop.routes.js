const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

const {
  createShop,
  getShops,
  getShop,
  updateShop,
  deleteShop,
} = require("../controllers/shop.controller");

router.post("/", auth, role(["owner"]),  createShop);
router.get("/", getShops);
router.get("/:id", getShop);
router.patch("/:id", auth, role(["owner"]),updateShop);
router.delete("/:id", auth, role(["owner"]), deleteShop);

module.exports = router;