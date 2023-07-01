import { StorageManager } from '../utilities/storageManager.js';
import { CONST } from './CONST.js';
import axios from 'axios';



export class UserManager {
    static user = StorageManager.createSyncedObject({}, "local", "user");
    static token = StorageManager.createSyncedObject({token: ""}, "local", "token");
    static theme = "default"; // light, dark, default

    // Utils:
    static logout() {
        StorageManager.safeAssign(this.user.modify(true), {});
        this.token.modify(true).token = "";
    }
        // Logins:
    static async login(email, password) {
        // Login:
        try {
            const response = await axios.get(CONST.URL + "/user/login", { params: { email: email, password: password } });
            // Store user data:
            StorageManager.safeAssign(this.user.modify(true), response.data.user);
            this.token.modify(true).token = response.data.token;
            // Return token:
            return response.data.token;
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
    static async continueWithGoogle(token) {
        // Turn google token into our token:
        try {
            const response = await axios.get(CONST.URL + "/user/continueWithGoogle", { params: { token: token } });
            // Store user data:
            StorageManager.safeAssign(this.user.modify(true), response.data.user);
            this.token.modify(true).token = response.data.token;
            // Return token:
            return response.data.token;
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
        // Account creation:
    static async verifyEmail(email) {
        // Send email to user:
        try {
            const response = await axios.get(CONST.URL + "/user/verifyEmail", { params: { email: email } });
            // Return 0 (success):
            return response.data;
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
    static async setupFromEmail(token) {
        // Convert email token to email:
        try {
            const response = await axios.get(CONST.URL + "/user/setup", { params: { token: token } });
            // Success, return email:
            return response.data;
        }
        catch (error) {
            if (error.response && error.response.status === 400) {
                // My error:
                const errorMessage = error.response.data.error;
                throw errorMessage;
            } else {
                // Network error:
                const errorMessage = "Network error - please try again later."
                throw errorMessage;
            }
        }
    }
    static async createAccount(token, username, password) {
        // Create account:
        try {
            const response = await axios.post(CONST.URL + "/user/createAccount", { token: token, username: username, password: password });
            // Return token:
            return response.data.token;
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
        // Password reset:
    static async resetPasswordEmail(email) {
        // Send email to user:
        try {
            const response = await axios.get(CONST.URL + "/user/resetPassword", { params: { email: email } });
            // Return 0 (success):
            return response.data;
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
    static async resetPasswordPage(token) {
        // Convert email token to email:
        try {
            const response = await axios.get(CONST.URL + "/user/resetPage", { params: { token: token } });
            // Success, return email:
            return response.data;
        }
        catch (error) {
            if (error.response && error.response.status === 400) {
                // My error:
                const errorMessage = error.response.data.error;
                throw errorMessage;
            } else {
                // Network error:
                const errorMessage = "Network error - please try again later."
                throw errorMessage;
            }
        }
    }
    static async resetPassword(token, password) {
        // Modify account password:
        try {
            const response = await axios.post(CONST.URL + "/user/reset", { token: token, password: password });
            // Return token:
            return response.data.token;
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
}

