import { useEffect, useState } from "react";
import { getEvents, deleteEvent, updateEvent } from "../db/indexedDB";

const EventLog = () => {
  const [events, setEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setEvents(await getEvents());
  };

  const handleDelete = async (id) => {
    await deleteEvent(id);
    loadEvents();
  };

  const handleEdit = (event) => {
    setEditEvent(event);
  };

  const handleUpdate = async () => {
    if (!editEvent) return;
    await updateEvent(editEvent);
    setEditEvent(null);
    loadEvents();
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Logged Events</h2>
      {events.length === 0 ? (
        <p>No events logged yet.</p>
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <li key={event.id} className="p-3 border rounded shadow">
              {editEvent?.id === event.id ? (
                <div>
                  <input value={editEvent.details} onChange={(e) => setEditEvent({ ...editEvent, details: e.target.value })} className="w-full p-2 border rounded" />
                  <button onClick={handleUpdate} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                </div>
              ) : (
                <div>
                  <p><strong>Date:</strong> {event.date}</p>
                  <p><strong>Time:</strong> {event.beginTime} - {event.endTime}</p>
                  <p><strong>Details:</strong> {event.details}</p>
                  <button onClick={() => handleEdit(event)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                  <button onClick={() => handleDelete(event.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventLog;