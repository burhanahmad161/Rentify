"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";

dayjs.extend(relativeTime);
dayjs.extend(duration);

export default function RentalsPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch all rentals on mount
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await fetch("/api/auctions");
        if (!res.ok) throw new Error("Failed to fetch rentals");
        const data = await res.json();
        setRentals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, []);

  if (loading)
    return <p className="text-center py-10">Loading items...</p>;
  if (error)
    return (
      <p className="text-center py-10 text-red-500">Error: {error}</p>
    );

  // remove rented items from view
  const available = rentals.filter(
    (item) =>
      item.approvalStatus === "Accepted" && !item.isRented
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="bg-indigo-600 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          Available Rentals
        </h1>
        <p className="text-xl text-indigo-100">
          Discover and rent premium items effortlessly. Experience
          hassle-free rentals today!
        </p>
      </div>

      {/* Rentals List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Rental Items
        </h2>

        {available.length === 0 ? (
          <p className="text-center text-gray-500">
            No items available for rent.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {available.map((item) => (
              <RentalCard
                key={item._id}
                rental={item}
                onRented={(id) =>
                  setRentals((prev) =>
                    prev.map((r) =>
                      r._id === id ? { ...r, isRented: true } : r
                    )
                  )
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RentalCard({ rental, onRented }) {
  const [renting, setRenting] = useState(false);
  const [error, setError] = useState(null);

  const handleRent = async () => {
    setError(null);
    setRenting(true);
    try {
      const userId = localStorage.getItem("userId");

      const res = await fetch(
        `/api/auctions/${rental._id}/rent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "rent",           // This tells the server you're performing a rent action
            rentalId: rental._id,   // Rental item ID
            userId: userId          // Current user’s ID
          }),
        }
      );
      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message || "Rent failed");
      }
      // inform parent that this item is now rented
      onRented(rental._id);
      alert("Success! You’ve rented this item.");
    } catch (err) {
      setError(err.message);
    } finally {
      setRenting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-64">
        <Image
          src={rental.image}
          alt={rental.title}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          {rental.title}
        </h3>
        <p className="text-gray-500 text-sm mb-1">
          Category: {rental.category}
        </p>
        <p className="text-gray-600 mb-4">
          {rental.description}
        </p>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500">Rental Price</p>
            <p className="text-lg font-semibold text-gray-900">
              ${rental.price} / {rental.priceUnit}
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Posted {dayjs(rental.createdAt).fromNow()}
          </div>
        </div>

        {/* Rent Button */}
        <button
          onClick={handleRent}
          disabled={renting}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {renting ? "Renting…" : "Rent This Item"}
        </button>

        {error && (
          <p className="mt-2 text-red-500 text-sm">
            Error: {error}
          </p>
        )}
      </div>
    </div>
  );
}