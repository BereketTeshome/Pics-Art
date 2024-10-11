// import React, { useState } from "react";
// import Modal from "react-modal";
// import Cookies from "universal-cookie";
// import { supabase } from "../utils/supabaseClient.js";

// interface UploadPopupProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const UploadPopup: React.FC<UploadPopupProps> = ({ isOpen, onClose }) => {
//   const [imageFile, setImageFile] = useState<File | null>(null);
//   const [imgName, setImgName] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const cookies = new Cookies();
//   const createdBy = cookies.get("jwt_access");

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       setImgName(file.name);
//     }
//   };

//   const handleUpload = async () => {
//     if (!imageFile || !createdBy) return;

//     try {
//       setIsUploading(true);
//       // Upload to Supabase storage
//       const { data, error } = await supabase.storage
//         .from("images")
//         .upload(`public/${imageFile.name}`, imageFile);

//       if (error) {
//         console.error(error);
//         return;
//       }

//       // Get the public URL of the uploaded image
//       const publicUrl = supabase.storage.from("images").getPublicUrl(data.path);

//       // Submit your form with imgName (URL) and createdBy
//       const formData = {
//         imgName: publicUrl.data.publicUrl,
//         createdBy: createdBy,
//       };

//       // You can now send `formData` to your server.
//       console.log("FormData: ", formData);

//       // Close the modal on success
//       onClose();
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose}
//       contentLabel="Upload Image"
//       className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
//     >
//       <div className="relative p-8 bg-white rounded-lg shadow-lg">
//         <h2 className="mb-4 text-xl font-semibold text-gray-700">
//           Upload Image
//         </h2>
//         <input type="file" accept="image/*" onChange={handleFileChange} />
//         {imgName && (
//           <p className="mt-2 text-sm text-gray-500">File: {imgName}</p>
//         )}
//         <button
//           className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
//           onClick={handleUpload}
//           disabled={isUploading}
//         >
//           {isUploading ? "Uploading..." : "Upload"}
//         </button>
//         <button
//           className="absolute text-gray-600 top-2 right-2 hover:text-gray-900"
//           onClick={onClose}
//         >
//           ×
//         </button>
//       </div>
//     </Modal>
//   );
// };

// export default UploadPopup;
