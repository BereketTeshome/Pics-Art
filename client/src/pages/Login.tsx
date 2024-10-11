import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import GlowingBG from "../components/GlowingBG";
import Cookies from "universal-cookie";

// Zod schema for validation
const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

// Types for form data and errors
interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const SignIn: React.FC = () => {
  const cookie = new Cookies();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate(); // For navigation

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit for local strategy login
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validate form data using Zod
      const validatedData = schema.parse(formData);

      // Send login request using axios to the backend
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/login/",
        {
          email: validatedData.email,
          password: validatedData.password,
        },
        { withCredentials: true }
      );

      // Extract the access and refresh tokens from the response
      const { access, refresh, user } = response.data;

      // Store the tokens in cookies
      cookie.set("jwt_access_token", access);
      cookie.set("jwt_refresh_token", refresh);
      // cookie.set("jwt_refresh_token", refresh, { path: "/", httpOnly: true });

      // Optionally, store user information in cookies or local storage
      cookie.set("user", JSON.stringify(user), { path: "/" });

      console.log("Login successful", user);

      setSuccess(true);
      alert("Login successful!");

      // Navigate to a protected route or home page
      navigate("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.issues.reduce(
          (acc: FormErrors, issue) => {
            acc[issue.path[0] as keyof FormErrors] = issue.message;
            return acc;
          },
          {}
        );
        setErrors(formattedErrors);
      } else if (axios.isAxiosError(error) && error.response) {
        setErrors({
          general:
            error.response.data?.message || "Login failed. Please try again.",
        });
      } else {
        setErrors({
          general: "An unexpected error occurred. Please try again later.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="relative justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <GlowingBG />
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <p className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="w-12 h-10 mr-2" src="/logo.png" alt="logo" />
            Pic Arts
          </p>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign In
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                  <Link
                    to="/ForgotPassword"
                    className="block mt-2 text-sm text-white text-primary-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:bg-gradient-to-l focus:ring-2 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800 transition-all duration-300 ease-in-out animate-gradient"
                  disabled={loading}
                >
                  {loading ? "Logging In..." : "Sign In"}
                </button>

                {errors.general && (
                  <p className="mt-2 text-sm text-red-500">{errors.general}</p>
                )}

                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Register here
                  </Link>
                </p>
              </form>

              {success && (
                <p className="mt-2 text-sm text-green-500">Login successful!</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignIn;
