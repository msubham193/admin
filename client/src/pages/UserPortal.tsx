import React, { useState, useEffect } from 'react';

interface Document {
  id: number;
  name: string;
  status: 'Pending' | 'Approved';
}

const UserPortal: React.FC = () => {
  const [documents] = useState<Document[]>([]);

  useEffect(() => {
    // Fetch user's documents from backend
    // Example: axios.get('/api/user/documents').then(response => setDocuments(response.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Documents</h2>
      {documents.length === 0 ? (
        <p>No documents assigned.</p>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Document Name</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.id}>
                <td className="border px-4 py-2">{doc.name}</td>
                <td className="border px-4 py-2">{doc.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserPortal;
