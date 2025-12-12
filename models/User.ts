import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    birthDate: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false }, 
    otp: { type: String }, 
    otpExpires: { type: Date }, 
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
