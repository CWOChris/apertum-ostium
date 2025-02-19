import { openDB } from "idb";

const DB_NAME = "eventLoggerDB";
const EVENT_STORE = "events";
const USER_STORE = "users";

// Initialize IndexedDB
const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(EVENT_STORE)) {
        db.createObjectStore(EVENT_STORE, { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(USER_STORE)) {
        db.createObjectStore(USER_STORE, { keyPath: "username" });
      }
    },
  });
};

// Hash function (for storing passwords securely)
const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
};

// Register User with Security Question
export const registerUser = async (username, password, securityQuestion, securityAnswer) => {
  const db = await initDB();
  const existingUser = await db.transaction(USER_STORE, "readonly").objectStore(USER_STORE).get(username);
  
  if (existingUser) {
    return { success: false, message: "Username already exists." };
  }

  const hashedPassword = await hashPassword(password);
  const hashedAnswer = await hashPassword(securityAnswer); // Hash security answer too

  await db.transaction(USER_STORE, "readwrite").objectStore(USER_STORE).put({
    username, password: hashedPassword, securityQuestion, securityAnswer: hashedAnswer
  });

  return { success: true, message: "Registration successful!" };
};

// Login User
export const loginUser = async (username, password) => {
  const db = await initDB();
  const user = await db.transaction(USER_STORE, "readonly").objectStore(USER_STORE).get(username);
  
  if (!user) return { success: false, message: "User not found." };

  const hashedPassword = await hashPassword(password);
  if (hashedPassword !== user.password) {
    return { success: false, message: "Incorrect password." };
  }

  setLoggedInUser(username);
  return { success: true, message: "Login successful!" };
};

// Logout User
export const logoutUser = () => {
  localStorage.removeItem("loggedInUser");
};

// Get Logged-in User
export const getLoggedInUser = () => {
  return localStorage.getItem("loggedInUser");
};

// Set Logged-in User
export const setLoggedInUser = (username) => {
  localStorage.setItem("loggedInUser", username);
};

// Get Security Question for Password Reset
export const getSecurityQuestion = async (username) => {
  const db = await initDB();
  const user = await db.transaction(USER_STORE, "readonly").objectStore(USER_STORE).get(username);
  return user ? user.securityQuestion : null;
};

// Reset Password
export const resetPassword = async (username, securityAnswer, newPassword) => {
  const db = await initDB();
  const user = await db.transaction(USER_STORE, "readonly").objectStore(USER_STORE).get(username);
  
  if (!user) return { success: false, message: "User not found." };

  const hashedAnswer = await hashPassword(securityAnswer);
  if (hashedAnswer !== user.securityAnswer) {
    return { success: false, message: "Incorrect security answer." };
  }

  const hashedNewPassword = await hashPassword(newPassword);
  user.password = hashedNewPassword;

  await db.transaction(USER_STORE, "readwrite").objectStore(USER_STORE).put(user);
  return { success: true, message: "Password reset successful!" };
};

// Add Event (Associates event with logged-in user)
export const addEvent = async (event) => {
  const username = getLoggedInUser();
  if (!username) return;
  
  const db = await initDB();
  return db.transaction(EVENT_STORE, "readwrite").objectStore(EVENT_STORE).add({ ...event, username });
};

// Get Events for Logged-in User
export const getEvents = async () => {
  const username = getLoggedInUser();
  if (!username) return [];

  const db = await initDB();
  const allEvents = await db.transaction(EVENT_STORE, "readonly").objectStore(EVENT_STORE).getAll();
  return allEvents.filter(event => event.username === username);
};

// Delete Event
export const deleteEvent = async (id) => {
  const db = await initDB();
  return db.transaction(EVENT_STORE, "readwrite").objectStore(EVENT_STORE).delete(id);
};
