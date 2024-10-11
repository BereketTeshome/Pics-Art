import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";
import Cookies from "universal-cookie";

const Navbar: React.FC = () => {
  const cookie = new Cookies();
  const token = cookie.get("jwt_access_token");
  const navigate = useNavigate();

  const handleLogout = () => {
    cookie.remove("jwt_access_token");
    navigate("/login");
  };

  return (
    <nav className="px-4 py-3 bg-gray-900">
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="music logo" className="w-8 mr-2" />
          <span className="text-lg font-bold text-white">Pics-Art</span>
        </Link>

        {/* User Avatar / Sign In Button */}
        {token ? (
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center">
              <img
                src="/Tumblr.jpg"
                alt="User Avatar"
                className="w-8 h-8 rounded-full"
              />
            </Menu.Button>
            <Transition
              as={React.Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <Menu.Item>
                  {({ active }) => (
                    <Link
                      to="/uploads"
                      className={`${
                        active ? "bg-gray-100" : ""
                      } block px-4 py-2 text-gray-700`}
                    >
                      Uploads
                    </Link>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`${
                        active ? "bg-gray-100" : ""
                      } block w-full text-left px-4 py-2 text-gray-700`}
                    >
                      Logout
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 text-white transition duration-300 bg-orange-500 rounded-md hover:bg-orange-600"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
