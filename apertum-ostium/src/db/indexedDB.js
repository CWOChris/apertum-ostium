import { openDB } from 'idb';

const DB_NAME = 'apertum-ostium';
const STORE_NAME = 'events';

const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                }
            },
    });
};

export const addEvent = async (event) => {
    const db = await initDB();
    return db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).add(event);
};

export const getEvents = async () => {
    const db = await initDB();
    return db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll();
};

export const updateEvent = async (event) => {
    const db = await initDB();
    return db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(event);
};

export const deleteEvent = async (id) => {
    const db = await initDB();
    return db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(id);
};