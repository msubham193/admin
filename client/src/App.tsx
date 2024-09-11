import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddUser from "./pages/AddUser";
import UserManagement from "./pages/UserManagement";
import Register from "./pages/Register";
import DocumentCreation from "./pages/DocumentCreation";
import UserPortal from "./pages/UserPortal";
import Sidebar from "./components/Sidebar";

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-user" element={<AddUser />} />
            <Route path="/user-management" element={<UserManagement />} />
            <Route path="/document-creation" element={<DocumentCreation />} />
            <Route path="/user-portal" element={<UserPortal />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
