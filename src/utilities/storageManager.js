import {CONST} from "./CONST.js";
//
export class StorageManager {
    // Vars:
    static state = "synced"; // "unsynced", "syncing", "synced
    // Refs:
    static localStorage = window.localStorage;
    static databaseStorage = CONST.URL;
    // Storage:
    static syncedObjects = new Map(); // {key -> {proxy, object, type, status}

    // Interface:
    static createSyncedObject(obj, type, key = obj.name) {
        // 1. Type: temp/local/database. Key: default is object name.
        // Create object:
        this.syncedObjects.set(key, { proxy: null, object: obj, type: type, status: 'unsynced' });
        // Setup Proxy:
        this.setupSyncedObject(key, type);
        // Return object:
        return this.syncedObjects.get(key).proxy;
    }
    static changeSyncedObject(key, type) {
        // 1. Change type of synced object.
        this.setObjectProperty(key, "type", type);
        this.setObjectProperty(key, "status", unsynced);
        this.setupSyncedObject(key, type);
    }
    static unSyncObject(key) {
        // 1. Unsync object from storage.
        alert("You cannot unsync objects yet.");
        // const unsyncedObj = this.proxyToObj(this.syncedObjects.get(key).proxy);
        // this.setObjectProperty(key, "proxy", )
        // delete this.syncedObjects.get(key).proxy;
        // this.syncedObjects.delete(key);
    }
    static getSyncedStatus(key = undefined) {
        // 1. Return synced object status: syncing/synced/unsynced.
        if (key === undefined) {
            return this.state;
        }
        return this.getObjectProperty(key, "status");
    }
    static resetStorage() {
        // 1. Reset all storage.
        this.localStorage.clear();
        this.clearDatabase();
        this.syncedObjects = new Map();
        location.reload(true);
    }
    static sync(key) {
        const type = this.getObjectProperty(key, "type");
        if (type === 'temp') {
            // No syncing needed.
            return;
        }
        if (type === 'local') {
            // Force proxy action:
            StorageManager.queueSyncObject(key, type);
            return;
        }
        if (type === 'database') {
            // Force proxy action:
            StorageManager.queueSyncObject(key, type);
            return;
        }
    }
    // Utils:
    static setupSyncedObject(key, type) {
        const existingProxy = this.syncedObjects.get(key).proxy;
        if (existingProxy) {
            // Remove proxy:
            this.setObjectProperty(key, "proxy", proxyToObj(existingProxy));
        }
        // Setup object:
        const obj = this.syncedObjects.get(key).object;
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
            const proxyObj = new Proxy(obj, {
                set: function (target, prop, value) {
                    target[prop] = value;
                    StorageManager.queueSyncObject(key, type);
                    return true;
                }
            });
            this.setObjectProperty(key, "proxy", proxyObj);
            return;
        }
        if (type === 'database') {
            // Check if exists in database:
            if (this.pullFromDatabase(key) === false) {
                this.pushToDatabase(key);
            }
            // Create proxy:
            const proxyObj = new Proxy(obj, {
                set: function (target, prop, value) {
                    target[prop] = value;
                    StorageManager.queueSyncObject(key, type);
                    return true;
                }
            });
            this.setObjectProperty(key, "proxy", proxyObj);
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
            console.log("Pulled from local storage.");
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
            if (property === "object") {
                Object.assign(this.syncedObjects.get(key).object, value);
            }
            else {
                this.syncedObjects.get(key)[property] = value;
            }
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
    static proxyToObj(proxy) {
        // 1. Return object from proxy.
        return Object.assign({}, proxy);
    }
    static queueSyncObject(key, type) {
        this.state = "unsynced";
        this.setObjectProperty(key, "status", "unsynced");
        this.debounce(() => {
            StorageManager.forceSyncObject(key, type);
        }, 5000)();
    }
    // Database:
    static async pullFromDatabase(key) {

    }
    static async pushToDatabase(key) {

    }
    static async clearDatabase() {

    }
    // Stop reload:
    static setup() {
        const interval = setInterval(() => {
            console.log(this.state);
            if (this.state !== "synced") {
                let hasUnsynced = false;
                this.syncedObjects.forEach((value) => {
                    if (value.status === 'unsynced') {
                        hasUnsynced = true;
                        return; 
                    }
                });
                if (hasUnsynced === false) {
                    this.state = "synced";
                }
            }
        }, 1000);
        window.addEventListener('beforeunload', function (e) {
            if (this.getSyncedStatus() !== "synced") {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes!';
            }
        });
    }   
}