import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthDate: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false }, // Email verification check
    otp: { type: String }, // OTP store karega
    otpExpires: { type: Date }, // Expiry time
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
