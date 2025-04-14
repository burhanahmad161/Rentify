"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function MyItems() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get user ID from localStorage
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);

    const fetchRentals = async () => {
      try {
        const res = await fetch("/api/auctions");
        if (!res.ok) throw new Error("Failed to fetch rentals");
        const data = await res.json();

        // Filter items where owner matches logged-in user
        const userItems = data.filter(item => item.owner === storedUserId);
        setRentals(userItems);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (storedUserId) fetchRentals();
  }, []);

  const handleDelete = async (itemId) => {
    try {
      // Show confirmation dialog
      const userConfirmed = window.confirm(
        "Are you sure you want to delete this item? This action cannot be undone."
      );

      if (!userConfirmed) {
        return; // Exit if user cancels
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`/api/auctions/${itemId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Failed to delete item");

      // Remove deleted item from state
      setRentals(prev => prev.filter(item => item._id !== itemId));
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message);
    }
  };

  if (loading) return <p className="text-center py-10">Loading items...</p>;
  if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-indigo-600 py-20 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">My Items</h1>
        <p className="text-xl text-indigo-100">
          Manage your Items here
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {rentals.length === 0 ? (
          <p className="text-center text-gray-500">No items listed for rental.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rentals.map((item) => (
              <div key={item.rentalId} className="relative">
                <RentalCard rental={item} onDelete={handleDelete} />

                {/* Conditionally render delete icon or rented sign */}
                {item.isRented && (
                  <div className="absolute top-2 right-2 bg-green-600 text-white p-2 rounded-full text-xs">
                    Rented
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RentalCard({ rental, onDelete }) {
  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Accepted: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800"
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
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[rental.approvalStatus]}`}>
            {rental.approvalStatus}
          </span>
          { !rental.isRented && (<button
            onClick={() => onDelete(rental._id)}
            className="text-red-600 hover:text-red-800"
            title="Delete item"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">{rental.title}</h3>
        <p className="text-gray-500 text-sm mb-1">Category: {rental.category}</p>
        <p className="text-gray-600 mb-4 line-clamp-4">{rental.description}</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Rental Price</p>
            <p className="text-lg font-semibold text-gray-900">
              ${rental.price} / {rental.priceUnit}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}