import React from "react";
import { FaTrash } from "react-icons/fa";

interface ImageUploadSectionProps {
  media: any[];
  loading: boolean;
  uploading: boolean;
  uploadImage: (e: any) => void;
  deleteImage: (id: number) => void;
  generateDescription: (imageId: number, imgUrl: string) => void; // Fixed prop
  imagesRef: React.RefObject<HTMLDivElement>;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  media,
  loading,
  uploading,
  uploadImage,
  deleteImage,
  generateDescription,
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

                {/* Display Image */}
                <img
                  src={image.imgName}
                  alt={`uploaded ${image.id}`}
                  className="object-fit w-full cursor-pointer h-full rounded-lg min-h-[200px] shadow-lg border border-gray-700 hover:shadow-white transition-shadow"
                />

                {/* Generate Description Button */}
                <button
                  onClick={() => generateDescription(image.id, image.imgName)}
                  className="w-full px-3 py-2 mt-4 text-lg text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-400"
                >
                  Generate Description
                </button>

                {/* Placeholder for the image description */}
                {image.description && (
                  <p className="mt-2 text-sm text-gray-300">
                    {image.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No images uploaded yet.</p>
        )}
      </div>
    </section>
  );
};

export default ImageUploadSection;
