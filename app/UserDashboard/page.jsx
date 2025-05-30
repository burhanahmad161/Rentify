"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import AuctionPic from "../../Assets/Auction.png";
import ChatPic from "../../Assets/chat.png";
import AiPic from "../../Assets/artificial-intelligence.png";
export default function Home() {
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        console.log(localStorage.getItem("jwtToken"));
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("jwtToken")}`
          },
          body: JSON.stringify({ action: "getId" }),
        });
        const data = await response.json();
        if (response.ok) {
          console.log(data);
          setUserId(data.userId);
          console.log("User authenticated", data.userId);
        } else {
          console.log("User not authenticated", data.error);
        }
      } catch (error) {
        console.error("API error:", error);
      }
    };
    fetchUserId();
  }, []);
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-indigo-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Welcome to Rentify, {userId}
          </h1>
          <p className="text-xl text-indigo-100 mb-8">
          List, rent, and discover premium items effortlessly. Experience secure and seamless rentals anytime, anywhere with Rentify!
          </p>
          <div className="space-x-4">
            <a
              href="/UserDashboard/Auctions"
              className="bg-white text-indigo-600 px-6 py-3 rounded-md text-lg font-semibold hover:bg-indigo-50"
            >
              Join Now
            </a>
            <a
              href="/UserDashboard/Auctions"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-white hover:text-indigo-600"
            >
              Explore Rentify
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Choose Rentify?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-indigo-100 rounded-full p-6 inline-block">
              <Image
                src={AuctionPic}
                alt="Auction Icon"
                width={50}
                height={50}
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mt-6">
              Rentify
            </h3>
            <p className="text-gray-600 mt-2">
              Experience the thrill of a new era with Rentify.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 rounded-full p-6 inline-block">
              <Image
                src={ChatPic}
                alt="Chat Icon"
                width={50}
                height={50}
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mt-6">
              Interactive Chat
            </h3>
            <p className="text-gray-600 mt-2">
              Chat with other team for a
              collaborative experience.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 rounded-full p-6 inline-block">
              <Image
                src={AiPic}
                alt="AI Icon"
                width={50}
                height={50}
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mt-6">
              AI-Powered Assistance
            </h3>
            <p className="text-gray-600 mt-2">
              Get personalized recommendations and strategies from our AI
              chatbot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}