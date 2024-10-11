import React, { useState, useEffect, useRef } from "react";
import GlowingBG from "../components/GlowingBG";
import HeroSection from "../components/HeroSection";
import ImageUploadSection from "../components/ImageUploadSection";
import { v4 as uuidv4 } from "uuid";
import { storage } from "../utils/firebase.ts";
import { jwtDecode } from "jwt-decode";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Cookies from "universal-cookie";

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
        "https://pics-art-backend.vercel.app/api/v1/images/"
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
        "https://pics-art-backend.vercel.app/api/v1/images/",
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
        `https://pics-art-backend.vercel.app/api/v1/images/${id}/`,
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

  const generateDescription = async (imageId: number, image_url: string) => {
    try {
      const response = await fetch(
        "https://pics-art-backend.vercel.app/api/image-description/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image_url: image_url,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMedia((prevMedia) =>
          prevMedia.map((image) =>
            image.id === imageId
              ? { ...image, description: data.description }
              : image
          )
        );
      } else {
        console.error("Failed to generate description");
      }
    } catch (error) {
      console.error("Error generating description:", error);
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
    <div className="min-h-screen bg-gray-900">
      <GlowingBG />
      <HeroSection scrollToImages={scrollToImages} />
      <ImageUploadSection
        media={media}
        loading={loading}
        uploading={uploading}
        uploadImage={uploadImage}
        deleteImage={deleteImage}
        generateDescription={generateDescription} // Pass the function here
        imagesRef={imagesRef}
      />
    </div>
  );
};

export default HomePage;
