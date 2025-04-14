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

  const [filters, setFilters] = useState({
    category: "All",
    minPrice: "",
    maxPrice: "",
  });

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

  const categories = ["All", "Electronics", "Fashion", "Vehicles", "Tools", "Furniture", "Others"];

  if (loading)
    return <p className="text-center py-10">Loading items...</p>;
  if (error)
    return (
      <p className="text-center py-10 text-red-500">Error: {error}</p>
    );

  const available = rentals.filter(
    item =>
      item.approvalStatus === "Accepted" &&
      !item.isRented &&
      (filters.category === "All" || item.category === filters.category) &&
      (filters.minPrice === "" || item.price >= parseFloat(filters.minPrice)) &&
      (filters.maxPrice === "" || item.price <= parseFloat(filters.maxPrice))
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
        <div className="sticky top-0 z-10 shadow-md py-4 px-4 md:px-8">
          <div className="rounded flex flex-col md:flex-row gap-4 pb-2">
            <select
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
              className="w-full md:w-1/3 px-4 py-2 border border-gray-600 rounded-lg text-indigo-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: e.target.value })
              }
              className="w-full md:w-1/3 px-4 py-2 border border-gray-600 rounded-lg text-gray-800 bg-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: e.target.value })
              }
              className="w-full md:w-1/3 px-4 py-2 border border-gray-600 rounded-lg text-gray-800 bg-white placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

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
  const [userRating, setUserRating] = useState(null);
  const [hasRated, setHasRated] = useState(false);
  const [avgRating, setAvgRating] = useState(rental.averageRating || 0);
  const [error, setError] = useState(null);
  const [ratingLoading, setRatingLoading] = useState(false);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (rental.ratings && userId) {
      const existing = rental.ratings.find(r => r.userId === userId);
      if (existing) {
        setHasRated(true);
        setUserRating(existing.stars);
      }
    }
  }, [rental.ratings, userId]);

  const handleRent = async () => {

    const confirmRent = window.confirm("Are you sure you want to rent this item?");
    if (!confirmRent) return;

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

  const handleRate = async (stars) => {
    setRatingLoading(true);
    try {
      const res = await fetch(`/api/auctions/${rental._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, stars }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Rating failed");

      const data = await res.json();
      setAvgRating(data.updatedAverage);
      setHasRated(true);
      setUserRating(stars);
    } catch (err) {
      alert(err.message);
    }
    finally {
      setRatingLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
      <div className="relative h-64">
        <Image
          src={rental.image}
          alt={rental.title}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="p-6 flex flex-col justify-between flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">
          {rental.title}
        </h3>
        <p className="text-gray-500 text-sm mb-1">
          Category: {rental.category}
        </p>
        <p className="text-gray-500 text-sm mb-1">
          Approx. Location: {rental.location ? rental.location : "Location not provided"}
        </p>

        <p className="text-gray-600 mb-4 line-clamp-4">
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

        {/* ⭐ Rating Display */}
        <div className="mb-2">
          <p className="text-sm text-yellow-600 font-medium">
            Average Rating: {rental.averageRating !== undefined ? rental.averageRating.toFixed(1) : "No ratings yet"} ⭐
          </p>
        </div>

        {/* ⭐ Rating Input */}
        {!hasRated && userId && (
          <div className="mb-4">
            <label className="block text-sm text-black mb-1">Rate this item:</label>
            {ratingLoading ? (
              <p className="text-gray-600 text-sm">Submitting rating...</p>
            ) : (<select
              value={userRating || ""}
              onChange={(e) => handleRate(parseInt(e.target.value))}
              className="w-full border px-3 py-1 rounded text-gray-700"
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} Star{n > 1 && "s"}
                </option>
              ))}
            </select>
            )}
          </div>
        )}

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