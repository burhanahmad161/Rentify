"use client"; // Ensure this runs on the client side
import { useEffect, useState } from "react";
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
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ongoing Auctions</h2>
                {auctions.length === 0 ? (
                    <p className="text-center text-gray-500">No auctions available.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-4 py-2 text-left text-gray-700">Title</th>
                                    <th className="border px-4 py-2 text-left text-gray-700">Category</th>
                                    <th className="border px-4 py-2 text-left text-gray-700">Description</th>
                                    <th className="border px-4 py-2 text-left text-gray-700">Rental Price</th>
                                    <th className="border px-4 py-2 text-left text-gray-700">Price Unit</th>
                                    <th className="border px-4 py-2 text-center text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auctions.map((auction) => (
                                    <AuctionRow key={auction.auctionId} auction={auction} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function AuctionRow({ auction }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining(auction.timeRemaining));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeRemaining(auction.timeRemaining));
        }, 1000);

        return () => clearInterval(interval);
    }, [auction.timeRemaining]);

    return (
        <tr className="border hover:bg-gray-50">
            <td className="border px-4 py-2 text-black">{auction.title}</td>
            <td className="border px-4 py-2 text-black">{auction.category}</td>
            <td className="border px-4 py-2 text-black">{auction.description}</td>
            <td className="border px-4 py-2 text-black">{auction.price}</td>
            <td className="border px-4 py-2 text-black">{auction.priceUnit}</td>
            {/* <td className={`border px-4 py-2 ${timeLeft.expired ? "text-red-500" : "text-green-600"}`}>
                {timeLeft.expired ? "Auction ended" : timeLeft.time}
            </td> */}
            <td className="border px-4 py-2 text-center">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">{auction.approvalStatus}</button>
            </td>
        </tr>
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
