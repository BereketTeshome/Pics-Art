import React, { useState, useEffect, useRef } from "react";
import GlowingBG from "../components/GlowingBG";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../utils/firebase.ts";
import { jwtDecode } from "jwt-decode";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Cookies from "universal-cookie";
import { FaTrash } from "react-icons/fa"; // Importing trash icon

const HomePage: React.FC = () => {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const imagesRef = useRef<HTMLDivElement>(null);
  const cookies = new Cookies();
  const token = cookies.get("jwt_access_token");

  const scrollToImages = () => {
    if (imagesRef.current) {
      imagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getJWTToken = () => {
    if (!token) {
      alert("Please log in to upload images.");
      return null;
    }
    return token;
  };

  const fetchUserImages = async (userEmail: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://pics-art-five.vercel.app/api/v1/images/"
      );
      const data = await response.json();
      const userImages = data.filter(
        (image: any) => image.createdBy === userEmail
      );
      setMedia(userImages);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (e: any) => {
    const file = e.target.files[0];
    const token = getJWTToken();

    if (!token) {
      return;
    }

    const decodedToken: any = jwtDecode(token);
    const userEmail = decodedToken.email;

    try {
      setUploading(true);
      const fileRef = ref(storage, `images/${uuidv4()}`);
      await uploadBytes(fileRef, file);
      const fileUrl = await getDownloadURL(fileRef);

      const response = await fetch(
        "https://pics-art-five.vercel.app/api/v1/images/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            imgName: fileUrl,
            createdBy: userEmail,
          }),
        }
      );

      if (response.ok) {
        const newImage = await response.json();
        alert("Image uploaded successfully!");
        setMedia((prevMedia) => [...prevMedia, newImage]);
      } else {
        alert("Failed to upload image to the server.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading the image.");
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id: number) => {
    const token = getJWTToken();
    if (!token) return;

    try {
      const response = await fetch(
        `https://pics-art-five.vercel.app/api/v1/images/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setMedia((prevMedia) => prevMedia.filter((image) => image.id !== id));
        alert("Image deleted successfully.");
      } else {
        alert("Failed to delete image.");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("An error occurred while deleting the image.");
    }
  };

  useEffect(() => {
    const token = getJWTToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      const userEmail = decodedToken.email;
      fetchUserImages(userEmail);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
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
              className="relative mb-10 md:mb-1 inline-block px-8 py-2 text-lg font-semibold text-white transition-all bg-orange-500 rounded-lg shadow-lg hover:bg-orange-400"
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

      {/* Image Upload Section */}
      <section className="w-full py-16 bg-transparent" ref={imagesRef}>
        <div className="container px-6 mx-auto">
          <div className="flex justify-between">
            <h2 className="mb-12 text-3xl font-bold text-center text-gray-300 md:text-4xl">
              Upload Your Images
            </h2>
          </div>

          <div className="text-white">
            <div className="flex items-center justify-between w-full mb-4">
              {/* File Upload Button */}
              <label
                htmlFor="file-upload"
                className="px-6 py-3 text-lg font-semibold text-center text-white transition-all bg-green-600 rounded-lg cursor-pointer hover:bg-green-500 focus:outline-none focus:ring focus:ring-green-500 focus:ring-opacity-50"
              >
                {uploading ? "Uploading..." : "Choose File"}
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => uploadImage(e)}
                disabled={uploading}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Image Display Section */}
      {loading ? (
        <div className="text-white">Loading images...</div>
      ) : media.length > 0 ? (
        <section className="w-full py-16 bg-transparent">
          <div className="container px-6 mx-auto">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {media.map((image: any) => (
                <div
                  key={image.id}
                  className="relative group transition-transform transform hover:scale-105"
                >
                  {/* Delete Icon */}
                  <button
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    onClick={() => deleteImage(image.id)}
                  >
                    <FaTrash className="w-6 h-6" />
                  </button>
                  <img
                    src={image.imgName}
                    alt={`uploaded ${image.id}`}
                    className="object-fit w-full cursor-pointer h-full rounded-lg min-h-[200px] shadow-lg border border-gray-700 hover:shadow-white transition-shadow"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="w-full py-16 bg-transparent">
          <div className="container px-6 mx-auto text-center">
            <img
              src="/404.png"
              alt="No images"
              className="object-cover w-64 h-w-64 mx-auto mb-6"
            />
            <p className="text-xl text-white">No images uploaded yet.</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
