const router = require("express").Router();
const role = require("../middlewares/role.middleware")
const auth = require("../middlewares/auth.middleware")
const {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");


router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", getUsers);
router.get("/:id", getUser);
router.patch("/:id", auth, role(["owner", "client"]),updateUser);
router.delete("/:id",  auth, role(["owner", "client"]), deleteUser);

module.exports = router;