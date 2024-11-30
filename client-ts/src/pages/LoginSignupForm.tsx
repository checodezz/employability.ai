// src/components/LoginSignupForm.tsx

import React, { useState, useEffect, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  loginUser,
  fetchUser,
  logoutUser,
} from "../store/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaGithub, FaLinkedin } from "react-icons/fa";
// import { RootState } from "../store"; // Adjust to your store setup
import { RootState } from "@/store/store";

interface SignupData {
  email: string;
  password: string;
  name: string;
  role: string;
  resume?: string;
  company?: {
    name: string;
    website: string;
  };
}

const LoginSignupForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state.auth);

  const [isSignup, setIsSignup] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<string>("candidate");
  const [resume, setResume] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [companyWebsite, setCompanyWebsite] = useState<string>("");

  useEffect(() => {
    // Fetch the authenticated user's data when the component mounts
    // dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [authState.isAuthenticated, navigate]);

  const handleCustomSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const signupData: SignupData = {
      email,
      password,
      name,
      role,
    };

    if (role === "candidate") {
      signupData.resume = resume;
    } else if (role === "employer" || role === "recruiter") {
      signupData.company = {
        name: companyName,
        website: companyWebsite,
      };
    }

    try {
      // Trigger signup API call
      await dispatch(registerUser(signupData)).unwrap();

      // Redirect to OTP verification after signup
      navigate("/verify-phone");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
    };
    dispatch(loginUser(loginData));
  };

  const handleOAuthLogin = async (provider: string) => {
    const providerRoutes: { [key: string]: string } = {
      google: "auth/google",
      github: "auth/github",
      linkedin: "auth/linkedin",
    };

    const backendUrl = "http://localhost:3000"; // Backend URL
    const redirectUrl = `${backendUrl}/api/${providerRoutes[provider]}`;

    // Redirect to OAuth route
    window.location.href = redirectUrl;

    // After OAuth login, check if the user needs phone verification
    try {
      const response = await fetch(`${backendUrl}/api/auth/me`, {
        credentials: "include", // Ensure cookies are included
      });

      const user = await response.json();

      if (!user.isPhoneVerified) {
        navigate("/verify-phone"); // Redirect to phone verification
      } else {
        navigate("/dashboard"); // Redirect to dashboard
      }
    } catch (error) {
      console.error("OAuth login failed:", error);
    }
  };

  if (authState.status === "loading") {
    return (
      <div
        className="flex justify-center items-center min-h-screen bg-gray-100"
        aria-busy="true"
      >
        <h2 className="text-xl font-semibold text-gray-700">
          {isSignup ? "Signing you up..." : "Signing you in..."}
        </h2>
      </div>
    );
  }

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gray-100"
      role="main"
      aria-labelledby="page-title"
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle
            id="page-title"
            className="text-center text-2xl font-bold text-gray-800"
          >
            {isSignup ? "Create an Account" : "Sign in to Employability.ai"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {authState.user ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Hello, {authState.user.name || authState.user.email}
              </h2>
              <p className="text-gray-600 mb-4">
                Email: {authState.user.email}
              </p>
              <Button
                onClick={() => dispatch(logoutUser())}
                variant="outline"
                className="mt-4"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div>
              <form onSubmit={isSignup ? handleCustomSignup : handleLogin}>
                {authState.error && (
                  <p className="text-red-500 text-center mb-4">
                    {authState.error}
                  </p>
                )}

                {/* Common Fields */}
                <div className="mb-4">
                  <label className="block text-gray-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded p-2"
                    required
                  />
                </div>

                {/* Signup-Specific Fields */}
                {isSignup && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700">I am a</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2"
                      >
                        <option value="candidate">Candidate</option>
                        <option value="employer">Employer</option>
                        <option value="recruiter">Recruiter</option>
                      </select>
                    </div>

                    {role === "candidate" && (
                      <div className="mb-4">
                        <label className="block text-gray-700">
                          Resume (URL)
                        </label>
                        <input
                          type="url"
                          value={resume}
                          onChange={(e) => setResume(e.target.value)}
                          className="w-full border border-gray-300 rounded p-2"
                          placeholder="e.g., https://example.com/resume.pdf"
                        />
                      </div>
                    )}

                    {(role === "employer" || role === "recruiter") && (
                      <>
                        <div className="mb-4">
                          <label className="block text-gray-700">
                            Company Name
                          </label>
                          <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700">
                            Company Website
                          </label>
                          <input
                            type="url"
                            value={companyWebsite}
                            onChange={(e) => setCompanyWebsite(e.target.value)}
                            className="w-full border border-gray-300 rounded p-2"
                            placeholder="e.g., https://example.com"
                          />
                        </div>
                      </>
                    )}
                  </>
                )}

                <Button type="submit" className="w-full" variant="default">
                  {isSignup ? "Signup" : "Login"}
                </Button>
              </form>

              {/* OAuth Buttons */}
              <div className="mt-6 flex flex-col items-center">
                <span className="text-gray-500 mb-2">Or continue with</span>
                <div className="flex space-x-4">
                  <Button
                    onClick={() => handleOAuthLogin("google")}
                    variant="outline"
                    className="flex items-center"
                  >
                    <FaGoogle className="mr-2" /> Google
                  </Button>
                  <Button
                    onClick={() => handleOAuthLogin("linkedin")}
                    variant="outline"
                    className="flex items-center"
                  >
                    <FaLinkedin className="mr-2" /> LinkedIn
                  </Button>
                  <Button
                    onClick={() => handleOAuthLogin("github")}
                    variant="outline"
                    className="flex items-center"
                  >
                    <FaGithub className="mr-2" /> GitHub
                  </Button>
                </div>
              </div>

              <p className="text-center text-gray-500 mt-4">
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <button
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-blue-600 underline"
                >
                  {isSignup ? "Login here" : "Sign up here"}
                </button>
              </p>
            </div>
          )}
        </CardContent>
        {!authState.user && (
          <CardFooter className="text-center">
            <p className="text-sm text-gray-500">
              By signing up or logging in, you agree to our{" "}
              <a href="/terms" className="text-blue-600 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-blue-600 underline">
                Privacy Policy
              </a>
              .
            </p>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default LoginSignupForm;
