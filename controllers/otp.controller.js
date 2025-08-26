const nodemailer = require("nodemailer");
const { totp } = require("otplib");

totp.options = { step: 60, digits: 6 };

const emailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});


const sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = totp.generate(email + (process.env.OTP_SECRET_KEY || "nimadur"));

  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Verification",
      text: `Your OTP code is ${otp}`,
    });

    res.json({ message: `Otp sent to ${email}` });
  } catch (e) {
    console.error("Email sending error:", e);
    res.status(500).json({ message: "Failed to send OTP", error: e.message });
  }
};

const verifyOtp = (req, res) => {
  const { otp, email } = req.body;
  const isValid = totp.check(
    otp,
    email + (process.env.OTP_SECRET_KEY || "nimadur")
  );

  if (!isValid) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  res.json({ message: "OTP verified successfully", verify: true });
};

module.exports = { sendOtp, verifyOtp };