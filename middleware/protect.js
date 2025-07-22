import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      ...user._doc,
      _id: user._id.toString(), // Ensure ID is a string
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    const env = process.env.NODE_ENV;
    res.status(401).json({
      message: env === 'development' ? error.message : "Not authorized",
    });
  }
};
