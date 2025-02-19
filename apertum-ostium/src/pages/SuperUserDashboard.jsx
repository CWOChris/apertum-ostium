import { useState, useEffect } from "react";
import { getPendingEvents, approveEvent, denyEvent, lockAdminAccount, getUserEvents } from "../db/indexedDB";

const SuperUserDashboard = ({ superUserUsername }) => {
  const [events, setEvents] = useState([]);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    loadPendingEvents();
    loadAdminUsers();
  }, []);

  const loadPendingEvents = async () => {
    const pendingEvents = await getPendingEvents();
    setEvents(pendingEvents);
  };

  const loadAdminUsers = async () => {
    const users = await getUserEvents();
    setAdmins(users.filter(user => user.role === "admin"));
  };

  const handleApprove = async (eventId) => {
    await approveEvent(eventId, superUserUsername);
    loadPendingEvents();
  };

  const handleDeny = async (eventId) => {
    await denyEvent(eventId, superUserUsername);
    loadPendingEvents();
  };

  const handleLockAdmin = async (adminUsername) => {
    await lockAdminAccount(adminUsername);
    loadAdminUsers();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Super-User Dashboard</h1>

      <h2 className="text-lg font-semibold">Pending Events</h2>
      {events.length === 0 ? (
        <p>No pending events.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id} className="p-3 border rounded mb-2">
              <p><strong>User:</strong> {event.username}</p>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Details:</strong> {event.details}</p>
              <button onClick={() => handleApprove(event.id)} className="bg-green-500 text-white px-2 py-1 rounded">Approve</button>
              <button onClick={() => handleDeny(event.id)} className="bg-red-500 text-white px-2 py-1 rounded ml-2">Deny</button>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-lg font-semibold mt-6">Admin Accounts</h2>
      {admins.length === 0 ? (
        <p>No admins available.</p>
      ) : (
        <ul>
          {admins.map((admin) => (
            <li key={admin.username} className="p-3 border rounded mb-2">
              <p><strong>Admin:</strong> {admin.username}</p>
              <button onClick={() => handleLockAdmin(admin.username)} className="bg-red-500 text-white px-2 py-1 rounded">Lock Account</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SuperUserDashboard;
