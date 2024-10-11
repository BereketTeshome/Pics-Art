import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import GlowingBG from "../components/GlowingBG";

// Zod schema for validation
const schema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password1: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    password2: z.string().min(8, {
      message: "Confirm password must be at least 8 characters long",
    }),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords don't match",
    path: ["password2"],
  });

// Types for form data and errors
interface FormData {
  name: string;
  email: string;
  password1: string;
  password2: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password1?: string | string[]; // Fix: Allow password1 to be string or string array
  password2?: string;
  general?: string;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password1: "",
    password2: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  // Handle input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrors({}); // Reset errors on new submission

    try {
      // Validate form data using Zod
      const validatedData = schema.parse(formData);

      // Send registration request using axios
      const response = await axios.post(
        "https://pics-art-five.vercel.app/api/auth/registration/",
        {
          name: validatedData.name,
          email: validatedData.email,
          password1: validatedData.password1,
          password2: validatedData.password2,
        }
      );

      setSuccess(true);
      navigate("/login");
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Set form validation errors from Zod
        const formattedErrors = error.issues.reduce(
          (acc: FormErrors, issue) => {
            acc[issue.path[0] as keyof FormErrors] = issue.message;
            return acc;
          },
          {}
        );
        setErrors(formattedErrors);
      } else if (axios.isAxiosError(error) && error.response) {
        // Handle API errors, such as password errors from the backend
        setErrors({
          general:
            error.response.data?.message ||
            "Registration failed. Please try again.",
          password1: error.response.data?.password1 || undefined, // Backend might return an array here
        });
      } else {
        // Default error handling for unexpected errors
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

        <div className="flex flex-col items-center justify-center px-6 py-4 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-2 md:space-y-2 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>
              <form className="space-y-4 md:space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Full name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Abebe Kebede"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="abebe@gmail.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password1"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password1"
                    id="password1"
                    value={formData.password1}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {Array.isArray(errors.password1)
                    ? errors.password1.map((error, idx) => (
                        <p key={idx} className="text-sm text-red-500">
                          {error}
                        </p>
                      ))
                    : errors.password1 && (
                        <p className="text-sm text-red-500">
                          {errors.password1}
                        </p>
                      )}
                </div>
                <div>
                  <label
                    htmlFor="password2"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    name="password2"
                    id="password2"
                    value={formData.password2}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.password2 && (
                    <p className="text-sm text-red-500">{errors.password2}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-800 transition-all duration-300 ease-in-out animate-gradient"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create an account"}
                </button>

                {errors.general && (
                  <p className="mt-2 text-sm text-red-500">{errors.general}</p>
                )}
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignUp;
