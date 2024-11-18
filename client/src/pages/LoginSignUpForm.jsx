import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginCandidate,
  loginCompany,
  registerCandidate,
  registerCompany,
} from "../store/slices/authSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const LoginSignupForm = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between login and signup
  const [isCandidate, setIsCandidate] = useState(true); // Toggle between candidate and company
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Toggle password visibility
  const [formData, setFormData] = useState({
    firstName: "", // For candidate registration
    lastName: "", // For candidate registration
    email: "",
    password: "",
    phone: "", // Shared field for both candidate and company
    companyName: "", // For company registration
    companyCode: "", // Required for company registration
  });
  const { status, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      companyName: "",
      companyCode: "",
    });
  };

  const toggleRole = () => {
    setIsCandidate((prev) => !prev);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      companyName: "",
      companyCode: "",
    });
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp && isCandidate) {
      // Validation: Ensure all required fields for candidate
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password ||
        !formData.phone
      ) {
        alert("Please fill in all required fields for candidate registration");
        return;
      }
    } else if (isSignUp && !isCandidate) {
      // Validation: Ensure all required fields for company
      if (
        !formData.companyName ||
        !formData.companyCode ||
        !formData.email ||
        !formData.password ||
        !formData.phone
      ) {
        alert("Please fill in all required fields for company registration");
        return;
      }
    }

    console.log("Form Data on Submit:", formData);
    console.log(
      `Action: ${isSignUp ? "Signup" : "Login"} as ${
        isCandidate ? "Candidate" : "Company"
      }`
    );

    if (isSignUp) {
      if (isCandidate) {
        dispatch(
          registerCandidate({
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            firstName: formData.firstName,
            lastName: formData.lastName,
          })
        );
      } else {
        dispatch(
          registerCompany({
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            companyName: formData.companyName,
            companyCode: formData.companyCode,
          })
        );
      }
    } else {
      if (isCandidate) {
        dispatch(
          loginCandidate({ email: formData.email, password: formData.password })
        );
      } else {
        dispatch(
          loginCompany({ email: formData.email, password: formData.password })
        );
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {isSignUp
              ? isCandidate
                ? "Candidate Signup"
                : "Company Signup"
              : isCandidate
              ? "Candidate Login"
              : "Company Login"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {isSignUp && isCandidate && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <Input
                    name="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <Input
                    name="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <Input
                    name="phone"
                    type="text"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            )}

            {isSignUp && !isCandidate && (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <Input
                    name="companyName"
                    type="text"
                    placeholder="Enter your company name"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Code
                  </label>
                  <Input
                    name="companyCode"
                    type="text"
                    placeholder="Enter your company code"
                    value={formData.companyCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <Input
                    name="phone"
                    type="text"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {isPasswordVisible ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button
              type="submit"
              className="w-full"
              disabled={status === "loading"}
            >
              {status === "loading"
                ? "Processing..."
                : isSignUp
                ? isCandidate
                  ? "Sign Up as Candidate"
                  : "Sign Up as Company"
                : isCandidate
                ? "Login as Candidate"
                : "Login as Company"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <Button
            variant="link"
            onClick={toggleRole}
            className="mr-4 text-blue-500"
          >
            Switch to {isCandidate ? "Company" : "Candidate"}
          </Button>
          <Button variant="link" onClick={toggleMode} className="text-blue-500">
            Switch to {isSignUp ? "Login" : "Signup"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginSignupForm;
