import { useState } from "react";
import { addEvent } from "../db/indexedDB";

const EventForm = ({ onEventAdded }) => {
  const [date, setDate] = useState("");
  const [beginTime, setBeginTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !beginTime || !endTime || !details) {
      alert("Please fill in all fields.");
      return;
    }

    const newEvent = { date, beginTime, endTime, details };
    await addEvent(newEvent);
    onEventAdded();

    // Clear input fields
    setDate("");
    setBeginTime("");
    setEndTime("");
    setDetails("");
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Log a New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border rounded" />
        <input type="time" value={beginTime} onChange={(e) => setBeginTime(e.target.value)} className="w-full p-2 border rounded" />
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="w-full p-2 border rounded" />
        <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Enter event details" className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Log Event</button>
      </form>
    </div>
  );
};

export default EventForm;