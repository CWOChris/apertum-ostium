import { useState, useEffect } from "react";
import EventForm from "../components/EventForm";
import { getEvents } from "../db/indexedDB";

const Home = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const storedEvents = await getEvents();
    setEvents(storedEvents);
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Log a New Event</h1>
      <EventForm onEventAdded={loadEvents} /> {/* ✅ Fix: Pass loadEvents */}
    </div>
  );
};

export default Home;
