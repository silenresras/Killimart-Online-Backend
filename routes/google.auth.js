import express from "express";
import passport from "passport";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";


const router = express.Router();

// Start Google login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/auth/login`,
    session: false,
  }),
  (req, res) => {
    generateTokenAndSetCookie(res, req.user._id);
    res.redirect(process.env.CLIENT_URL);
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.clearCookie("token");
    res.redirect(process.env.CLIENT_URL);
  });
});

export default router;
