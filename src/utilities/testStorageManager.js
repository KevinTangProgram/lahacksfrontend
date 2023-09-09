//
export class StorageManager {
    // Vars:
    static localStorage = window.localStorage;
    static syncedObjects = new Map();
    static pendingSyncTasks = new Map();

    // Main Interface:
    static initializeSyncedObject(key, options) {
        // Initialize a new synced object using provided options.
        // Check for duplicates:
        if (this.syncedObjects.has(key)) {
            return;
        }
        // Validate input:
        const { type, defaultValue = {}, debounceTime = 0, reloadBehavior = "prevent", customSyncFunctions, callbackFunctions } = options;
        try {
            this.validateInput("key", key);
            this.validateInput("type", type);
            this.validateInput("debounceTime", debounceTime);
            this.validateInput("reloadBehavior", reloadBehavior);
        }
        catch (error) {
            throw new Error(`Failed to initialize synced object with key '${key}': ${error}`);
        }
        // Create synced object:
        const syncedObject = {
            key: key,
            type: type,
            data: defaultValue,
            changelog: [],
            debounceTime: debounceTime,
            reloadBehavior: reloadBehavior,
        }
        // Add functions:
        if (type === "custom" && customSyncFunctions) {
            const { pull, push } = customSyncFunctions;
            syncedObject.pull = pull;
            syncedObject.push = push;
        }
        if (callbackFunctions) {
            const { onSuccess, onError } = callbackFunctions;
            syncedObject.onSuccess = onSuccess;
            syncedObject.onError = onError;
        }
        syncedObject.modify = function (debounceTime = this.debounceTime) {
            StorageManager.handleModifications(this, debounceTime);
            return this.data;
        };
        syncedObject.modifyProperty = function (property, debounceTime = this.debounceTime) {
            StorageManager.handleModificationsOfProperty(this, property, debounceTime);
            return this.data[property];
        };
        // Add to storage:
        this.syncedObjects.set(key, syncedObject);
        // Initial sync:
        this.forceSyncTask(syncedObject, "pull");
    }
    static async getSyncedObject(key) {
        // Obtain the synced object if it exists.
        return this.syncedObjects.get(key);
    }

    // Utility Interface:
    static async safeDecouple() {
        // Decouple the synced object from its storage, effectively changing it to a temp object.
    }
    static async safeAssign() {
        // Override a synced object's data with an entire object.
    }

    // Local Storage Interface:
    static async findMatchingInLocalStorage(keyIncludes, options) {
        // Find all objects in local storage which include the key.
        const { readOnly = true, deleteMask, initOptions } = options;
        // Validate input:
        try {
            this.validateInput("key", keyIncludes);
            this.validateInput("findMatchingOptions", options);
        }
        catch (error) {
            throw new Error(`Failed to find matching: ${error}`);
        }
        const keys = Object.keys(this.localStorage);
        const matchingKeys = keys.filter((key) => key.includes(keyIncludes));
        // Create objects with data and return via array:
        if (readOnly === true) {
            return matchingKeys.map((key) => {
                const object = JSON.parse(this.localStorage.getItem(key));
                for (const property in deleteMask) {
                    delete object[property];
                }
                return object;
            });
        }
        // Initialize syncedObjects using initOptions, return keys:
        if (readOnly === false) {
            matchingKeys.map((key) => this.initializeSyncedObject(key, initOptions));
            return matchingKeys;
        }
    }
    static async removeMatchingInLocalStorage() {
        // Remove all objects in local storage which include the key.
        const keys = Object.keys(this.localStorage);
        const matchingKeys = keys.filter((key) => key.includes(keyIncludes));
        matchingKeys.map((key) => this.localStorage.removeItem(key));
    }
    static async resetLocalStorage() {
        // Reset all local storage, deleting the affected synced objects.
        this.localStorage.clear();
        this.syncedObjects = new Map();
        location.reload(true);
    }

