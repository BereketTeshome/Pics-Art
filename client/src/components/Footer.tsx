import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0a183d] text-white py-8 mt-24 w-full text-center flex flex-col items-center">
      <div className="flex flex-col items-center w-full max-w-6xl gap-5">
        {/* Logo Section */}
        <div className="flex items-center gap-2 text-2xl font-bold animate-bounceIn">
          <img src="/logo.png" alt="footer logo" className="w-8 mr-2" />
          <span>Pics-Art</span>
        </div>

        {/* Social Media Icons */}
        <div className="flex gap-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook className="text-lg text-gray-200 transition duration-300 transform hover:text-orange-500 hover:scale-125" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter className="text-lg text-gray-200 transition duration-300 transform hover:text-orange-500 hover:scale-125" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="text-lg text-gray-200 transition duration-300 transform hover:text-orange-500 hover:scale-125" />
          </a>
        </div>

        {/* Paragraph Section */}
        <p className="max-w-lg mt-4 text-sm leading-6 text-gray-200">
          Discover a world of images with PicsArt. Stay tuned, stay connected,
          and let the rhythm take you away!
        </p>
      </div>
    </footer>
  );
};

export default Footer;
