"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AuthProvider } from "../../AuthContext";
import { FaBars, FaTimes, FaGavel, FaList, FaCheckCircle, FaPlusCircle, FaSignOutAlt } from "react-icons/fa";
import Logo from "../../Assets/4.jpg";

const AdminDashboard = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-[#1E293B] text-white h-full transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-20"} flex flex-col`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {/* <Image src={Logo} alt="BidGO Logo" width={isSidebarOpen ? 150 : 50} height={50} /> */}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-300 hover:text-white">
            {isSidebarOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
        <nav className="flex flex-col mt-4 space-y-2 px-4">
          <SidebarLink href="/AdminDashboard" icon={<FaGavel size={20} />} text="Pending Rentals" isSidebarOpen={isSidebarOpen} />
          <SidebarLink href="/UserDashboard/AddItem" icon={<FaPlusCircle size={20} />} text="Add an Item" isSidebarOpen={isSidebarOpen} />
          <SidebarLink href="/AdminDashboard/AllAuctions" icon={<FaList size={20} />} text="All Rentals" isSidebarOpen={isSidebarOpen} />
          <button onClick={handleLogout} className="flex items-center space-x-3 text-red-400 hover:text-red-500 py-2 text-sm font-medium">
            <FaSignOutAlt size={20} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <AuthProvider>{children}</AuthProvider>
      </div>
    </div>
  );
};

const SidebarLink = ({ href, icon, text, isSidebarOpen }) => (
  <a href={href} className="flex items-center space-x-3 text-gray-300 hover:text-white py-2 text-sm font-medium">
    {icon}
    {isSidebarOpen && <span>{text}</span>}
  </a>
);

export default AdminDashboard;
