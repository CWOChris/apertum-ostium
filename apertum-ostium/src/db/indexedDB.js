import { openDB } from "idb";

const DB_NAME = "eventLoggerDB";
const USER_STORE = "users";
const EVENT_STORE = "events";
const APPROVAL_STORE = "approval_log";
const TEAM_STORE = "teams";

// Initialize IndexedDB
const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(USER_STORE)) {
        const userStore = db.createObjectStore(USER_STORE, { keyPath: "username" });
        userStore.createIndex("role", "role", { unique: false });
      }
      if (!db.objectStoreNames.contains(EVENT_STORE)) {
        db.createObjectStore(EVENT_STORE, { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(APPROVAL_STORE)) {
        db.createObjectStore(APPROVAL_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(TEAM_STORE)) {
        db.createObjectStore(TEAM_STORE, { keyPath: "teamName" });
      }
    },
  });
};

// Hash password for security
const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
};

// 🟢 PHASE 1: USER MANAGEMENT 🟢

// Register a new user
export const registerUser = async (username, password, role = "user", securityQuestion, securityAnswer) => {
  const db = await initDB();
  const existingUser = await db.get(USER_STORE, username);
  if (existingUser) return { success: false, message: "Username already exists." };

  const hashedPassword = await hashPassword(password);
  const hashedAnswer = await hashPassword(securityAnswer);

  await db.put(USER_STORE, {
    username,
    password: hashedPassword,
    role,
    teams: [],
    securityQuestion,
    securityAnswer: hashedAnswer,
    locked: false,  // For admin lock feature
  });

  return { success: true, message: "Registration successful!" };
};

// Login user
export const loginUser = async (username, password) => {
  const db = await initDB();
  const user = await db.get(USER_STORE, username);
  if (!user) return { success: false, message: "User not found." };
  if (user.locked) return { success: false, message: "Your account has been locked by a Super-User." };

  const hashedPassword = await hashPassword(password);
  if (hashedPassword !== user.password) return { success: false, message: "Incorrect password." };

  return { success: true, message: "Login successful!", user };
};

// Get security question for password recovery
export const getSecurityQuestion = async (username) => {
  const db = await initDB();
  const user = await db.get(USER_STORE, username);
  return user ? user.securityQuestion : null;
};

// Reset password
export const resetPassword = async (username, securityAnswer, newPassword) => {
  const db = await initDB();
  const user = await db.get(USER_STORE, username);
  if (!user) return { success: false, message: "User not found." };

  const hashedAnswer = await hashPassword(securityAnswer);
  if (hashedAnswer !== user.securityAnswer) return { success: false, message: "Incorrect security answer." };

  user.password = await hashPassword(newPassword);
  await db.put(USER_STORE, user);

  if (user.role === "admin") {
    notifySuperUsersOfAdminReset(username);
  }

  return { success: true, message: "Password reset successfully!" };
};

// Notify all Super-Users when an Admin resets their password
const notifySuperUsersOfAdminReset = async (adminUsername) => {
  const db = await initDB();
  const users = await db.getAll(USER_STORE);
  const superUsers = users.filter(user => user.role === "super-user");

  for (const superUser of superUsers) {
    console.log(`🔶 Alert: Admin ${adminUsername} has reset their password.`);
  }
};

// Lock an admin account (Super-User only)
export const lockAdminAccount = async (adminUsername) => {
  const db = await initDB();
  const user = await db.get(USER_STORE, adminUsername);
  if (!user || user.role !== "admin") return { success: false, message: "Invalid admin username." };

  user.locked = true;
  await db.put(USER_STORE, user);

  return { success: true, message: `Admin ${adminUsername} has been locked.` };
};

// 🟢 PHASE 2: EVENT LOGGING & APPROVAL SYSTEM 🟢

// Add a new event
export const addEvent = async (event) => {
  const db = await initDB();
  const user = await db.get(USER_STORE, event.username);
  if (!user) return { success: false, message: "User not found." };

  event.status = "pending";
  event.approvedBy = null;
  event.editedBy = null;
  event.editHistory = [];

  await db.add(EVENT_STORE, event);
  return { success: true, message: "Event added successfully!" };
};

// Fetch all events for a user
export const getUserEvents = async (username) => {
  const db = await initDB();
  const allEvents = await db.getAll(EVENT_STORE);
  return allEvents.filter(event => event.username === username);
};

// Fetch all pending events (for admins)
export const getPendingEvents = async () => {
  const db = await initDB();
  const allEvents = await db.getAll(EVENT_STORE);
  return allEvents.filter(event => event.status === "pending");
};

// Approve an event
export const approveEvent = async (eventId, approverUsername) => {
  const db = await initDB();
  const event = await db.get(EVENT_STORE, eventId);
  if (!event) return { success: false, message: "Event not found." };

  event.status = "approved";
  event.approvedBy = approverUsername;
  await db.put(EVENT_STORE, event);

  return { success: true, message: "Event approved successfully!" };
};

// Deny an event
export const denyEvent = async (eventId, approverUsername) => {
  const db = await initDB();
  const event = await db.get(EVENT_STORE, eventId);
  if (!event) return { success: false, message: "Event not found." };

  event.status = "denied";
  event.approvedBy = approverUsername;
  await db.put(EVENT_STORE, event);

  return { success: true, message: "Event denied successfully!" };
};

// Edit an event
export const editEvent = async (eventId, updatedData, editorUsername, isSuperUser = false) => {
  const db = await initDB();
  const event = await db.get(EVENT_STORE, eventId);
  if (!event) return { success: false, message: "Event not found." };

  event.editHistory.push({
    editedBy: editorUsername,
    timestamp: new Date().toISOString(),
    previousData: { ...event }
  });

  Object.assign(event, updatedData);
  event.editedBy = editorUsername;

  if (isSuperUser) {
    event.status = "approved";
  } else {
    event.status = "pending"; 
  }

  await db.put(EVENT_STORE, event);
  return { success: true, message: "Event updated successfully!" };
};

// Fetch event by ID (for audit tracking)
export const getEventById = async (eventId) => {
  const db = await initDB();
  return await db.get(EVENT_STORE, eventId);
};
