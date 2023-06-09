import { StorageManager } from '../utilities/storageManager.js';
import { CONST } from './CONST.js';
import axios from 'axios';



export class UserManager {
    static user = StorageManager.createSyncedObject({}, "local", "user");
    static token = StorageManager.createSyncedObject({}, "local", "token");
    static theme = "default"; // light, dark, default

    // Utils:
    static async continueWithGoogle(token) {
        try {
            // Token from google:
            const response = await axios.get(CONST.URL + "/continueWithGoogle", {
                params: {token: token},
            })

            // Token from create-acc:

            // Store user data:
            console.log(response.data.user);
            StorageManager.safeAssign(this.user, response.data.user);
            StorageManager.safeAssign(this.token, response.data.token);
            // Return token:
            return response.data.token;
        } catch (error) {
            throw error;
        }
    }
}