"use server";

import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  pool: true,
  maxConnections: 1,
  rateLimit: 5,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: `"Auth App Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}. Message ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error("Fatal Email Error:", error);
    return false;
  }
}
export async function registerUser(formData: any) {
  await connectToDatabase();
  try {
    const existingUser = await User.findOne({ email: formData.email });

    if (existingUser && existingUser.isVerified) {
      return { success: false, message: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(formData.password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 Minutes

    if (existingUser && !existingUser.isVerified) {
      existingUser.fullname = formData.fullName;
      existingUser.password = hashedPassword;
      existingUser.birthDate = formData.birthDate;
      existingUser.phone = formData.phone;
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      await existingUser.save();
    } else {
      await User.create({
        fullname: formData.fullName,
        email: formData.email,
        birthDate: formData.birthDate,
        phone: formData.phone,
        password: hashedPassword,
        otp: otp,
        otpExpires: otpExpires,
        isVerified: false,
      });
    }
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #2563EB; text-align: center;">Verify Your Email</h2>
        <p style="color: #555; font-size: 16px;">Hello ${formData.fullName},</p>
        <p style="color: #555; font-size: 16px;">Use the code below to complete your registration. This code is valid for 5 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b; background: #f1f5f9; padding: 10px 20px; border-radius: 8px;">${otp}</span>
        </div>
        <p style="color: #999; font-size: 12px; text-align: center;">If you didn't request this, please ignore this email.</p>
      </div>
    `;

    const emailSent = await sendEmail({
      to: formData.email,
      subject: "Your Verification Code - AuthApp",
      html: emailHtml,
    });

    if (!emailSent) {
      return {
        success: false,
        message: "Failed to send OTP email. Check server logs.",
      };
    }

    return {
      success: true,
      email: formData.email,
      message: "OTP sent successfully to your email.",
    };
  } catch (error) {
    console.error("Error registering:", error);
    return { success: false, message: "Registration failed." };
  }
}
export async function verifyOtp(email: string, otp: string) {
  await connectToDatabase();
  try {
    const user = await User.findOne({ email });

    if (!user) return { success: false, message: "User not found" };

    if (user.otp !== otp) {
      return { success: false, message: "Invalid OTP" };
    }

    if (user.otpExpires < new Date()) {
      return {
        success: false,
        message: "OTP has expired. Please request a new one.",
      };
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return {
      success: true,
      message: "Email verified successfully!",
      user: { name: user.fullname, email: user.email },
    };
  } catch (error) {
    console.error("Verification Error:", error);
    return { success: false, message: "Verification failed." };
  }
}

export async function resendOtp(email: string) {
  await connectToDatabase();
  try {
    const user = await User.findOne({ email });
    if (!user) return { success: false, message: "User not found" };

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #2563EB; text-align: center;">New Verification Code</h2>
        <p style="color: #555; font-size: 16px;">Hello ${user.fullname},</p>
        <p style="color: #555; font-size: 16px;">Here is your new verification code. It is valid for 5 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e293b; background: #f1f5f9; padding: 10px 20px; border-radius: 8px;">${otp}</span>
        </div>
      </div>
    `;
    const emailSent = await sendEmail({
      to: email,
      subject: "Your New Verification Code - AuthApp",
      html: emailHtml,
    });

    if (!emailSent) {
      return { success: false, message: "Failed to send email." };
    }

    return { success: true, message: "New OTP sent successfully!" };
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return { success: false, message: "Failed to resend OTP" };
  }
}

export async function loginUser(formData: any) {
  await connectToDatabase();
  try {
    const user = await User.findOne({ email: formData.email });

    if (!user) return { success: false, message: "User not found" };

    if (!user.isVerified) {
      return { success: false, message: "Please verify your email first." };
    }

    const usmatch = await bcrypt.compare(formData.password, user.password);
    if (!usmatch) return { success: false, message: "Invalid password" };

    return { success: true, user: { name: user.fullname, email: user.email } };
  } catch (error) {
    console.error("Login Error:", error);
    return { success: false, message: "Login failed." };
  }
}

export async function sendForgotPasswordOtp(email: string) {
  await connectToDatabase();
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return { success: false, message: "User not found with this email" };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    const emailSent = await sendEmail({
      to: email,
      subject: "Reset Password OTP",
      html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>Reset Password Request</h2>
              <p>Your OTP to reset password is:</p>
              <h1 style="color: #DC2626; letter-spacing: 5px;">${otp}</h1>
            </div>`,
    });

    if (!emailSent) {
      return { success: false, message: "Failed to send OTP email." };
    }

    return { success: true, message: "OTP sent to your email" };
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return { success: false, message: "Something went wrong" };
  }
}

export async function verifyOtpOnly(email: string, otp: string) {
  await connectToDatabase();
  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return { success: false, message: "Invalid OTP" };
    }
    if (user.otpExpires < new Date()) {
      return { success: false, message: "OTP has expired" };
    }
    return { success: true, message: "OTP Verified" };
  } catch (error) {
    return { success: false, message: "Error verifying OTP" };
  }
}

export async function resetPasswordWithOtp(
  email: string,
  otp: string,
  newPassword: string
) {
  await connectToDatabase();
  try {
    const user = await User.findOne({ email });
    if (!user) return { success: false, message: "User not found" };

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return { success: false, message: "Invalid or expired OTP" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return { success: true, message: "Password reset successfully!" };
  } catch (error) {
    console.error("Reset Password Error:", error);
    return { success: false, message: "Failed to reset password" };
  }
}
