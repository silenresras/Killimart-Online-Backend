import crypto from "crypto";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { decode, encode } from "js-base64";

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

// Sign-up (manual accounts)
export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw new Error("Invalid email format");

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: true, // temp, since email verification disabled
    });

    await user.save();

    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "User not found" });

    if (user.googleId && !user.password)
      return res.status(400).json({
        success: false,
        message: "This account uses Google login only. Please sign in with Google.",
      });

    if (!password)
      return res.status(400).json({ success: false, message: "Password is required" });

    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch)
      return res.status(400).json({ success: false, message: "Incorrect password" });

    const token = generateTokenAndSetCookie(res, user._id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.role === "admin",
        lastLogin: user.lastLogin,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Logout
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Temporary disabled password reset
export const forgotPassword = async (req, res) => {
  return res.status(403).json({
    success: false,
    message: "Password reset is temporarily disabled. Please use Google Sign-In.",
  });
};

export const resetPassword = async (req, res) => {
  return res.status(403).json({
    success: false,
    message: "Password reset is temporarily disabled. Please use Google Sign-In.",
  });
};

// Check authentication
export const checkAuth = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : req.cookies.token;

  if (!token) return res.status(401).json({ isAuthenticated: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ isAuthenticated: false });

    res.json({
      isAuthenticated: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch {
    res.status(401).json({ isAuthenticated: false });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Failed:", error);
    res.status(500).json({ message: "Failed to get user info" });
  }
};

// Shipping address management
export const addShippingAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { county, subCounty, town, phoneNumber, isDefault } = req.body;
    if (!county || !subCounty || !town || !phoneNumber)
      return res.status(400).json({ message: "All fields are required" });

    const shippingFee = county.toLowerCase() === "nyeri" ? 0 : 300;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (isDefault) user.shippingAddress.forEach((addr) => (addr.isDefault = false));

    user.shippingAddress.push({ county, subCounty, town, phoneNumber, shippingFee, isDefault: isDefault || false });
    await user.save();

    res.status(201).json({ message: "Shipping address added successfully", shippingAddress: user.shippingAddress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteShippingAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.addressId;
    if (!addressId) return res.status(400).json({ message: "Address ID is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.shippingAddress = user.shippingAddress.filter((addr) => addr._id.toString() !== addressId);
    await user.save();

    res.status(200).json({ message: "Shipping address deleted successfully", shippingAddress: user.shippingAddress });
  } catch (error) {
    console.error("Delete Shipping Address Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getShippingAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("shippingAddress");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ shippingAddress: user.shippingAddress });
  } catch (err) {
    console.error("Get addresses error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const editShippingAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.shippingAddress.id(req.params.addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    const { county, subCounty, town, phoneNumber, isDefault } = req.body;
    if (!county || !subCounty || !town || !phoneNumber)
      return res.status(400).json({ message: "All fields are required" });

    const shippingFee = county.toLowerCase() === "nyeri" ? 0 : 300;
    if (isDefault) user.shippingAddress.forEach((addr) => (addr.isDefault = false));

    address.county = county;
    address.subCounty = subCounty;
    address.town = town;
    address.phoneNumber = phoneNumber;
    address.shippingFee = shippingFee;
    address.isDefault = isDefault || false;

    user.markModified("shippingAddress");
    await user.save();

    res.status(200).json({ message: "Shipping address updated successfully", shippingAddress: user.shippingAddress });
  } catch (err) {
    console.error("Edit error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getDefaultShippingAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("shippingAddress");
    if (!user) return res.status(404).json({ message: "User not found" });

    const defaultAddress = user.shippingAddress.find((addr) => addr.isDefault);
    if (!defaultAddress) return res.status(404).json({ message: "No default shipping address found" });

    res.status(200).json({ defaultAddress });
  } catch (err) {
    console.error("Error fetching default address:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
