<<<<<<< HEAD
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
/*
import { decode } from "js-base64";
import { encode } from "js-base64";
*/

import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

/*
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendResetSuccessEmail,
} from "../mailtrap/email.js";
*/

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }

    // Email validation (basic regex for format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }

    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    // const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

    const user = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
    });

    await user.save();

    //jwt
    generateTokenAndSetCookie(res, user._id);

    //await sendVerificationEmail(user.email, user.name, verificationToken);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: error.message });
  }
};

/*export const verifyEmail = async (req, res) => {
=======
import crypto from 'crypto';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken'
import { decode } from "js-base64";
import { encode } from 'js-base64';


import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js'
import { sendVerificationEmail, sendWelcomeEmail, sendResetPasswordEmail, sendResetSuccessEmail } from '../mailtrap/email.js'

export const signUp = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            throw new Error("All fields are required")
        }

        // Email validation (basic regex for format)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format");
        }

        const userAlreadyExists = await User.findOne({ email })

        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: 'User already exists' })
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()

        const user = new User({
            name,
            email,
            password: hashedPassword,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 //24hrs
        })

        await user.save();

        //jwt
        generateTokenAndSetCookie(res, user._id)

        await sendVerificationEmail(user.email, user.name, verificationToken);


        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                ...user._doc,
                password: undefined,
            }
        })
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, message: error.message })
    }
}

export const verifyEmail = async (req, res) => {
>>>>>>> origin/main
    const { code } = req.body
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid verification code' })
        }

        user.isVerified = true
        user.verificationToken = undefined
        user.verificationTokenExpiresAt = undefined
        await user.save()

        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true, message: 'Email verified successfully', user: {
                ...user._doc,
                password: undefined,
            }
        })
    } catch (error) {
        console.log("error in verifying email", error)
        res.status(500).json({ success: false, message: "server error" })
    }

}
<<<<<<< HEAD
*/

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // 🚫 Block ONLY Google-only accounts
    if (user.googleId && !user.password) {
      return res.status(400).json({
        success: false,
        message:
          "This account uses Google login only. Please sign in with Google.",
      });
    }

    // 🚫 BLOCK missing password
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const isPasswordMatch = await bcryptjs.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

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
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "logged out successfully" });
};

////DISABLED FORGOT PASSWORD
/*export const forgotPassword = async (req, res) => {
=======
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        const isPasswordMatch = await bcryptjs.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect password' });
        }

        // Generate JWT and set as cookie
        const token = generateTokenAndSetCookie(res, user._id);

        // Update last login date
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.role === 'admin',
                lastLogin: user.lastLogin,
            },
            token: token
        });

    } catch (error) {
        console.log("Error logging in the user", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};




export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "logged out successfully" });
}

export const forgotPassword = async (req, res) => {
>>>>>>> origin/main
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      }
  
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetTokenExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
  
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiresAt = resetTokenExpiresAt;
  
      await user.save();
  
      // Generate uidb64 and reset URL
      const uidb64 = encode(user._id.toString()); // base64 encode user ID
      const resetURL = `${process.env.CLIENT_URL}/auth/reset-password/${uidb64}/${resetToken}`;
  
      await sendResetPasswordEmail(user.email, resetURL);
  
      res.status(200).json({
        success: true,
        message: "Reset password link sent to your email",
      });
    } catch (error) {
      console.error("Error in forgotPassword:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
<<<<<<< HEAD
  */

/////TEMP FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  return res.status(403).json({
    success: false,
    message:
      "Password reset is temporarily disabled. Please use Google Sign-In.",
  });
};

////DISABLED FORGOT PASSWORD
/*export const resetPassword = async (req, res) => {
=======

  export const resetPassword = async (req, res) => {
>>>>>>> origin/main
    const { uidb64, token } = req.params;
    const { password } = req.body;
  
    try {
      const userId = decode(uidb64); // decode user ID
  
      const user = await User.findOne({
        _id: userId,
        resetPasswordToken: token,
        resetPasswordExpiresAt: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired token",
        });
      }
  
      const hashedPassword = await bcryptjs.hash(password, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiresAt = undefined;
  
      await user.save();
  
      await sendResetSuccessEmail(user.email);
  
      res
        .status(200)
        .json({ success: true, message: "Password reset successful" });
    } catch (error) {
      console.error("Error in resetPassword:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
<<<<<<< HEAD
  */

