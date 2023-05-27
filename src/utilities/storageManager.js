import {CONST} from "./CONST.js";
//
export class StorageManager {
    // Refs:
    static localStorage = window.localStorage;
    static databaseStorage = CONST.URL;
    static unsyncCounter = 0;
    // Storage:
    static syncedObjects = new Map(); // {key -> syncedObject}
    // syncedObject: {property1, property2..., modify(), 
    //              StorageManagerInfo: {key, type, status, lastSynced} }

    // Workflow:
    // 1. Creating a synced object (createSyncedObject) returns a synced object.
    // 2. The synced object will automatically sync to storage.
    // 3. Communicates with observerManager to rerender when synced object is modified.
    // Rules:
    // - Access syncedObject properties as usual, but only modify through modify().
    // - If you need to assign the whole object, use safeAssign().
    // - Use changeSyncedObject() to change the type of a synced object.
    // - Other files can use read() to reference your object.
    // Behind the scenes:
    // - The synced object is a wrapper object with method modify().
    // - Synced objects are stored in a map.
    // - modify() communicates with StorageManager to perform sync / events.

    // Interface:
    static createSyncedObject(obj, type, key = obj.name) {
        // 1. 'temp': unsynced to storage, but works with Observer.
        // 2. 'local': synced to local storage.
        // 3. 'database': synced to database.
        // Create object:
        const syncedObject = obj;
        const info = { key: key, type: type, status: "unsynced", lastSynced: null };
        syncedObject.StorageManagerInfo = info;
        syncedObject.modify = function () {
            StorageManager.handleModifications(this.StorageManagerInfo);
            return this;
        };
        this.syncedObjects.set(key, syncedObject);
        // Force sync:
        if (type === 'local') {
            // Check if exists in local:
            this.addToState(1);
            if (this.pullFromLocal(info) === false) {
                this.pushToLocal(info);
            }
        }
        if (type === 'database') {
            // Check if exists in database:
            this.addToState(1);
            if (this.pullFromDatabase(info) === false) {
                this.pushToDatabase(info);
            }
        }
        return syncedObject;
    }
    static read(key) {
        return this.syncedObjects.get(key);
    }
    //
    static safeAssign(syncedObject, otherObject) {
        if (Array.isArray(syncedObject) && Array.isArray(otherObject)) {
            // Safe assign two arrays:
            syncedObject.length = 0;
            Array.prototype.push.apply(syncedObject, otherObject);
            return;
        }
        // Safe assign two objects:
        for (const key in syncedObject) {
            // Remove all properties except StorageManagerInfo and modify:
            if (key !== 'StorageManagerInfo' && key !== 'modify') {
                delete syncedObject[key];
            }
        }
        // Assign all properties except StorageManagerInfo and modify:
        const { StorageManagerInfo, modify, ...tempObject } = otherObject;
        Object.assign(syncedObject, tempObject);
    }
    static safeDecouple(syncedObject, type = "null") {
        // Safe delete:
        if (type === "null") {
            this.syncedObjects.delete(syncedObject.StorageManagerInfo.key);
            delete syncedObject.StorageManagerInfo;
            delete syncedObject.modify;
            return;
        }
        // Change type of synced object.
        syncedObject.StorageManagerInfo.type = type;
        syncedObject.StorageManagerInfo.status = "unsynced";
        // Force sync:
        if (type === 'local') {
            // Check if exists in local:
            this.addToState(1);
            if (this.pullFromLocal(key) === false) {
                this.pushToLocal(key);
            }
            return;
        }
        if (type === 'database') {
            // Check if exists in database:
            this.addToState(1);
            if (this.pullFromDatabase(key) === false) {
                this.pushToDatabase(key);
            }
        }
        return syncedObject;
    }
    static resetStorage() {
        // 1. Reset all storage.
        this.localStorage.clear();
        this.clearDatabase();
        this.syncedObjects = new Map();
        location.reload(true);
    }
    
