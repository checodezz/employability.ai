import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import axios from "axios";

const LoginSignupForm = () => {
  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();

  // Function to call the protected API
  const callProtectedAPI = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log(token);
      const response = await axios.get("http://localhost:3000/api/userinfo", {
        headers: {
          Authorization: `Bearer ${token}`, // Attach the token
        },
      });
      console.log("Protected API Response:", response.data);
    } catch (error) {
      console.error("Error calling protected API:", error.message);
    }
  };

  // Trigger API call after successful login or signup
  useEffect(() => {
    if (isAuthenticated) {
      callProtectedAPI();
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    try {
      await loginWithRedirect();
    } catch (error) {
      console.error("Redirect login failed:", error);
    }
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  if (isLoading) {
    return (
      <div
        className="flex justify-center items-center min-h-screen bg-gray-100"
        aria-busy="true"
        aria-label="Loading authentication state"
      >
        <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
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
            {isAuthenticated
              ? "Welcome to Employability.ai"
              : "Sign in to Employability.ai"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAuthenticated ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Hello, {user?.name || user?.email}
              </h2>
              <p className="text-gray-600 mb-4">Email: {user?.email}</p>
              <Button
                onClick={handleLogout}
                className="w-full"
                variant="destructive"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 mb-4 text-center">
                Use your account to sign in and access your dashboard.
              </p>
              <Button
                onClick={handleLogin}
                className="w-full"
                variant="default"
              >
                Login
              </Button>
            </div>
          )}
        </CardContent>
        {!isAuthenticated && (
          <CardFooter className="text-center">
            <p className="text-sm text-gray-500">
              By logging in, you agree to our{" "}
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
