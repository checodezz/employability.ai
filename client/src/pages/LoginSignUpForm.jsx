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
  const [formData, setFormData] = useState({
    firstName: "", // Added for candidate registration
    lastName: "", // Added for candidate registration
    email: "",
    password: "",
    phone: "", // Added for candidate registration
    companyName: "", // For company registration
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
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Ensure all required fields are filled for candidate registration
    if (isSignUp && isCandidate) {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.password ||
        !formData.phone
      ) {
        alert("Please fill in all required fields");
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
            companyCode: "DEFAULT123",
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
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
