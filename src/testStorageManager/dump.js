import { SyncedObjectManager } from 'react-synced-object';
import { MessageProcessor } from './messageProcesser.js';
import { UserManager } from './userManager.js';
import { CONST } from './CONST.js';
import axios from 'axios';


//
export class OasisManager {
    // Static Logic:
    // Interface:
    static async getHomeView(type, sort) {
        // Returns an object: { mainOases, syncableOases}.
        // mainOases is an array containing the requested oases.
        // syncableOases is an array of local oases that can be synced.
        let localOasisList = SyncedObjectManager.findMatchingInLocalStorage("oasis/", { readOnly: true, deleteMask: { content: 0, user: 0 } });
        const token = UserManager.token.token;
        // Guest User:
        if (token === "") {
            // Sort and return localOasisList as mainOases:
            return { mainOases: this.sortOasisList(localOasisList, sort), syncableOases: [] };
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
                SyncedObjectManager.initializeSyncedObject("oasis/" + response.data._id, "local", { defaultValue: response.data });
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
            const localOases = SyncedObjectManager.findMatchingInLocalStorage("oasis/", { readOnly: true });
            const response = await axios.post(CONST.URL + "/oasis/syncLocalOases", { token: UserManager.token.token, localOases: localOases });
            // Remove synced oases from localStorage:
            if (response.data.numSynced === localOases.length) {
                SyncedObjectManager.removeMatchingInLocalStorage("oasis/");
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
                        SyncedObjectManager.removeMatchingInLocalStorage("oasis/" + localOases[i]._id);
                    }
                }
                throw { response: { status: 400, data: { error: error } } };
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
        // Search localStorage:
        // If found, SyncedObjectManager creates a synced object and returns its key.
        const oasisMatches = SyncedObjectManager.findMatchingInLocal("oasis/" + UUID, false);
        if (oasisMatches && oasisMatches.length > 0) {
            const oasisData = SyncedObjectManager.getSyncedObject(oasisMatches[0]).data;
            oasisData.stats.state.lastViewDate = Date.now();
            return new OasisManager(oasisData);
        }
        // Search database:
        const token = UserManager.token.token;
        try {
            const response = await axios.get(CONST.URL + "/oasis/access", { params: { token: token, UUID: UUID } });
            // Create synced Object and return data:
            // Note that we set our oasis data to a synced object, allowing us to delegate syncing and rerendering to SyncedObjectManager.
            // This requires us to pass in a pull, push, and callback function.
            // We leave pull null as we do this manually.
            const oasis = new OasisManager(response.data);
            const callback = (error, changelog) => {
                if (changelog) {
                    error += ". Properties: "
                    for (const property of changelog) {
                        error += " " + property;
                    }
                }
                oasis.error = error;
            };
            const push = async (oasisData, changelog) => {
                try {
                    const response = await axios.post(CONST.URL + "/oasis/push", { token: token, UUID: UUID, oasisInstance: oasisData, changelog: Array.from(changelog) });
                }
                catch (error) {
                    throw error;
                }
            };
            oasis.data = SyncedObjectManager.initializeSyncedObject("oasis/" + UUID, "custom", { defaultValue: response.data, customSyncFunctions: { push: push } });
            oasis.data.modify("stats").stats.state.lastViewDate = Date.now();
            return oasis;
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
        const UUID = oasis._id;
        // If already in SyncedObjectManager (currently active), edit directly:
        const activeOasis = SyncedObjectManager.getSyncedObject("oasis/" + UUID);
        if (activeOasis) {
            activeOasis.data.info.title = title;
            activeOasis.data.info.description = description;
            activeOasis.data.stats.state.lastEditDate = Date.now();
            activeOasis.modify("info");
        }
        // Otherwise, find oasis and edit:
        // Search localStorage:
        const oasisMatches = SyncedObjectManager.findMatchingInLocalStorage("oasis/" + UUID, { readOnly: false });

        if (oasisMatches && oasisMatches.length > 0) {
            // Create temporary syncedObject and edit:
            const oasis = SyncedObjectManager.getSyncedObject(oasisMatches[0]);
            oasis.data.info.title = title;
            oasis.data.info.description = description;
            oasis.data.stats.state.lastEditDate = Date.now();
            oasis.modify();
        }
        // Search database:
        try {
            // Create a version of oasisData with only our updated information, and mark changelogs:
            const token = UserManager.token.token;
            const oasisData = {
                info: oasis.info
            };
            oasis.info.title = title;
            oasis.info.description = description;
            oasis.stats.state.lastEditDate = Date.now();
            const changelog = ["info"];
            const response = await axios.post(CONST.URL + "/oasis/push", { token: token, UUID: UUID, oasisInstance: oasisData, changelog: changelog });
            return;
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
    static async deleteOasis(oasis) {
        let navHome = false;
        const UUID = oasis._id;
        // If oasis is open, navigate to home:
        const activeOasis = SyncedObjectManager.getSyncedObject("oasis/" + UUID);

        if (activeOasis) {
            navHome = true;
        }
        // Delete from localStorage:
        const oasisMatches = SyncedObjectManager.findMatchingInLocalStorage("oasis/" + UUID, { readOnly: true });
        if (oasisMatches && oasisMatches.length > 0) {
            // Delete:
            SyncedObjectManager.removeMatchingInLocalStorage("oasis/" + oasisMatches[0]._id);
            return navHome;
        }
        // Delete from database:
        try {
            const token = UserManager.token.token;
            const response = await axios.post(CONST.URL + "/oasis/deleteOasis", { UUID: UUID, token: token });
            return navHome;
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
    constructor(data) {
        // Setup vars:
        this.type = data.users.owner ? "synced" : "local";
        this.data = data;
        this.UUID = data._id;
        this.error = null;
        this.messageProcessor = new MessageProcessor(data.content);
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
        return this.data.modify(false, property)[property];
    }
    // Utils:
}