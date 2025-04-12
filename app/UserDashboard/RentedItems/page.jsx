"use client";

import { useEffect, useState } from "react";

const RentedItems = () => {
  const [items, setItems] = useState([]);
  const [userId, setUserId] = useState(null);

  // Set the userId after component mounts
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    setUserId(storedUserId);
  }, []); // Empty dependency array ensures this runs only once, when the component mounts

  useEffect(() => {
    const fetchItems = async () => {
      const res = await fetch("/api/auctions");
      const data = await res.json();
      setItems(data);
    };

    fetchItems();
  }, []); // Empty dependency array ensures the fetch runs once

  // Filter items that the user has rented
  const userItems = items.filter(item => item.rentedBy === userId);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">My Rented Items</h2>
      {userId === null ? (
        <p>Loading your info...</p>
      ) : userItems.length === 0 ? (
        <p>You haven’t rented any items yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {userItems.map((item) => (
            <div key={item._id} className="border p-4 rounded shadow">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.category}</p>
              <p className="text-sm">Price: {item.price}/{item.priceUnit}</p>
              <p className="text-xs mt-2 text-green-600">Status: Rented</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RentedItems;
