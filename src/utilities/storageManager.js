import {CONST} from "./CONST.js";
//
export class StorageManager {
    // Refs:
    static localStorage = window.localStorage;
    static databaseStorage = CONST.URL;
    static unsyncCounter = 0;
    static syncError = null;
    // Storage:
    static syncedObjects = new Map(); // {key -> syncedObject}
    // syncedObject: {property1, property2..., modify(), 
    //              StorageManagerInfo: {key, type, status, lastSynced, {syncFuncs}} }
    static pendingSyncs = new Map(); // Store pending sync tasks. {StorageManagerInfo.key -> timeoutId}

    // Workflow:
    // 1. Creating a synced object (createSyncedObject) returns a synced object.
    // 2. The synced object will automatically sync to storage.
    // 3. Communicates with dependent observer components to rerender when synced object is modified.
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
    static createSyncedObject(obj, type, key, syncFuncs = {pull: null, push: null, callback: null}) {
        // 1. 'temp': unsynced to storage, but works with Observer.
        // 2. 'local': synced to local storage.
        // 3. 'database': synced to database.

        // Prevent duplicates:
        if (this.syncedObjects.has(key)) {
            return this.syncedObjects.get(key);
        }
        // Create object:
        const syncedObject = obj;
        const info = { key: key, type: type, syncFuncs: type === 'database' ? syncFuncs : null, status: "unsynced", lastSynced: null, changelog: type === 'database' ? new Set() : null };
        syncedObject.StorageManagerInfo = info;
        syncedObject.modify = function (forceSyncNow = false, property) {
            if (property) {
                StorageManager.handleModificationsOfProperty(this.StorageManagerInfo, forceSyncNow, property);
            }
            else {
                StorageManager.handleModifications(this.StorageManagerInfo, forceSyncNow);
            }
            return this;
        };
        // Add to storage:
        this.syncedObjects.set(key, syncedObject);
        // Force sync:
        if (type === 'local') {
            // Check if exists in local:
            this.addToState(1); // set overall status unsynced.
            if (this.pullFromLocal(info) === false) { // if true, syncs overall status.
                this.pushToLocal(info); // will sync overall status.
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
    static findMatchingInLocal(keyIncludes, readOnly = false, mask = {}) {
        // Find syncedObjects which include the key:
        const keys = Object.keys(this.localStorage);
        const matchingKeys = keys.filter((key) => key.includes(keyIncludes));
        // Return array of objects (readOnly):
        if (readOnly === true) {
            return matchingKeys.map((key) => {
                const object = JSON.parse(this.localStorage.getItem(key));
                for (const property in mask) {
                    delete object[property];
                }
                return object;
            });
        }
        // Return array of strings (and create syncedObjects):
        if (readOnly === false) {
            matchingKeys.map((key) => this.createSyncedObject({}, "local", key));
            return matchingKeys;
        }
    }
    static removeMatchingInLocal(keyIncludes) {
        // Remove all objects which include the key:
        const keys = Object.keys(this.localStorage);
        const matchingKeys = keys.filter((key) => key.includes(keyIncludes));
        matchingKeys.map((key) => this.localStorage.removeItem(key));
    }
    static removeOneInLocal(key) {
        // Remove one object:
        this.localStorage.removeItem(key);
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
        // 1. Reset all storage except updater.
        this.localStorage.clear();
        this.syncedObjects = new Map();
        localStorage.setItem('updater', JSON.stringify({ date: CONST.UPDATE_DATE }));
        location.reload(true);
    }
    static syncPendingObject(StorageManagerInfo) {
        if (this.pendingSyncs.has(StorageManagerInfo.key)) {
            const timeoutId = this.pendingSyncs.get(StorageManagerInfo.key);
            clearTimeout(timeoutId); // Clear the timeout
            this.forceSyncObject(StorageManagerInfo); // Sync the object immediately
            this.pendingSyncs.delete(StorageManagerInfo.key); // Remove it from pendingSyncs
        }
    }
    
    // Utils:
    static handleModificationsOfProperty(StorageManagerInfo, forceSyncNow, property, pushMode = true) {
        // If pushing to remote, modify changelog:
        if (pushMode === true && property && StorageManagerInfo.changelog) {
            StorageManagerInfo.changelog.add(property);
        }
        // Call handleModifications:
        this.handleModifications(StorageManagerInfo, forceSyncNow, pushMode);
    }
    static handleModifications(StorageManagerInfo, forceSyncNow, pushMode = true) {
        // Rerender dependent observers:
        setTimeout(() => {
            this.emitEvent(StorageManagerInfo.key);
        }, 0);
        // Check for 'temp':
        if (StorageManagerInfo.type === 'temp') {
            return;
        }
        // Handle Syncing for 3 types of events:
        if (pushMode === true) {
            // Pushing to remote:
            if (forceSyncNow === true) {
                setTimeout(() => {
                    this.forceSyncObject(StorageManagerInfo);
                }, 0);
            }
            else {
                // Object was just modified locally:
                if (StorageManagerInfo.status === "synced") {
                    this.addToState(1);
                }
                this.setObjectProperty(StorageManagerInfo.key, "status", "unsynced");
                this.queueSyncObject(StorageManagerInfo);
            }
        }
        else {
            // Just recieved data from remote:
            if (StorageManagerInfo.status === "unsynced") {
                this.addToState(-1);
            }
            this.setObjectProperty(StorageManagerInfo.key, "status", "synced");
            this.setObjectProperty(StorageManagerInfo.key, "lastSynced", Date.now());
        }
    }
    static queueSyncObject(StorageManagerInfo) {
        // Prepare an object to be synced, debounce multiple requests.
        if (this.pendingSyncs.has(StorageManagerInfo.key)) {
            // Defer the pending sync:
            clearTimeout(this.pendingSyncs.get(StorageManagerInfo.key));
            this.pendingSyncs.delete(StorageManagerInfo.key);
        }
        // Start a timeout to sync object:
        const sync = () => {
            this.pendingSyncs.delete(StorageManagerInfo.key);
            this.forceSyncObject(StorageManagerInfo);
        }
        const timeoutId = setTimeout(sync, 5000);
        this.pendingSyncs.set(StorageManagerInfo.key, timeoutId);
    }
    static async forceSyncObject(StorageManagerInfo) {
        // Sync object to storage.
        // Note: forceSyncObject is used in two ways:
        // 1: synchronously called by queueSyncObject() by StorageManager, return value is not used.
        // 2: asynchronously called by calling code, return value is used (success: true, error: string).
        if (StorageManagerInfo.type === 'temp') {
            // No syncing needed.
            return true;
        }
        if (StorageManagerInfo.type === 'local') {
            // Check if exists in local:
            this.pushToLocal(StorageManagerInfo);
            return true;
        }
        if (StorageManagerInfo.type === 'database') {
            // Check if exists in database:
            const response = await this.pushToDatabase(StorageManagerInfo);
            return response;
        }
    }
    
    //
    static pullFromLocal(StorageManagerInfo) {
        // 1. Pull object from local storage.
        const json = this.localStorage.getItem(StorageManagerInfo.key);
        if (json) {
            // this.safeAssign(this.read(StorageManagerInfo.key), JSON.parse(json));
            this.setObjectProperty(StorageManagerInfo.key, "object", JSON.parse(json));
            this.handleModifications(StorageManagerInfo, false, false);
            console.log("Pulled from local storage.");
            return true;
        }
        return false;
    }
    static pushToLocal(StorageManagerInfo) {
        // 1. Push object to local storage.
        try {
            this.localStorage.setItem(StorageManagerInfo.key, JSON.stringify(this.objectify(StorageManagerInfo)));
            if (StorageManagerInfo.status === "unsynced") {
                this.setObjectProperty(StorageManagerInfo.key, "status", "synced");
                this.setObjectProperty(StorageManagerInfo.key, "lastSynced", Date.now());
                this.addToState(-1);
            }
            console.log("Pushed to local storage.");
            return true;
        }
        catch (error) {
            console.log("Error pushing to local storage: ", error);
            if (StorageManagerInfo.status === "unsynced") {
                // Pretend its synced anyways for statusbar display:
                this.setObjectProperty(StorageManagerInfo.key, "status", "synced");
                this.setObjectProperty(StorageManagerInfo.key, "lastSynced", Date.now());
                this.addToState(-1);
            }
            let errorMessage;
            if (error.name === 'QuotaExceededError') {
                errorMessage = "We're sorry, but your local storage is full. Please clear some oases and try again.";
            }
            else if (error.name === 'SecurityError') {
                errorMessage = "We're sorry, but your browser is blocking local storage. Please allow local storage and try again.";
            }
            else {
                errorMessage = "We're sorry, but there was an error saving your changes to localStorage. Please try again later.";
            }
            this.setError(StorageManagerInfo, errorMessage);
            return errorMessage;
        }
    }
    static async pullFromDatabase(StorageManagerInfo) {
        if (StorageManagerInfo.syncFuncs.pull === null) {
            this.handleModifications(StorageManagerInfo, false, false);
            return true;
        }
        // Pull:
        try {
            const response = await StorageManagerInfo.syncFuncs.pull();
            if (response) {
                this.setObjectProperty(StorageManagerInfo.key, "object", response);
                this.handleModifications(StorageManagerInfo, false, false);
                console.log("Pulled from database.");
                return true;
            }
            return false;
        }
        catch (error) {
            StorageManagerInfo.syncFuncs.callback(error);
            console.log("Error pulling from database: ", error);
        }
    }
    static async pushToDatabase(StorageManagerInfo) {
        // Push:
        try {
            const response = await StorageManagerInfo.syncFuncs.push(this.objectify(StorageManagerInfo, false), StorageManagerInfo.changelog);
            if (StorageManagerInfo.status === "unsynced") {
                this.setObjectProperty(StorageManagerInfo.key, "status", "synced");
                this.setObjectProperty(StorageManagerInfo.key, "lastSynced", Date.now());
                this.addToState(-1);
            }
            StorageManagerInfo.syncFuncs.callback(null, StorageManagerInfo.changelog);
            this.setError(null);
            StorageManagerInfo.changelog.clear();
            console.log("Pushed to database.");
            return true;
        }
        catch (error) {
            if (StorageManagerInfo.status === "unsynced") {
                // Pretend its synced anyways for statusbar display:
                this.setObjectProperty(StorageManagerInfo.key, "status", "synced");
                this.setObjectProperty(StorageManagerInfo.key, "lastSynced", Date.now());
                this.addToState(-1);
            }
            let errorMessage;
            if (error.response && error.response.status === 400) {
                // My error:
                errorMessage = error.response.data.error;
                StorageManagerInfo.syncFuncs.callback(errorMessage, StorageManagerInfo.changelog);
            } else {
                // Network error:
                errorMessage = "Network error - please try again later.";
                StorageManagerInfo.syncFuncs.callback(errorMessage, StorageManagerInfo.changelog);
            }
            this.setError(StorageManagerInfo, errorMessage);
            return errorMessage;
        }
    }
    static async clearDatabase() {

    }
    static async retryLastErrorSync() {
        if (this.syncError === null) {
            return;
        }
        // Clear error and retry:
        const StorageManagerInfo = this.syncError.StorageManagerInfo;
        this.syncError = null;
        this.handleModifications(StorageManagerInfo, false, true);
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
        // Check for updates:
        const updater = JSON.parse(localStorage.getItem('updater'));
        if (!updater) {
            // Update:
            this.resetStorage();
        }
        else {
            if (updater.date !== CONST.UPDATE_DATE) {
                this.resetStorage();
            }
        }
        // Prevent reload:
        window.addEventListener('beforeunload', function (e) {
            if (StorageManager.unsyncCounter > 0) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes!';
            }
        });
    }  
    static setError(StorageManagerInfo, error) {
        // 
        if (StorageManagerInfo === null || error === null) {
            this.syncError = null;
            this.emitEvent("StorageState");
            return;
        }
        this.syncError = { StorageManagerInfo: StorageManagerInfo, error: error};
        this.emitEvent("StorageState");
    }
    static addToState(value) {
        // Keep track of overall syncing status:
        const wasSynced = this.unsyncCounter === 0;
        this.unsyncCounter += value;
        const isSynced = this.unsyncCounter === 0;
        if (wasSynced !== isSynced) {
            this.emitEvent("StorageState");
        }
    } 
}

StorageManager.setup();
