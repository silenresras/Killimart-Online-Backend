import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";

passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value;
  
          // 1️⃣ Check if user already exists by GOOGLE ID
          let user = await User.findOne({ googleId: profile.id });
  
          if (user) {
            user.lastLogin = new Date();
            await user.save();
            return done(null, user);
          }
  
          // 2️⃣ Check if user exists by EMAIL (manual signup)
          user = await User.findOne({ email });
  
          if (user) {
            // 🔗 LINK Google to existing account
            user.googleId = profile.id;
  
            if (!user.avatar && profile.photos?.length) {
              user.avatar = profile.photos[0].value;
            }
  
            user.isVerified = true;
            user.authProvider = "google";
            user.lastLogin = new Date();
  
            await user.save();
            return done(null, user);
          }
  
          // 3️⃣ Create NEW Google-only account
          user = await User.create({
            googleId: profile.id,
            email,
            name: profile.displayName,
            avatar: profile.photos?.[0]?.value,
            isVerified: true,
            authProvider: "google",
          });
  
          return done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
  

// Session handling
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
