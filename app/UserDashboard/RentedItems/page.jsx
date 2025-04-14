"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";

const RentedItems = () => {
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch("/api/auctions");
      const data = await res.json();
      setItems(data);
    };

    fetchItems();
  }, []);

  const userItems = items.filter(item => item.rentedBy === userId);

  return (
    <div className="p-4">
       <div className="bg-indigo-600 py-20 text-center mb-5">
        <h1 className="text-5xl font-bold text-white mb-6">My Rented Items</h1>
        <p className="text-xl text-indigo-100">
          Manage you rented items here
        </p>
      </div>
      {userId === null ? (
        <p>Loading your info...</p>
      ) : userItems.length === 0 ? (
        <p>You haven’t rented any items yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {userItems.map((item) => (
            <RentedItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RentedItems;

const RentedItemCard = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <div className="relative h-64">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
          <p className="text-gray-500 text-sm mb-1">Category: {item.category}</p>
          <p className="text-gray-600 text-sm mb-2 line-clamp-5">{item.description}</p>

          <div className="mb-2">
            <p className="text-sm text-gray-500">Rental Price</p>
            <p className="text-lg font-semibold text-gray-900">
              ${item.price} / {item.priceUnit}
            </p>
          </div>

          <p className="text-sm text-gray-600">
            Rented On: {dayjs(item.rentedAt).format("MMM D, YYYY")}
          </p>

          {item.returnDate && (
            <p className="text-sm text-gray-600">
              Return By: {dayjs(item.returnDate).format("MMM D, YYYY")}
            </p>
          )}
        </div>

        <div className="mt-4 text-sm font-medium text-green-600">
          ✅ Status: Rented
        </div>
      </div>
    </div>
  );
};