    // Backend Methods:
    static async handleModificationsOfProperty(syncedObject, property, debounceTime) {
        // Modify the synced object's changelog before continuing.
        // Check if property is found in syncedObject:
        if (!syncedObject.data.hasOwnProperty(property)) {
            throw new Error(`property '${property}' not found in synced object with key '${syncedObject.key}'.`);
        }
        // Add property to changelog:
        if (!syncedObject.changelog.includes(property)) {
            syncedObject.changelog.push(property);
        }
        // Handle modifications:
        this.handleModifications(syncedObject, debounceTime);
    }
    static async handleModifications(syncedObject, debounceTime) {
        // Handle modifications on the synced object.
        // Rerender dependent components:
        setTimeout(() => {
            this.emitEvent(syncedObject.key, syncedObject.changelog);
        }, 0);
        // Check for 'temp':
        if (syncedObject.type === 'temp') {
            return;
        }
        // Handle syncing:
        if (debounceTime === 0) {
            setTimeout(() => {
                this.forceSyncObject(syncedObject);
            }, 0);
            return;
        }
        this.queueSyncTask(syncedObject, debounceTime);
    }
    static async queueSyncTask(syncedObject, debounceTime) {
        // Queue an object to be synced, debouncing multiple requests.
        if (this.pendingSyncs.has(syncedObject.key)) {
            // Defer the pending sync:
            clearTimeout(this.pendingSyncs.get(syncedObject.key));
            this.pendingSyncs.delete(syncedObject.key);
        }
        // Start a timeout to sync object:
        const sync = () => {
            this.pendingSyncs.delete(syncedObject.key);
            this.forceSyncObject(syncedObject);
        }
        const timeoutId = setTimeout(sync, debounceTime);
        this.pendingSyncs.set(syncedObject.key, timeoutId);
    }
    static async forceSyncTask(syncedObject, requestType) {
        // Sync an object immediately.
        try {
            if (syncedObject.type === "local") {
                if (requestType === "push") {
                    await this.pushToLocal(syncedObject);
                }
                if (requestType === "pull") {
                    await this.pullFromLocal(syncedObject);
                }
            }
            if (syncedObject.type === "custom") {
                if (requestType === "push") {
                    await this.pushToCustom(syncedObject);
                }
                if (requestType === "pull") {
                    await this.pullFromCustom(syncedObject);
                }
            }
        }
        catch (error) {
            // Handle callbacks with error:
            this.handleCallBacks(syncedObject, { requestType: requestType, error: error });
            return;
        }
        // Handle callbacks with success:
        this.handleCallBacks(syncedObject, { requestType: requestType, success: true });
    }

    // Backend Utils:
    static async pullFromLocal(syncedObject) {
        // Pull data from local storage.
        const json = this.localStorage.getItem(syncedObject.key);
        if (json) {
            this.syncedObjects.set(syncedObject.data, JSON.parse(json));
        }
        else {
            await this.pushToLocal(syncedObject);
        }
    }
    static async pushToLocal(syncedObject) {
        // Push data to local storage.
        this.localStorage.setItem(syncedObject.key, JSON.stringify(syncedObject.data));
    }
    static async pullFromCustom() {
        // Call the custom pull method to obtain data.
        if (!syncedObject.pull) {
            return;
        }
        const response = await syncedObject.pull();
        if (response) {
            this.syncedObjects.set(syncedObject.data, response);
        }
        else {
            await this.pushToCustom(syncedObject);
        }
    }
    static async pushToCustom() {
        // Call the custom push method to send data.
        const response = await syncedObject.push(syncedObject.data);
    }
    static async handleCallBacks(syncedObject, data) {
        // Handle callbacks, emit events, and reset changelogs.
        const { requestType, success, error } = data;
        if (success && syncedObject.onSuccess) {
            syncedObject.onSuccess(requestType, syncedObject.changelog);
        }
        if (error && syncedObject.onError) {
            syncedObject.onError(requestType, error, syncedObject.changelog);
        }
        syncedObject.changelog = [];
        this.emitEvent(syncedObject, { requestType, success, error });
    }
    
    // Backend Sub-Utils and Setup:
    static validateInput(type, value) {
        // Validate input for several functions.
        if (type === "key") {
            if (typeof value === "string" && value.length > 0) {
                return true;
            }
            throw "parameter 'key' must be a non-empty string."
        }
        if (type === "type") {
            if (value === "temp" || value === "local" || value === "custom") {
                return true;
            }
            throw "parameter 'type' must be either 'temp', 'local', or 'custom'."
        }
        if (type === "debounceTime") {
            if (typeof value === "number" && value >= 0) {
                return true;
            }
            throw "parameter 'debounceTime' must be a non-negative number."
        }
        if (type === "findMatchingOptions") {
            const { readOnly = true, deleteMask, initOptions } = value;
            if (typeof readOnly === "boolean" && typeof deleteMask === "object" && typeof initOptions === "object") {
                return true;
            }
            throw "invalid options for findMatchingInLocalStorage()."
        }
        if (type === "reloadBehavior") {
            if (value === "prevent" || value === "allow" || value === "finish") {
                return true;
            }
            throw "parameter 'reloadBehavior' must be either 'prevent', 'allow', or 'finish'."
        }
    }
    static emitEvent(syncedObject, status) {
        // Emit an event to components.
        const event = new CustomEvent("syncedObjectChange", { detail: {
            key: syncedObject.key,
            changelog: syncedObject.changelog,
            requestType: status.requestType,
            success: status.success,
            error: status.error,
        } });
        document.dispatchEvent(event);
    }
    static initReloadPrevention() {
        // Prevent reloads on page close.
        window.addEventListener("beforeunload", (event) => {
            // Check for pending syncs:
            for (const [key, timeoutId] of this.pendingSyncs) {
                // Object is still syncing: 
                const syncedObject = this.getSyncedObject(key);
                const reloadBehavior = syncedObject.reloadBehavior;
                if (reloadBehavior === "allow") {
                    continue;
                }
                if (reloadBehavior === "finish") {
                    this.pendingSyncs.delete(syncedObject.key);
                    this.forceSyncObject(syncedObject);
                    continue;
                }
                if (reloadBehavior === "prevent") {
                    event.preventDefault();
                    event.returnValue = "You have unsaved changes!";
                    break;
                }                
            }
        });
    }
}

StorageManager.initReloadPrevention();




    