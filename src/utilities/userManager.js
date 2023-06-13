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
    static async continueWithGoogle(token) {
        // try {
        //     // Token from google:
        //     const response = await axios.get(CONST.URL + "/user/continueWithGoogle", {
        //         params: {token: token},
        //     })
        //     // Store user data:
        //     StorageManager.safeAssign(this.user.modify(true), response.data.user);
        //     this.token.modify(true).token = response.data.token;
        //     // Return token:
        //     return response.data.token;
        // }
        // catch (error) {
        //     throw error;
        // }
        // Turn google token into our token:
        axios.get(CONST.URL + "/user/continueWithGoogle", { params: { token: token } })
            .then(response => {
                // Store user data:
                StorageManager.safeAssign(this.user.modify(true), response.data.user);
                this.token.modify(true).token = response.data.token;
                // Return token:
                return response.data.token;
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    // My error:
                    const errorMessage = error.response.data.error;
                    throw errorMessage;
                } else {
                    // Network error:
                    const errorMessage = "Network error - please try again later."
                    throw errorMessage;
                }
            });
    }
    static async verifyEmail(email) {
        // try {
        //     // Send email:
        //     const response = await axios.get(CONST.URL + "/user/verifyEmail", {
        //         params: {email: email},
        //     })
        //     // Return:
        //     return "email sent, response: " + response.data;
        // }
        // catch (error) {
        //     return "error: " + error;
        // }
        // Send email to user:
        axios.get(CONST.URL + "/user/verifyEmail", { params: { email: email } })
            .then(response => {
                // Return 0 (success):
                return response.data;
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    // My error:
                    const errorMessage = error.response.data.error;
                    throw errorMessage;
                } else {
                    // Network error:
                    const errorMessage = "Network error - please try again later."
                    throw errorMessage;
                }
            });
    }
    static async setupFromEmail(token) {
        // Convert email token to email:
        // axios.get(CONST.URL + "/user/setup", { params: { token: token } })
        //     .then(response => {
        //         // Success, email:
        //         return response.data;
        //     })
        //     .catch(error => {
        //         if (error.response && error.response.status === 400) {
        //             // My error:
        //             const errorMessage = error.response.data.error;
        //             throw errorMessage;
        //         } else {
        //             // Network error:
        //             const errorMessage = "Network error - please try again later."
        //             throw errorMessage;
        //         }
        //     });
        try {
            const response = await axios.get(CONST.URL + "/user/setup", { params: { token: token } });
            // Success, email:
            return response.data;
        } catch (error) {
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
}

