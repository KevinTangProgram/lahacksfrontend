

//
export class OasisManager {
    // Oasis Info:

    // Oasis Settings:

    // Oasis Stats:

    // Oasis Users:

    // Oasis Content:
    static lastGeneratedMessageIndex = 0;

    // Oasis Cache:
    static generationMenuState = 0; // 0: closed, 1: open, 2: openWithWarnings.
    static generationMenuSettings = { // Object (message indexes, topic, mode, options)
        generateRecent: true,
        startIndex: 0,
        endIndex: 0,
        topic: null,
        mode: 0,
        generateHeaders: false,
        useBulletFormat: false,
    } 

}