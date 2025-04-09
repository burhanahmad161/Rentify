"use client";
import { useState } from "react";
import Logo from "../../Assets/4.jpg";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AuthProvider } from "../../AuthContext";
const UserDashboard = ({ children }) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    // Logic for logging out
    router.push("/");
  };

  return (
    <div className="flex flex-col h-screen">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div>
                {/* <Image
                  src={Logo}
                  alt="Rentify Logo"
                  width={250}
                  height={200}
                /> */}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/UserDashboard"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </a>
              <a
                href="/UserDashboard/Items"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Item for Rents
              </a>
              <a
                href="/UserDashboard/About"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                About
              </a>
              <a
                href="/UserDashboard/Contact"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Contact
              </a>
              <a
                href="/UserDashboard/RentedItems"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Rented Items
              </a>
              <a
                href="/UserDashboard/MyItems"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                My Items
              </a>
              <a
                href="/UserDashboard/AddItem"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Add an Item for Rent
              </a>
            </div>
          </div>
        </div>
      </nav>
      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-100">
        <AuthProvider>
          {children}
        </AuthProvider>
        <footer className="bg-white shadow-lg mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600">
              &copy; {new Date().getFullYear()} Rentify. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default UserDashboard;
