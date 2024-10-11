import React from "react";
import { FaTrash } from "react-icons/fa";

interface ImageUploadSectionProps {
  media: any[];
  loading: boolean;
  uploading: boolean;
  uploadImage: (e: any) => void;
  deleteImage: (id: number) => void;
  imagesRef: React.RefObject<HTMLDivElement>;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  media,
  loading,
  uploading,
  uploadImage,
  deleteImage,
  imagesRef,
}) => {
  return (
    <section className="w-full py-16 bg-transparent" ref={imagesRef}>
      <div className="container px-6 mx-auto">
        <div className="flex justify-between">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-300 md:text-4xl">
            Upload Your Images
          </h2>
        </div>

        {/* Image Upload Section */}
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
              onChange={uploadImage}
              disabled={uploading}
            />
          </div>
        </div>

        {/* Image Display Section */}
        {loading ? (
          <div className="text-white">Loading images...</div>
        ) : media.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {media.map((image: any) => (
              <div
                key={image.id}
                className="relative transition-transform transform group hover:scale-105"
              >
                {/* Delete Icon */}
                <button
                  className="absolute text-red-500 top-2 right-2 hover:text-red-700"
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
        ) : (
          <div className="container px-6 mx-auto text-center">
            <img
              src="/404.png"
              alt="No images"
              className="object-cover w-64 mx-auto mb-6 h-w-64"
            />
            <p className="text-xl text-white">No images uploaded yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ImageUploadSection;