    // Utils:
    static handleModifications(StorageManagerInfo, pushMode = true) {
        // Rerender:
        setTimeout(() => {
            this.emitEvent(StorageManagerInfo.key);
        }, 0);
        // Check for 'temp':
        if (StorageManagerInfo.type === 'temp') {
            return;
        }
        // Handle Syncing:
        if (pushMode === true) {
            // Sending data to local/database:
            this.addToState(1);
            this.setObjectProperty(StorageManagerInfo.key, "status", "unsynced");
            this.queueSyncObject(StorageManagerInfo);
        }
        else {
            // Just recieved data:
            this.setObjectProperty(StorageManagerInfo.key, "status", "synced");
            this.setObjectProperty(StorageManagerInfo.key, "lastSynced", Date.now());
            this.addToState(-1);
        }
    }
    static queueSyncObject(StorageManagerInfo) {
        this.debounce(() => {
            StorageManager.forceSyncObject(StorageManagerInfo);
        }, 5000)();
    }
    static forceSyncObject(StorageManagerInfo) {
        if (StorageManagerInfo.type === 'temp') {
            // No syncing needed.
            return;
        }
        if (StorageManagerInfo.type === 'local') {
            // Check if exists in local:
            this.pushToLocal(StorageManagerInfo);
            return;
        }
        if (StorageManagerInfo.type === 'database') {
            // Check if exists in database:
            this.pushToDatabase(StorageManagerInfo);
            return;
        }
    }
    //
    static pullFromLocal(StorageManagerInfo) {
        // 1. Pull object from local storage.
        const json = this.localStorage.getItem(StorageManagerInfo.key);
        if (json) {
            // this.safeAssign(this.read(StorageManagerInfo.key), JSON.parse(json));
            this.setObjectProperty(StorageManagerInfo.key, "object", JSON.parse(json));
            this.handleModifications(StorageManagerInfo, false);
            console.log("Pulled from local storage.");
            return true;
        }
        return false;
    }
    static pushToLocal(StorageManagerInfo) {
        // 1. Push object to local storage.
        this.localStorage.setItem(StorageManagerInfo.key, JSON.stringify(this.objectify(StorageManagerInfo)));
        if (StorageManagerInfo.status === "unsynced") {
            this.setObjectProperty(StorageManagerInfo.key, "status", "synced");
            this.setObjectProperty(StorageManagerInfo.key, "lastSynced", Date.now());
            this.addToState(-1);
        }
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
        
    }
    static async clearDatabase() {

    }
    //
    static objectify(info, modifyObject = false) {
        // Get object:
        let syncedObject = info;
        if (typeof info.key === 'string') {
            // You can pass in the object or the StorageManagerInfo.
            syncedObject = this.read(info.key);
        }
        if (modifyObject === false) {
            // Return new object instead of modifying original:
            if (Array.isArray(syncedObject)) {
                const objectifiedArray = [];
                this.safeAssign(objectifiedArray, syncedObject);
                return objectifiedArray;
            }
            else {
                const { StorageManagerInfo, modify, ...objectifiedObject } = syncedObject;
                return objectifiedObject;
            }
        }
        else if (modifyObject === true) {
            // Modify syncedObject:
            delete syncedObject.StorageManagerInfo;
            delete syncedObject.modify;
            return syncedObject;
        }
    }
    static setObjectProperty(key, property, value) {
        // Set object property.
        const syncedObject = this.read(key);
        if (!syncedObject) {
            alert('Key not found.');
            return false;
        }
        if (property === "object") {
            this.safeAssign(this.read(key), value);
        }
        else {
            syncedObject.StorageManagerInfo[property] = value;
        }
        return true;
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

        // Prevent reload:
        window.addEventListener('beforeunload', function (e) {
            if (StorageManager.unsyncCounter > 0) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes!';
            }
        });
    }  
    static addToState(value) {
        //
        this.unsyncCounter+= value;
        setTimeout(() => {
            this.emitEvent("StorageState");
        }, 0);
    } 
}

StorageManager.setup();
