"use client";
import { useEffect, useState } from "react";

export default function RegisteredUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/users"); // Update with your actual API route
                if (!response.ok) throw new Error("Failed to fetch users");
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <p className="text-center py-10">Loading users...</p>;
    if (error) return <p className="text-center py-10 text-red-500">Error: {error}</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 text-left">Registered Users</h2>
                {users.length === 0 ? (
                    <p className="text-center text-gray-500">No users found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border px-4 py-2 text-left text-gray-700">Username</th>
                                    <th className="border px-4 py-2 text-left text-gray-700">Email</th>
                                    <th className="border px-4 py-2 text-left text-gray-700">User ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.userId} className="border hover:bg-gray-50">
                                        <td className="border px-4 py-2 text-black">{user.username}</td>
                                        <td className="border px-4 py-2 text-black">{user.email}</td>
                                        <td className="border px-4 py-2 text-black">{user.userId}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
