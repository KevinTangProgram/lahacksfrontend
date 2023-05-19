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
        const syncedObject = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
        // const syncedObject = obj;
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
            this.unsyncCounter++;
            if (this.pullFromLocal(info) === false) {
                this.pushToLocal(info);
            }
            return;
        }
        if (type === 'database') {
            // Check if exists in database:
            this.unsyncCounter++;
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
        // If they are arrays:
        // Remove StorageManagerInfo properties:
        const oldInfo = syncedObject.StorageManagerInfo;
        this.objectify(syncedObject, true);
        // Combine into object:
        const mergedObject = Object.assign({}, { syncedObject, otherObject });
        const { syncedObject: mergedSyncedArray, otherObject: mergedOtherArray } = mergedObject;
        // Destructure:
        mergedSyncedArray.length = 0;
        Array.prototype.push.apply(mergedSyncedArray, mergedOtherArray);


        // console.log(syncedObject);
        // Object.assign(syncedObject, otherObject);
        // console.log(Object.assign([], otherObject));
        // console.log(syncedObject);
        // console.log(otherObject);
        // // Remove missing properties:
        // for (const key in otherObject) {
        //     if (!syncedObject.hasOwnProperty(key)) {
        //     // if (!Object.prototype.hasOwnProperty.call(syncedObject, key)) {
        //         delete syncedObject[key];
        //         console.log("jheu");
        //     }
        // }
        // console.log(syncedObject);
        // Re-add StorageManagerInfo properties:
        syncedObject.StorageManagerInfo = oldInfo;
        syncedObject.modify = function () {
            StorageManager.handleModifications(this.StorageManagerInfo);
            return this;
        };
        console.log(syncedObject);
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
            this.unsyncCounter++;
            if (this.pullFromLocal(key) === false) {
                this.pushToLocal(key);
            }
            return;
        }
        if (type === 'database') {
            // Check if exists in database:
            this.unsyncCounter++;
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
            this.unsyncCounter++;
            this.setObjectProperty(StorageManagerInfo.key, "status", "unsynced");
            this.queueSyncObject(StorageManagerInfo);
        }
        else {
            // Just recieved data:
            this.setObjectProperty(StorageManagerInfo.key, "status", "synced");
            this.unsyncCounter--;
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
            this.safeAssign(this.read(StorageManagerInfo.key), JSON.parse(json));
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
            this.unsyncCounter--;
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
            const { StorageManagerInfo, modify, ...objectifiedObject } = syncedObject;
            return objectifiedObject;
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

        // Quick state:
        window.addEventListener('beforeunload', function (e) {
            if (StorageManager.read(StorageState) !== 0) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes!';
            }
        });
        // let testObj = this.test([2, 3]);
        // console.log(testObj[0]);
        // testObj.modify()[0]++;
        // testObj.modify().push(4);
        // testObj.modify().info = "test";
        // console.log("elements : ");
        // console.log(testObj[0]);
        // console.log(testObj[1]);
        // console.log(testObj[2]);
        // console.log(testObj.info);
    }   
}

StorageManager.setup();
