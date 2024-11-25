import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/user.model";

// TypeScript interface for OAuth Profile Email
interface OAuthProfileEmail {
  value: string;
  primary?: boolean;
}

// TypeScript interface for OAuth Profile
interface OAuthProfile {
  id: string;
  displayName: string;
  emails?: OAuthProfileEmail[];
  username?: string;
}

/**
 * Local Strategy
 */
passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (
      email: string,
      password: string,
      done: (
        error: any,
        user?: IUser | false,
        options?: { message: string }
      ) => void
    ) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password || "");
        if (!isMatch) {
          return done(null, false, { message: "Incorrect email or password." });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

/**
 * Google OAuth Strategy
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "/api/auth/google/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: OAuthProfile,
      done: (
        error: any,
        user?: IUser | false,
        options?: { message: string }
      ) => void
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(null, false, {
            message: "No email found in Google account.",
          });
        }

        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }

        user = await User.findOne({ email });
        if (user) {
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }

        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email,
          role: "candidate",
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, undefined); // Use `undefined` instead of `null`
      }
    }
  )
);

/**
 * GitHub OAuth Strategy
 */
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      callbackURL: "/api/auth/github/callback",
      scope: ["user:email"],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: OAuthProfile,
      done: (
        error: any,
        user?: IUser | false,
        options?: { message: string }
      ) => void
    ) => {
      try {
        const email = profile.emails?.find((e) => e.primary)?.value;
        if (!email) {
          return done(null, false, {
            message: "No email found in GitHub account.",
          });
        }

        let user = await User.findOne({ githubId: profile.id });
        if (user) {
          return done(null, user);
        }

        user = await User.findOne({ email });
        if (user) {
          user.githubId = profile.id;
          await user.save();
          return done(null, user);
        }

        const newUser = new User({
          githubId: profile.id,
          name: profile.displayName || profile.username,
          email,
          role: "candidate",
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);

/**
 * LinkedIn OAuth Strategy
 */
passport.use(
  new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
      callbackURL: "http://localhost:3000/api/auth/linkedin/callback",
      scope: ["r_liteprofile", "r_emailaddress"],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: OAuthProfile,
      done: (
        error: any,
        user?: IUser | false,
        options?: { message: string }
      ) => void
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(null, false, {
            message: "No email found in LinkedIn account.",
          });
        }

        let user = await User.findOne({ email });
        if (user) {
          return done(null, user);
        }

        const newUser = new User({
          linkedinId: profile.id,
          name: profile.displayName,
          email,
          role: "candidate",
        });

        await newUser.save();
        return done(null, newUser);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);

/**
 * Serialize and Deserialize User
 */
passport.serializeUser((user: any, done: (error: any, id?: string) => void) => {
  done(null, user.id);
});

passport.deserializeUser(
  async (id: string, done: (error: any, user?: IUser | null) => void) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
);

export default passport;
