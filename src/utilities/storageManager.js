import {CONST} from "./CONST.js";
//
export class StorageManager {
    // Refs:
    static tempStorage = new Map();
    static localStorage = window.localStorage;
    static databaseStorage = CONST.URL;
    // Storage:
    static syncedObjects = new Map(); // {key -> {object, type, status}

    // Interface:
    static createSyncedObject(obj, type, key = obj.name) {
        // 1. Type: temp/local/database. Key: default is object name.
        // Create object:
        this.syncedObjects.set(key, { object: obj, type: type, status: 'unsynced' });
        // Setup Sync:
        this.setupSyncObject(key, type);
        // Return object:
        return this.syncedObjects.get(key).object;
    }
    static changeSyncedObject(key, type) {
        // 1. Change type of synced object.
        this.setObjectProperty(key, "type", type);
        this.setObjectProperty(key, "status", unsynced);
        this.setupSyncObject(key, type);
    }
    static unSyncObject(key) {
        // 1. Unsync object from storage.
        delete this.syncedObjects.get(key).object.proxy;
        this.syncedObjects.delete(key);
    }
    static getSyncedStatus(key) {
        // 1. Return synced object status: syncing/synced/unsynced.
        return this.getObjectProperty(key, "status");
    }
    static resetStorage() {
        // 1. Reset all storage.
        this.tempStorage = new Map();
        this.localStorage.clear();
        this.clearDatabase();
        this.syncedObjects = new Map();
    }

    // Utils:
    static setupSyncObject(key, type) {
        // Remove proxy:
        delete this.syncedObjects.get(key).object.proxy;
        // Setup object:
        if (type === 'temp') {
            this.setObjectProperty(key, "status", "synced");
            // No syncing needed.
            return;
        }
        if (type === 'local') {
            // Check if exists in local:
            if (this.pullFromLocal(key) === false) {
                this.pushToLocal(key);
            }
            // Create proxy:
            const proxy = new Proxy(obj, {
                set: function (target, prop, value) {
                    target[prop] = value;
                    this.setObjectProperty(key, "status", "unsynced");
                    this.debounce(() => {
                        this.forceSyncObject(key, type);
                    }, 5000)();
                    return true;
                }
            });
            return;
        }
        if (type === 'database') {
            // Check if exists in database:
            if (this.pullFromDatabase(key) === false) {
                this.pushToDatabase(key);
            }
            // Create proxy:
            const proxy = new Proxy(obj, {
                set: function (target, prop, value) {
                    target[prop] = value;
                    this.setObjectProperty(key, "status", "unsynced");
                    this.debounce(() => {
                        this.forceSyncObject(key, type);
                    }, 5000)();
                    return true;
                }
            });
            return;
        }
    }
    static forceSyncObject(key, type) {
        if (type === 'temp') {
            // No syncing needed.
            return;
        }
        if (type === 'local') {
            // Check if exists in local:
            this.pushToLocal(key);
            return;
        }
        if (type === 'database') {
            // Check if exists in database:
            this.pushToDatabase(key);
            return;
        }
    }
    static pullFromLocal(key) {
        // 1. Pull object from local storage.
        const json = this.localStorage.getItem(key);
        if (json) {
            this.setObjectProperty(key, "object", JSON.parse(json));
            return true;
        }
        return false;
    }
    static pushToLocal(key) {
        // 1. Push object to local storage.
        this.localStorage.setItem(key, JSON.stringify(this.getObjectProperty(key, "object")));
        this.setObjectProperty(key, "status", "synced");
    }
    static getObjectProperty(key, property) {
        // 1. Get object property.
        const keyObj = this.syncedObjects.get(key);
        if (keyObj) {
            return keyObj[property];
        }
        alert('Key not found.');
        return null;
    }
    static setObjectProperty(key, property, value) {
        // 2. Set object property.
        if (this.syncedObjects.has(key)) {
            this.syncedObjects.get(key)[property] = value;
            return true;
        }
        alert('Key not found.');
        return false;
    }
    static debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }
    // Database:
    static async pullFromDatabase(key) {

    }
    static async pushToDatabase(key) {

    }
    static async clearDatabase() {

    }
}