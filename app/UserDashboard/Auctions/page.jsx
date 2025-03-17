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
    const [username, setUserName] = useState("");

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
                    setUserName(data.userId);
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

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await fetch("/api/auctions");
                if (!response.ok) throw new Error("Failed to fetch auctions");
                const data = await response.json();
                
                // Filter auctions with approvalStatus === "accepted" and remove expired auctions
                const approvedAuctions = data.filter(auction => 
                    auction.approvalStatus === "Accepted" && dayjs(auction.timeRemaining).isAfter(dayjs())
                );
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
                            <AuctionCard key={auction.auctionId} auction={auction} username={username} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function AuctionCard({ auction, username }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining(auction.timeRemaining));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [registered, setRegistered] = useState(false); // Track registration state

    // Check if the user is already registered for this auction
    useEffect(() => {
        if (auction.RegisteredUsers && auction.RegisteredUsers.includes(username)) {
            setRegistered(true); // Mark as registered if the username is in the list
        }
    }, [auction.RegisteredUsers, username]);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeRemaining(auction.timeRemaining));
        }, 1000);
        return () => clearInterval(interval);
    }, [auction.timeRemaining]);

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-64">
                <Image src={auction.image} alt={auction.title} layout="fill" objectFit="cover" />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{auction.title}</h3>
                <p className="text-gray-600 mb-4">{auction.description}</p>

                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-sm text-gray-500">Base Price</p>
                        <p className="text-lg font-semibold text-gray-900">${auction.currentBid}</p>
                    </div>
                    <button
                        className={`px-4 py-2 rounded-md ${
                            registered ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                        } text-white`}
                        onClick={() => setIsModalOpen(true)}
                        disabled={registered}
                    >
                        {registered ? "Registered" : "Register"}
                    </button>
                </div>

                <p className={`text-sm text-center font-semibold ${timeLeft.expired ? "text-red-500" : "text-green-600"}`}>
                    {timeLeft.expired ? "Auction ended" : `Auction Starts In: ${timeLeft.time}`}
                </p>
            </div>

            {isModalOpen && (
                <RegisterModal
                    auctionId={auction.auctionId}
                    username={username}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => setRegistered(true)} // Set registration state on success
                />
            )}
        </div>
    );
}

function RegisterModal({ auctionId, username, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const response = await fetch(`/api/auctions/${auctionId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ auctionId, username }),
            });

            if (!response.ok) throw new Error("Failed to register");

            setSuccess(true);
            setTimeout(() => {
                onSuccess(); // Notify AuctionCard of successful registration
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-black text-xl font-bold mb-4">Register for Auction</h2>
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-2">Registered successfully!</p>}

                <div className="flex justify-end space-x-2">
                    <button className="bg-gray-400 text-white px-4 py-2 rounded-md" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                        onClick={handleRegister}
                        disabled={loading}
                    >
                        {loading ? "Registering..." : "Submit"}
                    </button>
                </div>
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