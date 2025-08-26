const router = require("express").Router();

const otpRouter = require("./otp.routes");
const userRouter = require("./user.routes");
const adminRouter = require("./admin.routes");
const toolRouter = require("./tool.routes");
const districtRouter = require("./district.routes");
const shopRouter = require("./shop.routes");
const shopToolRouter = require("./shop_tool.routes");
const ordersRouter = require("./orders.routes");

router.use("/otp", otpRouter);
router.use("/users", userRouter);
router.use("/admins", adminRouter);
router.use("/tools", toolRouter);
router.use("/districts", districtRouter);
router.use("/shops", shopRouter);
router.use("/shop-tools", shopToolRouter);
router.use("/orders", ordersRouter);

module.exports = router;