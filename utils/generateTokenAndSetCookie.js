
import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });


    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",   // true on Render
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: process.env.NODE_ENV === "production" ? ".onrender.com" : undefined,
      });

    return token;
};

