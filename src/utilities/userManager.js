import { StorageManager } from '../utilities/storageManager.js';
import { CONST } from './CONST.js';
import axios from 'axios';



export class UserManager {
    static refreshTokenPromise = undefined; // replaced with a valid promise on load.
    static user = StorageManager.createSyncedObject({}, "local", "user");
    static token = StorageManager.createSyncedObject({token: ""}, "local", "token");

    // Interface:
    static getUser() {
        return this.user;
    }
    // Utils:
    static logout() {
        StorageManager.safeAssign(this.user.modify(true), {});
        this.token.modify(true).token = "";
    }
    static validateInput(type, input) {
        const hasBadChars = (input) => {
            const pattern = /[:;[\](){}`'""]/;
            return pattern.test(input);
        }
        if (type === "email") {
            const maxLength = 254;
            if (input.length > maxLength) {
                return "Email cannot be longer than " + maxLength + " characters."
            }
            if (hasBadChars(input)) {
                return "Email cannot contain special characters."
            }
            if (input.includes(" ")) {
                return "Email cannot contain spaces."
            }
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (pattern.test(input)) {
                return true;
            }
            return "Invalid email address - Check for special characters or whitespace."
        }
        if (type === "username") {
            const minLength = 3;
            const maxLength = 20;
            const nonWhitespaceInput = input.replace(/\s/g, "");
            if (nonWhitespaceInput.length < minLength || input.length > maxLength) {
                return "Username must be between " + minLength + " and " + maxLength + " non-whitespace characters long."
            }
            if (hasBadChars(input)) {
                return "Username cannot contain special characters."
            }
            return true;
        }
        if (type === "password") {
            const minLength = 5;
            const maxLength = 20;
            if (input.length < minLength || input.length > maxLength) {
                return "Password must be between " + minLength + " and " + maxLength + " characters long."
            }
            if (hasBadChars(input)) {
                return "Password cannot contain special characters."
            }
            if (input.includes(" ")) {
                return "Password cannot contain spaces."
            }
            return true;
        }
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
        // User Changes:
    static async syncChanges() {
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
            const response = await axios.post(CONST.URL + "/user/updateUser", { token: await this.getValidToken(), user: this.user });
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
    static async deleteAccount() {
        try {
            const response = await axios.post(CONST.URL + "/user/deleteAccount", { token: await this.getValidToken() });
            this.logout();
            return true;
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
    // Setup:
    static async getValidToken() {
        // Returns a valid token, awaiting refresh if necessary.
        // Usage: Call this function using await, and almost always get a token back instantly.
        // Pages 'Home' and 'Oasis' call refreshToken() then getValidToken() on load, which lets users refresh their session and detects invalid tokens.
        const response = await this.refreshTokenPromise;
        if (response === true) {
            // Success, token refreshed:
            return this.token.token;
        }
        else {
            return response; // false=invalid, null=guest or network error, undefined=refreshToken() was never called.
        }
    }
    static async refreshToken() {
        const token = this.token.token;
        // Create a promise to prevent getValidToken from returning before we refresh:
        this.refreshTokenPromise = new Promise(async (resolve) => {
            // Guest User:
            if (token === "") {
                resolve(null);
                return;
            }
            // Logged in:
            try {
                const response = await axios.get(CONST.URL + "/user/refresh", { params: { token: token } });
                // Success, update token & user:
                this.token.modify(true).token = response.data.token;
                StorageManager.safeAssign(this.user.modify(true), response.data.user);
                resolve(true);
            }
            catch (error) {
                console.log(error);
                if (error.response && error.response.status === 400) {
                    // My error, token is invalid:
                    StorageManager.safeAssign(this.user.modify(true), {});
                    resolve(false);
                } else {
                    // Network error, do nothing:
                    resolve(null);
                }
            }
        });
    }
}
