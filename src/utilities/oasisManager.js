import { StorageManager } from './storageManager.js';
import { MessageProcessor } from './messageProcesser.js';
import { UserManager } from './userManager.js';
import { CONST } from './CONST.js';
import axios from 'axios';
import { findInLocalStorage, removeFromLocalStorage, initializeSyncedObject, getSyncedObject, updateSyncedObject, deleteSyncedObject } from 'react-synced-object';


//
export class OasisManager {
    // Static Logic:
        // Interface:
    static async getHomeView(type, sort) {
        // Returns an object: { mainOases, syncableOases}.
        // mainOases is an array containing the requested oases.
        // syncableOases is an array of local oases that can be synced.
        let localOasisList = findInLocalStorage(/oasis\/.*/);
        const token = UserManager.token.token;
        // Guest User:
        if (token === "") {
            // Sort and return localOasisList as mainOases:
            return { mainOases: this.sortOasisList(localOasisList, sort), syncableOases: []};
        }
        // Logged in user:
        try {
            const response = await axios.get(CONST.URL + "/oasis/homeView", { params: { token: token, type: type } });
            // Sort and return:
            return { mainOases: this.sortOasisList(response.data, sort), syncableOases: this.sortOasisList(localOasisList, sort) };
        }
        catch (error) {
            if (error.response && error.response.status === 400) {
                // My error:
                const errorMessage = error.response.data.error;
                throw errorMessage;
            } else {
                // Network error:
                const errorMessage = "Network error - please try again later.";
                throw errorMessage;
            }
        }
    }
    static async createNewOasis(title, description) {
        const token = UserManager.token.token;
        if (token === "") {
            // Guest user, save to localStorage:
            try {
                const response = await axios.post(CONST.URL + "/oasis/getTemplateOasis", { title: title, description: description });
                // Sync object and return its _id:
                initializeSyncedObject("oasis/" + response.data._id, "local", { defaultValue: response.data, debounceTime: 5000 });
                return response.data._id;
            }
            catch (error) {
                if (error.response && error.response.status === 400) {
                    // My error:
                    const errorMessage = error.response.data.error;
                    throw errorMessage;
                } else {
                    // Network error:
                    const errorMessage = "Network error - please try again later.";
                    throw errorMessage;
                }
            }
        }
        // Logged in user, save to database:
        try {
            const response = await axios.post(CONST.URL + "/oasis/createOasis", { token: token, title: title, description: description });
            // Return ID:
            return response.data.ID;
        }
        catch (error) {
            if (error.response && error.response.status === 400) {
                // My error:
                const errorMessage = error.response.data.error;
                throw errorMessage;
            } else {
                // Network error:
                const errorMessage = "Network error - please try again later.";
                throw errorMessage;
            }
        }
    }
    static async syncLocalOases() {
        // Transform local oases -> database oases:
        try {
            const localOases = findInLocalStorage(/oasis\/.*/);
            const response = await axios.post(CONST.URL + "/oasis/syncLocalOases", { token: UserManager.token.token, localOases: localOases });
            // Remove synced oases from localStorage:
            if (response.data.numSynced === localOases.length) {
                removeFromLocalStorage(/oasis\/.*/);
            }
            else {
                // Backend sends errorOases as an object with keys as _ids and values as errors.
                let i = 0;
                let error = "Error syncing the following oases: \n";
                for (; i < localOases.length; i++) {
                    // Determine whether to remove from localStorage:
                    if (response.data.errorOases[localOases[i]._id]) {
                        // Error syncing:
                        error += " ['" + localOases[i].info.title + "' - " + response.data.errorOases[localOases[i]._id] + "] \n";
                    }
                    else {
                        // Successfully synced:
                        removeFromLocalStorage("oasis/" + localOases[i]._id);
                    }
                }
                throw {response: { status: 400, data: { error: error } }};
            }
        }
        catch (error) {
            if (error.response && error.response.status === 400) {
                // My error:
                const errorMessage = error.response.data.error;
                throw errorMessage;
            } else {
                // Network error:
                const errorMessage = "Network error - please try again later.";
                throw errorMessage;
            }
        }
    }
    static async createOasisInstance(UUID) {
        // Create a synced object with oasis data and wrap it with OasisManager instance:
        
        // Search localStorage:
        const oasisMatches = findInLocalStorage("oasis/" + UUID, "key");
        if (oasisMatches && oasisMatches.length > 0) {
            const syncedObject = initializeSyncedObject(oasisMatches[0], "local", {debounceTime: 5000});
            syncedObject.data.stats.state.lastViewDate = Date.now();
            return new OasisManager(syncedObject);
        }

        // Search database:
        const token = UserManager.token.token;
        const oasisPushFunction = async (syncedObject) => {
            try {
                await axios.post(CONST.URL + "/oasis/push", { token: token, UUID: UUID, oasisInstance: syncedObject.data, changelog: syncedObject.changelog });
            }
            catch (error) {
                if (error.response && error.response.status === 400) {
                    // My error:
                    const errorMessage = error.response.data.error;
                    throw errorMessage;
                } else {
                    // Network error:
                    const errorMessage = "Network error - please try again later.";
                    throw errorMessage;
                }
            }
        };
        try {
            const response = await axios.get(CONST.URL + "/oasis/access", { params: { token: token, UUID: UUID } });
            const syncedObject = initializeSyncedObject("oasis/" + UUID, "custom", { defaultValue: response.data, debounceTime: 5000, customSyncFunctions: { push: oasisPushFunction } });
            return new OasisManager(syncedObject);
        }
        catch (error) {
            if (error.response && error.response.status === 400) {
                // My error:
                const errorMessage = error.response.data.error;
                throw errorMessage;
            } else {
                // Network error:
                const errorMessage = "Network error - please try again later.";
                throw errorMessage;
            }
        }
    }
    static async editOasisInfo(oasis, title, description) { 
        // Create oasis instance w/ synced object:
        const key = "oasis/" + oasis._id;
        const oasisIsOpen = getSyncedObject(key) ? true : false;
        const oasisInstance = await this.createOasisInstance(oasis._id);
        const syncedObject = oasisInstance.syncedObject;
        // Update info:
        const updater = { info: syncedObject.data.info, stats: syncedObject.data.stats };
        updater.info.title = title;
        updater.info.description = description;
        updater.stats.state.lastEditDate = Date.now();
        await updateSyncedObject(key, updater);
        // Check errors:
        if (syncedObject.state.error) {
            throw syncedObject.state.error;
        }
        // Remove synced object:
        if (!oasisIsOpen) {
            deleteSyncedObject(syncedObject.key);
        }
    }
    static async deleteOasis(oasis) {
        // Delete oasis, return if should navHome or not:
        const key = "oasis/" + oasis._id;
        const oasisIsOpen = getSyncedObject(key) ? true : false;
        // Delete from database or storage:
        const deletedKeys = removeFromLocalStorage(key, "delete");
        if (deletedKeys.length === 0) {
            try {
                const token = UserManager.token.token;
                await axios.post(CONST.URL + "/oasis/deleteOasis", { UUID: oasis._id, token: token });
            }
            catch (error) {
                if (error.response && error.response.status === 400) {
                    // My error:
                    const errorMessage = error.response.data.error;
                    throw errorMessage;
                } else {
                    console.log(error);
                    // Network error:
                    const errorMessage = "Network error - please try again later.";
                    throw errorMessage;
                }
            }
        }
        // Delete synced object:
        if (oasisIsOpen) {
            deleteSyncedObject(key);
        }
        return oasisIsOpen;
    }
        // Utils:
    static sortOasisList(list, sort) {
        if (sort === "recent") {
            list.sort((a, b) => {
                return b.stats.state.lastEditDate - a.stats.state.lastEditDate;
            });
        }
        else if (sort === "alphabetical") {
            list.sort((a, b) => {
                return a.info.title.localeCompare(b.info.title);
            });
        }
        return list;
    }
    static validateInput(type, input) {
        if (type === "title") {
            const minLength = 3;
            const maxLength = 40;
            const nonWhitespaceInput = input.replace(/\s/g, "");
            if (nonWhitespaceInput.length < minLength || input.length > maxLength) {
                return "Title must be between " + minLength + " and " + maxLength + " non-whitespace characters long."
            }
            return true;
        }
        if (type === "description") {
            const maxLength = 100;
            if (input.length > maxLength) {
                return "Description must be less than " + maxLength + " characters long."
            }
            return true;
        }
    }

    // Instance Logic:
    constructor(syncedObject) {
        // Setup vars:
        this.syncedObject = syncedObject;
        this.data = syncedObject.data;        
        this.type = this.data.users.owner ? "synced" : "local";
        this.UUID = this.data._id;
        this.error = null;
        this.messageProcessor = new MessageProcessor(this.data.content);
        this.cache = {
            activeTab: 1,
            toggleCheckboxes: true,
            state: "I_bottom"
        // I_X: ideas tab, scroll to message index X.
        // I_bottom: ideas tab, scroll to bottom.
        // I_low: ideas tab, highlight + scroll to low content messages.
        // I_high: ideas tab, highlight + scroll to high content messages.
        // N: scroll to message,
        };     
        this.error = ""; 
        
        // Setup interface for data:
        this.changelog = [];
    }
        // Interface:
    getData(property) {
        // Property is one of the main properties of oasis (info, settings, etc).
        return this.data[property];
    }
    setData(property) {
        // Function modify(false, property) updates the changelog and returns data.
        this.data.stats.state.lastEditDate = Date.now();
        return this.syncedObject.modify(property)[property];
    }   
        // Utils:
}