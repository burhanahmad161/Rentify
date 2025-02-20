"use client"; // Ensure this runs on the client side
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Auctions() {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch auctions from the backend
    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await fetch("/api/auctions"); // Adjust the API endpoint if needed
                if (!response.ok) {
                    throw new Error("Failed to fetch auctions");
                }
                const data = await response.json();
                setAuctions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []);

    if (loading) return <p className="text-center py-10">Loading auctions...</p>;
    if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Hero Section */}
            <div className="bg-indigo-600 py-20 text-center">
                <h1 className="text-5xl font-bold text-white mb-6">Live Auctions</h1>
                <p className="text-xl text-indigo-100">
                    Explore and bid on unique items in real-time. Join the excitement now!
                </p>
            </div>

            {/* Auctions List Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                    Ongoing Auctions
                </h2>
                {auctions.length === 0 ? (
                    <p className="text-center text-gray-500">No auctions available.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {auctions.map((auction) => (
                            <div key={auction.auctionId} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="relative h-64">
                                    <Image
                                        src={auction.image} // Image URL from backend
                                        alt={auction.title}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{auction.title}</h3>
                                    <p className="text-gray-600 mb-4">{auction.description}</p>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-500">Current Bid</p>
                                            <p className="text-lg font-semibold text-gray-900">${auction.currentBid}</p>
                                        </div>
                                        <div>
                                            <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                                                Register
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
