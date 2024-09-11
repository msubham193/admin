import React, { useState, useEffect } from "react";

interface User {
  _id: number; // or string, based on your API response
  username: string;
  email: string;
  role: string;
  status: "Pending" | "Approved" | "Rejected"; // Adjust to be more specific if possible
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch users from the backend
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`, // Add token if needed
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred.");
        }
      }
    };

    fetchUsers();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${id}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`, // Add token if needed
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve user");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, status: "Approved" } : user
        )
      );

      // Optionally refresh the list without reloading the page
      // const updatedUsers = await fetchUsers();
      // setUsers(updatedUsers);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt("Enter rejection reason:");
    if (reason) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/users/${id}/reject`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("token")}`, // Add token if needed
            },
            body: JSON.stringify({ reason }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to reject user");
        }

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, status: "Rejected" } : user
          )
        );

        // Optionally refresh the list without reloading the page
        // const updatedUsers = await fetchUsers();
        // setUsers(updatedUsers);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unexpected error occurred.");
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Username</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Role</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="py-2 px-4 border">{user.username}</td>
              <td className="py-2 px-4 border">{user.email}</td>
              <td className="py-2 px-4 border">{user.role}</td>
              <td className="py-2 px-4 border">{user.status}</td>
              <td className="py-2 px-4 border">
                {user.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(user._id)}
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(user._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
