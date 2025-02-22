"use client"; // Ensure this runs on the client side
import { useEffect, useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

dayjs.extend(relativeTime);
dayjs.extend(duration);

export default function Auctions() {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await fetch("/api/auctions");
                if (!response.ok) throw new Error("Failed to fetch auctions");
                const data = await response.json();
                
                // Filter auctions with approvalStatus === "accepted"
                const approvedAuctions = data.filter(auction => auction.approvalStatus === "Accepted");
                setAuctions(approvedAuctions);
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
                <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Ongoing Auctions</h2>
                {auctions.length === 0 ? (
                    <p className="text-center text-gray-500">No auctions available.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {auctions.map((auction) => (
                            <AuctionCard key={auction.auctionId} auction={auction} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function AuctionCard({ auction }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining(auction.timeRemaining));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeRemaining(auction.timeRemaining));
        }, 1000);

        return () => clearInterval(interval);
    }, [auction.timeRemaining]);

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-64">
                <Image
                    src={auction.image}
                    alt={auction.title}
                    layout="fill"
                    objectFit="cover"
                />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{auction.title}</h3>
                <p className="text-gray-600 mb-4">{auction.description}</p>

                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-sm text-gray-500">Base Price</p>
                        <p className="text-lg font-semibold text-gray-900">${auction.currentBid}</p>
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                        Register
                    </button>
                </div>

                <p className={`text-sm text-center font-semibold ${timeLeft.expired ? "text-red-500" : "text-green-600"}`}>
                    {timeLeft.expired ? "Auction ended" : `Auction Starts In: ${timeLeft.time}`}
                </p>
            </div>
        </div>
    );
}

function calculateTimeRemaining(endTime) {
    const now = dayjs();
    const end = dayjs(endTime);
    const diff = end.diff(now);

    if (diff <= 0) {
        return { time: "00:00:00", expired: true };
    }

    const duration = dayjs.duration(diff);
    const formattedTime = `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`;

    return { time: formattedTime, expired: false };
}
