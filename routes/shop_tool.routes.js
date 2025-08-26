const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");

const {
  createShopTool,
  getShopTools,
  getShopTool,
  updateShopTool,
  deleteShopTool,
} = require("../controllers/shop_tool.controller");

router.post("/", auth, role(["owner"]), createShopTool);
router.get("/", getShopTools);
router.get("/:id", getShopTool);
router.patch("/:id", auth, role(["owner"]), updateShopTool);
router.delete("/:id", auth, role(["owner"]), deleteShopTool);

module.exports = router;