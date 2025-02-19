import { useState, useEffect } from "react";
import { getPendingEvents, approveEvent, denyEvent, editEvent, getUserEvents } from "../db/indexedDB";

const AdminDashboard = ({ adminUsername }) => {
  const [events, setEvents] = useState([]);
  const [editEventData, setEditEventData] = useState(null);

  useEffect(() => {
    loadPendingEvents();
  }, []);

  const loadPendingEvents = async () => {
    const pendingEvents = await getPendingEvents();
    setEvents(pendingEvents);
  };

  const handleApprove = async (eventId) => {
    await approveEvent(eventId, adminUsername);
    loadPendingEvents();
  };

  const handleDeny = async (eventId) => {
    await denyEvent(eventId, adminUsername);
    loadPendingEvents();
  };

  const handleEdit = (event) => {
    setEditEventData(event);
  };

  const handleEditSave = async () => {
    if (!editEventData) return;
    await editEvent(editEventData.id, editEventData, adminUsername);
    setEditEventData(null);
    loadPendingEvents();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>
      {events.length === 0 ? (
        <p>No pending events.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id} className="p-3 border rounded mb-2">
              {editEventData?.id === event.id ? (
                <div>
                  <input
                    type="date"
                    value={editEventData.date}
                    onChange={(e) => setEditEventData({ ...editEventData, date: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="time"
                    value={editEventData.beginTime}
                    onChange={(e) => setEditEventData({ ...editEventData, beginTime: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    value={editEventData.details}
                    onChange={(e) => setEditEventData({ ...editEventData, details: e.target.value })}
                    className="w-full p-2 border rounded"
                  />
                  <button onClick={handleEditSave} className="bg-green-500 text-white px-2 py-1 rounded mt-2">Save</button>
                </div>
              ) : (
                <div>
                  <p><strong>User:</strong> {event.username}</p>
                  <p><strong>Date:</strong> {event.date}</p>
                  <p><strong>Details:</strong> {event.details}</p>
                  <button onClick={() => handleApprove(event.id)} className="bg-green-500 text-white px-2 py-1 rounded">Approve</button>
                  <button onClick={() => handleDeny(event.id)} className="bg-red-500 text-white px-2 py-1 rounded ml-2">Deny</button>
                  <button onClick={() => handleEdit(event)} className="bg-yellow-500 text-black px-2 py-1 rounded ml-2">Edit</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;
