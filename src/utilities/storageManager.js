import {CONST} from "./CONST.js";
//
export class StorageManager {
    // Refs:
    static localStorage = window.localStorage;
    static databaseStorage = CONST.URL;
    // Storage:
    static syncedObjects = new Map(); // {key -> proxy: {object, type, status}

    // Workflow:
    // 1. Creating a synced object (createSyncedObject) returns a key/proxy.
    // 2. The synced object will automatically sync to storage.
    // 3. Access and modify the synced object through the key/proxy.
    // 4. Communicates with observerManager to rerender when synced object is modified.
    // Behind the scenes:
    // - The synced object is stored in a map.
    // - Calling modify() or read() on the 'proxy' returns the original object.
    // - The proxy will queue the object to be synced, as well as call events.

    // Interface:
    static createSyncedObject(obj, type, key = obj.name) {
        // 1. 'temp': unsynced to storage, but works with Observer.
        // 2. 'local': synced to local storage.
        // 3. 'database': synced to database.
        // Create object:
        const status = (type === "temp" ? "synced" : "unsynced");
        if (status === "unsynced" && key !== "StorageState") {
            this.modify("StorageState", this.read("StorageState") + 1);
        }
        const proxyObj = { object: obj, type: type, status: status };
        this.syncedObjects.set(key, proxyObj);
        // Force sync:
        if (type === 'local') {
            // Check if exists in local:
            if (this.pullFromLocal(key) === false) {
                this.pushToLocal(key);
            }
            return;
        }
        if (type === 'database') {
            // Check if exists in database:
            if (this.pullFromDatabase(key) === false) {
                this.pushToDatabase(key);
            }
        }
        // Return object:
        return proxyObj;
    }
    static read(key) {
        return this.syncedObjects.get(key).object;
    }
    static modify(key, value) {
        if (!value) {
            this.handleModifications(key);
            return this.syncedObjects.get(key).object;
        } 
        // For primitive types, where modify() doesn't return a reference:
        // this.handleModifications(key); // LOOK HERE
        this.setObjectProperty(key, "object", value);
    }
    //
    static changeSyncedObject(key, type) {
        // 1. Change type of synced object.
        const proxyObj = this.syncedObjects.get(key);
        if (proxyObj) {
            // Destroy current object:
            this.syncedObjects.delete(key);
        }
        // Create new object:
        if (type !== "null") {
            this.createSyncedObject(proxyObj.object, type, key);
        }
    }
    static resetStorage() {
        // 1. Reset all storage.
        this.localStorage.clear();
        this.clearDatabase();
        this.syncedObjects = new Map();
        location.reload(true);
    }
    
    // Utils:
    static handleModifications(key, pushMode = true) {
        // Handle Syncing:
        if (this.getObjectProperty(key, "type") === 'temp') {
            setTimeout(() => {
                this.emitEvent(key);
            }, 0);
            return;
        }
        if (pushMode === true) {
            // Sending data to local/database:
            this.modify("StorageState", this.read("StorageState") + 1);
            this.setObjectProperty(key, "status", "unsynced");
            this.queueSyncObject(key, type);
        }
        else {
            // Just recieved data:
            this.setObjectProperty(key, "status", "synced");
            setTimeout(() => {
                this.emitEvent(key);
            }, 0);
        }
    }
    static queueSyncObject(key, type) {
        this.debounce(() => {
            StorageManager.forceSyncObject(key, type);
        }, 5000)();
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
    //
    static pullFromLocal(key) {
        // 1. Pull object from local storage.
        const json = this.localStorage.getItem(key);
        if (json) {
            this.setObjectProperty(key, "object", JSON.parse(json));
            this.handleModifications(key, false);
            console.log("Pulled from local storage.");
            return true;
        }
        return false;
    }
    static pushToLocal(key) {
        // 1. Push object to local storage.
        this.localStorage.setItem(key, JSON.stringify(this.getObjectProperty(key, "object")));
        if (this.getObjectProperty(key, "status") === "unsynced") {
            this.modify("StorageState", this.read("StorageState") - 1);
        }
        this.handleModifications(key, false);
        console.log("Pushed to local storage.");
    }
    static async pullFromDatabase(key) {
        // Pull:

        // Then:
        if (wasFoundInDatabase) {
            this.handleModifications(key, false);
        }
    }
    static async pushToDatabase(key) {
        // Push:
        // Then:
        if (this.getObjectProperty(key, "status") === "unsynced") {
            this.setObjectProperty(key, "status", "synced");
            this.modify("StorageState", this.read("StorageState") - 1);
        }
    }
    static async clearDatabase() {

    }
    //
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
    static emitEvent(key) {
        // Emit event:
        const event = new CustomEvent("syncedObjectChange", { detail: { syncedObject: key } });
        document.dispatchEvent(event);
    }
    //
    static setup() {
        // Sync state for Observer:
        let StorageState = this.createSyncedObject( 0, "temp", "StorageState");
        // Quick state:
        window.addEventListener('beforeunload', function (e) {
            if (StorageManager.read(StorageState) !== 0) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes!';
            }
        });
    }   
}

StorageManager.setup();