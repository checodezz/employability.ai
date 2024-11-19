import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/slices/authSlice"; // Adjust path based on your Redux slice location
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const LoginSignupForm = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth); // Access authentication state from Redux

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Signup-specific field
  const [role, setRole] = useState("candidate"); // Default to candidate
  const [resume, setResume] = useState(""); // Candidate-specific field
  const [companyName, setCompanyName] = useState(""); // Employer-specific field
  const [companyWebsite, setCompanyWebsite] = useState(""); // Employer-specific field

  // Function for handling custom signup
  const handleCustomSignup = (e) => {
    e.preventDefault();

    const signupData = {
      email,
      password,
      name,
      role,
    };

    // Add role-specific fields dynamically
    if (role === "candidate") {
      signupData.resume = resume;
    } else if (role === "employer" || role === "recruiter") {
      signupData.company = {
        name: companyName,
        website: companyWebsite,
      };
    }
    dispatch(registerUser(signupData)); // Dispatch the unified registerUser action
  };

  if (authState.status === "loading") {
    return (
      <div
        className="flex justify-center items-center min-h-screen bg-gray-100"
        aria-busy="true"
      >
        <h2 className="text-xl font-semibold text-gray-700">
          Signing you up...
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
            </div>
          ) : (
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  isSignup
                    ? handleCustomSignup(e)
                    : console.log("Handle login");
                }}
              >
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
