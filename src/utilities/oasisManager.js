import { StorageManager } from './storageManager.js';

//
export class OasisManager {
    // Oasis Info:

    // Oasis Settings:

    // Oasis Stats:

    // Oasis Users:

    // Oasis Content:
    static lastGeneratedMessageIndex = 0;

    // Oasis Cache:
    static cache = {
        activeTab: 1,

    };


    static cachedOasisState = "I_bottom"; 
    //



    // I_X: ideas tab, scroll to message index X.
    // I_bottom: ideas tab, scroll to bottom.
    // I_low: ideas tab, highlight + scroll to low content messages.
    // I_high: ideas tab, highlight + scroll to high content messages.
    // N: scroll to message,
    // Menu: 0: closed, 1: open, 2: openWithWarnings.
    static cachedMenuSettings = { // Object (message indexes, topic, mode, options)
        generateRecent: true,
        startIndex: 0,
        endIndex: 0,
        topic: null,
        mode: 0,
        generateHeaders: false,
        useBulletFormat: false,
    } 
}