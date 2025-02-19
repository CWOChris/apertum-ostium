import { useState, useEffect } from "react";
import { getEvents, deleteEvent, updateEvent } from "../db/indexedDB";

const Log = () => {
  const [events, setEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);
  const [sortBy, setSortBy] = useState("all"); // Default to "All"
  const [filterDate, setFilterDate] = useState(""); // For filtering

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const storedEvents = await getEvents();
    setEvents(storedEvents);
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

  const handleSort = (a, b) => {
    if (sortBy === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortBy === "time") {
      return a.beginTime.localeCompare(b.beginTime);
    } 
    return 0; // "All" keeps the original order
  };

  const handleClearFilter = () => {
    setFilterDate(""); // ✅ Clears the date input field
  };

  const filteredEvents = events
    .filter(event => !filterDate || event.date === filterDate) // Apply date filter
    .sort(sortBy === "all" ? () => 0 : handleSort); // Apply sorting only if not "All"

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Logged Events</h1>

      {/* Sorting and Filtering Controls */}
      <div className="mb-4 flex gap-4">
        <label>
          Sort by:
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="ml-2 p-2 border rounded">
            <option value="all">All</option>  {/* ✅ Added "All" option */}
            <option value="date">Date</option>
            <option value="time">Time</option>
          </select>
        </label>
        <label>
          Filter by Date:
          <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="ml-2 p-2 border rounded" />
        </label>
        <button onClick={handleClearFilter} className="bg-gray-500 text-white px-2 py-1 rounded">
          Clear Filter
        </button>  {/* ✅ Clear Filter Button */}
      </div>

      {filteredEvents.length === 0 ? (
        <p>No events logged yet.</p>
      ) : (
        <ul className="space-y-2">
          {filteredEvents.map((event) => (
            <li key={event.id} className="p-3 border rounded shadow">
              {editEvent?.id === event.id ? (
                <div>
                  <input type="date" value={editEvent.date} onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })} className="w-full p-2 border rounded" />
                  <input type="time" value={editEvent.beginTime} onChange={(e) => setEditEvent({ ...editEvent, beginTime: e.target.value })} className="w-full p-2 border rounded" />
                  <input type="time" value={editEvent.endTime} onChange={(e) => setEditEvent({ ...editEvent, endTime: e.target.value })} className="w-full p-2 border rounded" />
                  <textarea value={editEvent.details} onChange={(e) => setEditEvent({ ...editEvent, details: e.target.value })} className="w-full p-2 border rounded" />
                  <button onClick={handleUpdate} className="bg-green-500 text-white px-2 py-1 rounded mt-2">Save</button>
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

export default Log;
