import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth20";
import GitHubStrategy from "passport-github2";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js"; // Adjust the path as needed

// Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        // Successful authentication
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Set in .env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Set in .env
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, emails } = profile;
      try {
        // Check if user already exists with Google ID
        let user = await User.findOne({ googleId: id });
        if (user) {
          return done(null, user);
        }

        // If not, check if a user exists with the same email
        const email = emails && emails[0].value;
        if (!email) {
          return done(null, false, {
            message: "No email found in Google account.",
          });
        }

        user = await User.findOne({ email });
        if (user) {
          // Link Google account
          user.googleId = id;
          await user.save();
          return done(null, user);
        }

        // If no user with the email, create a new user
        user = new User({
          googleId: id,
          name: displayName,
          email: email,
          role: "candidate", // Default role or set based on your requirements
        });

        await user.save();
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// GitHub OAuth Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID, // Set in .env
      clientSecret: process.env.GITHUB_CLIENT_SECRET, // Set in .env
      callbackURL: "/api/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, displayName, emails, username } = profile;
      try {
        // Check if user already exists with GitHub ID
        let user = await User.findOne({ githubId: id });
        if (user) {
          return done(null, user);
        }

        // If not, check if a user exists with the same email
        const email = emails && emails.find((email) => email.primary)?.value;
        if (!email) {
          return done(null, false, {
            message: "No email found in GitHub account.",
          });
        }

        user = await User.findOne({ email });
        if (user) {
          // Link GitHub account
          user.githubId = id;
          await user.save();
          return done(null, user);
        }

        // If no user with the email, create a new user
        user = new User({
          githubId: id,
          name: displayName || username,
          email: email,
          role: "candidate", // Default role or set based on your requirements
        });

        await user.save();
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID, // Your LinkedIn App Client ID
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET, // Your LinkedIn App Client Secret
      callbackURL: "http://localhost:3000/api/auth/linkedin/callback", // Replace with your callback URL
      scope: ["r_liteprofile", "r_emailaddress"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({
          email: profile.emails[0].value,
        });
        if (existingUser) {
          return done(null, existingUser);
        }

        // If user does not exist, create a new user
        const newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          linkedinId: profile.id,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
