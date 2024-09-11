import React, { useState, useEffect } from "react";

const Dashboard: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [pendingApprovals, setPendingApprovals] = useState<number>(0);
  const [approvedUsers, setApprovedUsers] = useState<number>(0);

  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data from the server
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        if (!token) {
          setError("Authorization token not found");
          return;
        }
        const response = await fetch(
          "https://admin-5fdy.onrender.com/api/users/dashboard",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`, // Send the token in the Authorization header
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error fetching dashboard data");
        }
        const data = await response.json();

        // Assuming the server returns an object like { totalUsers: 100, pendingApprovals: 5, approvedUsers: 95 }
        setTotalUsers(data.totalUsers);
        setPendingApprovals(data.pendingApprovals);
        setApprovedUsers(data.approvedUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once when the component is mounted

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="bg-white p-4 shadow">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold">Total Users</h2>
            <p className="text-4xl font-bold">{totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold">Pending Approvals</h2>
            <p className="text-4xl font-bold">{pendingApprovals}</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold">Approved Users</h2>
            <p className="text-4xl font-bold">{approvedUsers}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
