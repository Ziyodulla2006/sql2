const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware")
const {
  createDistrict,
  getDistricts,
  getDistrict,
  updateDistrict,
  deleteDistrict,
} = require("../controllers/district.controller");

router.post("/", auth, role(["owner"]), createDistrict);
router.get("/", getDistricts);
router.get("/:id", getDistrict);
router.patch("/:id", auth, role(["owner"]),  updateDistrict);
router.delete("/:id", auth, role(["owner"]), deleteDistrict);

module.exports = router;