"use client";
import Image from "next/image";
import Team1 from "../../../Assets/ceo.png"; // Replace with your team images
import Team2 from "../../../Assets/ceo.png";
import Team3 from "../../../Assets/ceo.png";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-indigo-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">About BidGO</h1>
          <p className="text-xl text-indigo-100 mb-8">
            Discover the story behind BidGO and the team that makes it all
            possible.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            At BidGO, our mission is to revolutionize the way people participate
            in auctions. We aim to provide a seamless, interactive, and
            transparent platform where users can bid, win, and discover unique
            items from the comfort of their homes.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="text-center">
            <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden shadow-lg">
              <Image
                src={Team1}
                alt="Team Member 1"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mt-6">
              Burhan Ahmad
            </h3>
            <p className="text-gray-600 mt-2">CEO & Founder</p>
          </div>
          <div className="text-center">
            <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden shadow-lg">
              <Image
                src={Team2}
                alt="Team Member 2"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mt-6">
            Ifra Fazal
            </h3>
            <p className="text-gray-600 mt-2">SQA Lead</p>
          </div>
          <div className="text-center">
            <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden shadow-lg">
              <Image
                src={Team3}
                alt="Team Member 3"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mt-6">
            Burhan Ahmad
            </h3>
            <p className="text-gray-600 mt-2">Lead Developer</p>
          </div>
          <div className="text-center">
            <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden shadow-lg">
              <Image
                src={Team3}
                alt="Team Member 3"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mt-6">
            Burhan Ahmad
            </h3>
            <p className="text-gray-600 mt-2">Lead Designer</p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-indigo-100 rounded-full p-6 inline-block">
              <svg
                className="w-12 h-12 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mt-6">
              Innovation
            </h3>
            <p className="text-gray-600 mt-2">
              We constantly innovate to provide the best auction experience.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 rounded-full p-6 inline-block">
              <svg
                className="w-12 h-12 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mt-6">
              Community
            </h3>
            <p className="text-gray-600 mt-2">
              We foster a vibrant community of bidders and sellers.
            </p>
          </div>
          <div className="text-center">
            <div className="bg-indigo-100 rounded-full p-6 inline-block">
              <svg
                className="w-12 h-12 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mt-6">
              Transparency
            </h3>
            <p className="text-gray-600 mt-2">
              We ensure a fair and transparent bidding process.
            </p>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Join the Auction Revolution?
          </h2>
          <a
            href="#"
            className="bg-white text-indigo-600 px-6 py-3 rounded-md text-lg font-semibold hover:bg-indigo-50"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}