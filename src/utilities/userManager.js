import { StorageManager } from '../utilities/storageManager.js';
import jwt_decode from 'jsonwebtoken';


export class UserManager {
    static userID = 0;


    // Utils:
    static async setup(token) {
        // Token from google:
        const decodedToken = jwt_decode(token);
        console.log(decodedToken);
        return "success";
        // Token from create-acc:
    }
}