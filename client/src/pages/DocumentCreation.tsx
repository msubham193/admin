import React, { useState, useEffect } from "react";

interface User {
  id: number;
  username: string;
  status: "Pending" | "Approved" | "Rejected";
}

const DocumentCreation: React.FC = () => {
  // State definitions with types
  const [documentName, setDocumentName] = useState<string>("");
  const [approvedUsers, setApprovedUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // Fetch approved users from backend using fetch API
  useEffect(() => {
    const fetchApprovedUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://admin-5fdy.onrender.com/api/users?status=Approved",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Send the token in the Authorization header
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch approved users");
        }
        const data: User[] = await response.json();
        setApprovedUsers(data);
      } catch (error) {
        console.error("Error fetching approved users:", error);
      }
    };

    fetchApprovedUsers();
  }, []);

  // Handle document creation
  const handleCreateDocument = async () => {
    if (!documentName || selectedUsers.length === 0) {
      alert("Please provide a document name and select at least one user.");
      return;
    }

    try {
      const response = await fetch("https://admin-5fdy.onrender.com/api/users/document", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          documentName,
          users: selectedUsers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create document");
      }

      const data = await response.json();
      console.log("Document created successfully:", data);
      // Reset form
      setDocumentName("");
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Create Document</h2>
      <div className="mb-4">
        <label className="block mb-2">Document Name</label>
        <input
          type="text"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          className="border px-4 py-2 rounded w-full"
          placeholder="Enter document name"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Select Users</label>
        <select
          multiple
          value={selectedUsers.map(String)} // Convert to string for the select value
          onChange={(e) =>
            setSelectedUsers(
              Array.from(e.target.selectedOptions, (option) =>
                parseInt(option.value, 10)
              )
            )
          }
          className="px-4 py-2 rounded w-full"
        >
          {approvedUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleCreateDocument}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Create Document
      </button>
    </div>
  );
};

export default DocumentCreation;
