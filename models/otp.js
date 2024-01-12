import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  otp: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  expireIn: {
    type: Date,
    required: true,
  },
});

const OtpModel = mongoose.model("OTP", otpSchema);

export default OtpModel;
