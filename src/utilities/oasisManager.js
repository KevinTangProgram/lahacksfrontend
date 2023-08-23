import { StorageManager } from './storageManager.js';
import { MessageProcessor } from './messageProcesser.js';
import { UserManager } from './userManager.js';
import { CONST } from './CONST.js';
import axios from 'axios';


//
export class OasisManager {
    // Static Logic:
        // Interface:
    static async getHomeView(type, sort) {
        const token = UserManager.token.token;
        if (token === "") {
            // Guest user, look in localStorage:
            let oasisList = StorageManager.findMatchingInLocal("oasis/", true, { content: 0, user: 0 });
            // Sort and return:
            return this.sortOasisList(oasisList, sort);
        }
        // Logged in user, look in database:
        try {
            const response = await axios.get(CONST.URL + "/oasis/homeView", { params: { token: token, type: type } });
            // Sort and return:
            return this.sortOasisList(response.data, sort);
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
                StorageManager.createSyncedObject(response.data, "local", "oasis/" + response.data._id);
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
    static async syncLocalOases(oasisKeys) {
        // Transform local oases -> database oases:
    }
    static async createOasisInstance(UUID) {
        // Search localStorage:
        const oasisMatches = StorageManager.findMatchingInLocal("oasis/" + UUID, false);
        if (oasisMatches && oasisMatches.length > 0) {
            return new OasisManager(StorageManager.read(oasisMatches[0]));
        }
        // Search database:
        const token = UserManager.token.token;
        try {
            const response = await axios.get(CONST.URL + "/oasis/access", { params: { token: token, UUID: UUID } });
            // Create synced Object and return data:
                // Note that we set our oasis data to a synced object, allowing us to delegate syncing and rerendering to StorageManager.
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
            oasis.data = StorageManager.createSyncedObject(response.data, "database", "oasis/" + UUID, { pull: null, push: push, callback: callback });
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
            const maxLength = 20;
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
        return this.data[property];
    }
    setData(property) {
        return this.data.modify(false, property)[property];
    }
        // Utils:
}