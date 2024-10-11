import React, { useState, useRef } from "react";
import GlowingBG from "../components/GlowingBG";
import { v4 as uuidv4 } from "uuid";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

const HomePage: React.FC = () => {
  const user = useUser();
  const supabase = useSupabaseClient();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [media, setMedia] = useState<any>([]);
  const imagesRef = useRef<HTMLDivElement>(null); // Ref for "Your Images" section

  const scrollToImages = () => {
    if (imagesRef.current) {
      imagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const magicLinkLogin = async () => {
    if (!email) {
      setError("Please enter an email.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const { data, error } = await supabase.auth.signInAnonymously();

    if (error) {
      alert(
        "Error communicating with Supabase, make sure to use a real email address!"
      );
      console.log(error);
    } else {
      alert("Successfully logged in!");
    }
  };

  async function getMedia() {
    const { data, error } = await supabase.storage
      .from("ImageBucket")
      .list(userId + "/", {
        limit: 10,
        offset: 0,
        sortBy: {
          column: "name",
          order: "asc",
        },
      });

    if (data) {
      setMedia(data);
    } else {
      console.log(71, error);
    }
  }

  const validateEmail = (email: string) => {
    // Regular expression to check email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(email);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  async function uploadImage(e: any) {
    let file = e.target.files[0];

    const { data, error } = await supabase.storage
      .from("ImageBucket")
      .upload(userId + "/" + uuidv4(), file);

    if (data) {
      getMedia();
    } else {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <GlowingBG />

      {/* Hero Section */}
      <section className="w-full py-16">
        <div className="container flex flex-col items-center justify-between px-6 mx-auto md:flex-row">
          <div className="text-center md:text-left md:w-1/2">
            <h1 className="mb-6 text-5xl font-bold leading-snug text-transparent bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 bg-clip-text">
              Explore Your World of Images
            </h1>
            <p className="mb-8 text-lg text-gray-300 md:text-xl">
              Upload and manage your personal images.
            </p>
            <button
              onClick={scrollToImages}
              className="relative inline-block px-8 py-2 text-lg font-semibold text-white transition-all bg-orange-500 rounded-lg shadow-lg hover:bg-orange-400"
            >
              Explore
            </button>
          </div>

          {/* Right Side Image */}
          <div className="mb-6 md:w-1/2 md:mb-0">
            <img
              src="/hero-image.png"
              alt="hero"
              className="object-cover w-[95%] h-[95%] rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Image Display Section */}
      <section className="w-full py-16 bg-transparent" ref={imagesRef}>
        <div className="container px-6 mx-auto">
          <div className="flex justify-between">
            <h2 className="mb-12 text-3xl font-bold text-center text-gray-300 md:text-4xl">
              Your Uploaded Images
            </h2>
          </div>

          <div className="text-white">
            {user === null ? (
              <div className="w-full max-w-md p-6 mx-auto text-white bg-gray-800 rounded-lg shadow-md">
                <h1 className="mb-4 text-3xl font-bold text-center text-gray-200">
                  Enter your email to sign in
                </h1>
                <p className="mb-6 text-lg text-center text-gray-400">
                  We'll send you a magic link to sign in.
                </p>

                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-300"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="block w-full px-4 py-2 text-white bg-gray-900 border border-gray-600 rounded-lg focus:ring focus:ring-blue-500 focus:outline-none focus:border-blue-500"
                      placeholder="Enter your email"
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null); // Clear error message when the user types
                      }}
                    />
                    {error && (
                      <p className="mt-2 text-sm text-red-500">{error}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={magicLinkLogin}
                    className="w-full px-6 py-3 text-lg font-semibold text-center text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Log In
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between w-full mb-4">
                  {/* File Upload Button */}
                  <label
                    htmlFor="file-upload"
                    className="px-6 py-3 text-lg font-semibold text-center text-white transition-all bg-green-600 rounded-lg cursor-pointer hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-500 focus:ring-opacity-50"
                  >
                    Choose File
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => uploadImage(e)}
                  />

                  {/* Sign Out Button */}
                  <button
                    onClick={() => signOut()}
                    className="px-6 py-3 text-lg font-semibold text-center text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    Sign Out
                  </button>
                </div>

                <p className="text-center text-gray-400">Your Images</p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
