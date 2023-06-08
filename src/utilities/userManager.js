import { StorageManager } from '../utilities/storageManager.js';
import { CONST } from './CONST.js';
import axios from 'axios';



export class UserManager {
    static userID = 0;


    // Utils:
    static async continueWithGoogle(token) {
        try {
            // Token from google:
            const response = await axios.get(CONST.URL + "/continueWithGoogle", {
                params: {token: token},
            })
            const googleInfo = response.data;

            // Token from create-acc:

            // Return:
            return googleInfo;
        } catch (error) {
            throw error;
        }
    }
}