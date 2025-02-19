import { useState, useEffect } from "react";
import { getEvents, deleteEvent } from "../db/indexedDB";

const Log = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const storedEvents = await getEvents();
    setEvents(storedEvents);
  };

  const handleDelete = async (id) => {
    await deleteEvent(id);
    loadEvents(); // Refresh after delete
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Logged Events</h1>
      {events.length === 0 ? (
        <p>No events logged yet.</p>
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <li key={event.id} className="p-3 border rounded shadow">
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Time:</strong> {event.beginTime} - {event.endTime}</p>
              <p><strong>Details:</strong> {event.details}</p>
              <button onClick={() => handleDelete(event.id)} className="bg-red-500 text-white px-2 py-1 rounded mt-2">Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Log;
