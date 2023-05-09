

export class MessageProcessor {
    // Constants:
    static ERROR_MAX_MESSAGE_LENGTH = 1000; // 1000 characters, ~200 words.
    static WARNING_MAX_MESSAGE_LENGTH = 250; // 1000 characters, ~50 words.
    static WARNING_MIN_MESSAGE_LENGTH = 20; // 20 characters, ~3-4 words.
    static WARNING_MIN_OASES_LENGTH = 4; // 4 messages.
    // Raw Messages:
    static allRawMessages = []; // Array of strings, index corresponds to order.
    static lowContentMessageIndexes = []; // Array of indexes.
    static highContentMessageIndexes = [];
    // Organized Messages:
    static allOrganizedMessages = []; // Array of objects {string, ID}, index corresponds to order.
    static headerMessageIndexes = []; // Array of indexes.
    static markedGPTMessageIndexes = [];

    // Functionality:
    // 1. Add, Remove, and Edit Messages.
    // 2. Track messages and oases properties.
    // 3. Provide warnings and errors, enforce usage limits.
    // 4. Sync to and from database.
    // 5. Connect with backend for GPT-3 generation.
    // 6. Handle API failures.

    static addMessage(newMessage) {
        this.allRawMessages.push(newMessage);
    }



}