/////TEMP resetPassword
export const resetPassword = async (req, res) => {
  return res.status(403).json({
    success: false,
    message:
      "Password reset is temporarily disabled. Please use Google Sign-In.",
  });
};

export const checkAuth = async (req, res) => {
  // 1) Header beats cookie
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ isAuthenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ isAuthenticated: false });
    }

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
    console.error("failed:", error);
    res.status(500).json({ message: "Failed to get user info" });
  }
=======

  export const checkAuth = async (req, res) => {
    // 1) Header beats cookie
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ')
                  ? authHeader.split(' ')[1]
                  : req.cookies.token;
  
    if (!token) {
      return res.status(401).json({ isAuthenticated: false });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ isAuthenticated: false });
      }
  
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
  

export const getMe = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password');
      res.json({
        _id: user._id,
        name:  user.name,  
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error("failed:", error);
      res.status(500).json({ message: "Failed to get user info" });
    }
  
>>>>>>> origin/main
};

export const addShippingAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { county, subCounty, town, phoneNumber, isDefault } = req.body;

    if (!county || !subCounty || !town || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const shippingFee = county.toLowerCase() === "nyeri" ? 0 : 300;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Unset other default addresses
    if (isDefault) {
      user.shippingAddress.forEach((addr) => (addr.isDefault = false));
    }

    user.shippingAddress.push({
      county,
      subCounty,
      town,
      phoneNumber,
      shippingFee,
      isDefault: isDefault || false,
    });

    await user.save();

    res.status(201).json({
      message: "Shipping address added successfully",
      shippingAddress: user.shippingAddress,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

<<<<<<< HEAD
=======


>>>>>>> origin/main
export const deleteShippingAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.addressId;

    if (!addressId) {
      return res.status(400).json({ message: "Address ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const addressExists = user.shippingAddress.some(
      (addr) => addr._id.toString() === addressId
    );

    if (!addressExists) {
      return res.status(404).json({ message: "Shipping address not found" });
    }

    // Remove address by filtering it out
    user.shippingAddress = user.shippingAddress.filter(
      (addr) => addr._id.toString() !== addressId
    );

    await user.save();

    res.status(200).json({
      message: "Shipping address deleted successfully",
      shippingAddress: user.shippingAddress,
    });
  } catch (error) {
    console.error("Delete Shipping Address Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

<<<<<<< HEAD
=======





>>>>>>> origin/main
// In controller
export const getShippingAddresses = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("shippingAddress");
    if (!user) return res.status(404).json({ message: "User not found" });

<<<<<<< HEAD
=======

>>>>>>> origin/main
    res.status(200).json({
      shippingAddress: user.shippingAddress,
    });
  } catch (err) {
    console.error("Get addresses error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

<<<<<<< HEAD
export const editShippingAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.addressId;
=======


export const editShippingAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.addressId; 
>>>>>>> origin/main
    const { county, subCounty, town, phoneNumber, isDefault } = req.body;

    if (!addressId || !county || !subCounty || !town || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const shippingFee = county.toLowerCase() === "nyeri" ? 0 : 300;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const address = user.shippingAddress.id(addressId);
    if (!address) return res.status(404).json({ message: "Address not found" });

    if (isDefault) {
      user.shippingAddress.forEach((addr) => (addr.isDefault = false));
    }

    address.county = county;
    address.subCounty = subCounty;
    address.town = town;
    address.phoneNumber = phoneNumber;
    address.shippingFee = shippingFee;
    address.isDefault = isDefault || false;

    user.markModified("shippingAddress");

    await user.save();

    res.status(200).json({
      message: "Shipping address updated successfully",
      shippingAddress: user.shippingAddress,
    });
  } catch (err) {
    console.error("Edit error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

<<<<<<< HEAD
=======

>>>>>>> origin/main
export const getDefaultShippingAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("shippingAddress");

    if (!user) return res.status(404).json({ message: "User not found" });

<<<<<<< HEAD
    const defaultAddress = user.shippingAddress.find(
      (addr) => addr.isDefault === true
    );

    if (!defaultAddress) {
      return res
        .status(404)
        .json({ message: "No default shipping address found" });
=======
    const defaultAddress = user.shippingAddress.find(addr => addr.isDefault === true);

    if (!defaultAddress) {
      return res.status(404).json({ message: "No default shipping address found" });
>>>>>>> origin/main
    }

    res.status(200).json({ defaultAddress });
  } catch (err) {
    console.error("Error fetching default address:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
<<<<<<< HEAD
=======



>>>>>>> origin/main
