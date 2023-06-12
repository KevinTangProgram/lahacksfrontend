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
        try {
            // Token from google:
            const response = await axios.get(CONST.URL + "/user/continueWithGoogle", {
                params: {token: token},
            })

            // Token from create-acc:

            // Store user data:
            StorageManager.safeAssign(this.user.modify(true), response.data.user);
            this.token.modify(true).token = response.data.token;
            // Return token:
            return response.data.token;
        } catch (error) {
            throw error;
        }
    }
}

