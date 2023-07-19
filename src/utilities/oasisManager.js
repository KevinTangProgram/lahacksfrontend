import { StorageManager } from './storageManager.js';
import { UserManager } from './userManager.js';
import { CONST } from './CONST.js';
import axios from 'axios';


//
export class OasisManager {
    // Constructor:
    constructor(UUID) {
        // Oasis Info:

        // Oasis Settings:

        // Oasis Stats:

        // Oasis Users:

        // Oasis Content:
        this.lastGeneratedMessageIndex = 0;

        // Oasis Cache:
        this.oasisCache = StorageManager.createSyncedObject({
            activeTab: 1,
            toggleCheckboxes: true
        }, "local", "oasisCache");
        this.cachedOasisState = "I_bottom";
        // I_X: ideas tab, scroll to message index X.
        // I_bottom: ideas tab, scroll to bottom.
        // I_low: ideas tab, highlight + scroll to low content messages.
        // I_high: ideas tab, highlight + scroll to high content messages.
        // N: scroll to message,
        // Menu: 0: closed, 1: open, 2: openWithWarnings.
        this.cachedMenuSettings = { // Object (message indexes, topic, mode, options)
            generateRecent: true,
            startIndex: 0,
            endIndex: 0,
            topic: null,
            mode: 0,
            generateHeaders: false,
            useBulletFormat: false,
        } 
    }
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
    static async createOasis(title, description) {
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
}