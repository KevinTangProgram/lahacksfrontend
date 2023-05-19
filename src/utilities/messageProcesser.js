import { StorageManager } from './storageManager.js';


export class MessageProcessor {
    // Constants:
    static ERROR_MAX_MESSAGE_LENGTH = 1000; // 1000 characters, ~200 words.
    static WARNING_MAX_MESSAGE_LENGTH = 250; // 1000 characters, ~50 words.
    static WARNING_MIN_MESSAGE_LENGTH = 20; // 20 characters, ~3-4 words.
    static WARNING_MIN_OASES_LENGTH = 4; // 4 messages.
    static WARNING_MAX_OASES_LENGTH = 20; // 20 messages.
    // Raw Messages:
    static allRawMessagesKey = "allRawMessages";
    static allRawMessages = StorageManager.createSyncedObject([], "local", this.allRawMessagesKey); // Array of objects {UUID, timestamp, sender, content}, index corresponds to order.
    static lowContentMessageIndexes = []; // Array of indexes.
    static highContentMessageIndexes = [];
    // Organized Messages:
    static allOrganizedMessages = []; // Array of objects {string, ID}, index corresponds to order.
    static headerMessageIndexes = []; // Array of indexes.
    static markedGPTMessageIndexes = [];
    // Generation:
    static generationOptions; // Object {mode, generateHeaders, useBulletFormat}.
    static isGenerating = false;
    static generationStatus = 0;
    // -2: Error: generation failed
    // -1: Error: generation already in progress
    // 0:  Ready to generate
    // 1:  Queued generation
    // 2:  Generation complete
    static currentIndex = 0; // Index of the message currently being generated.
    // Backend:
    static backendURL = "http://localhost:8080";
    static syncedFromDatabase = false;
    static guestUser = true;
    static sessionIndex = 0; // Obtained from database, the true index of allRawMessages[0].
    static usageLimit = 10; // Max messages generable (refreshes every 24 hours).

    // Functionality:
    // 1. Add, Remove, and Edit Messages.
    // 2. Track messages and oases properties.
    // 3. Provide warnings and errors, enforce usage limits.
    // 4. Sync to and from database.
    // 5. Connect with backend for GPT-3 generation.
    // 6. Handle API failures.

    // 1:
    static addMessage(newMessageString) {
        if (!this.readyForMessages()) {
            return false;
        }
        const ID = this.allRawMessages[this.allRawMessages.length - 1] + 1;
        const date = new Date();
        const timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        this.allRawMessages.modify().push({
            UUID: ID,
            timestamp: timeString,
            sender: "Guest",
            content: newMessageString,
            edits: 0
        });
        this.syncToDatabase();
        // Grab index, check for warnings, return:
        const index = this.allRawMessages.length - 1 + this.sessionIndex;
        this.handleMessageWarnings(index, newMessageString);
        return index;
    }
    static removeMessage(masterIndex) {
        if (masterIndex < this.sessionIndex) {
            // Deleting a message from previous session:
            this.editMessageInDatabase(masterIndex, "");
            return;
        }
        // Delete a message from this session:
        this.allRawMessages.modify().splice(masterIndex - this.sessionIndex, 1);
        this.handleMessageWarnings(masterIndex - this.sessionIndex, "");
            // remember to update the component ID of messages following the splice.
        this.syncToDatabase;
    }
    static editMessage(masterIndex, messageString) {
        if (masterIndex < this.sessionIndex) {
            // Editing a message from previous session:
            editMessageInDatabase(masterIndex, messageString);
            return;
        }
        // Editing a message from this session:
        const message = this.allRawMessages[masterIndex - this.sessionIndex];
        message.content = messageString;
        message.edits += 1;
        this.allRawMessages.modify()[masterIndex - this.sessionIndex] = message;
    }
    
    // 2:
    static trackMessageProperties() {

    }
    static trackOasisProperties() {

    }
     

    // 3:
    static handleMessageWarnings(index, newMessage) {
        if (newMessage === "") {
            // Deleting message:
            this.removeMessageWarnings(index);
            return "deleted";
        }
        // Edit or adding message:
        if (newMessage.length > this.WARNING_MAX_MESSAGE_LENGTH) {
            this.highContentMessageIndexes.push(index + this.sessionIndex);
            return "max_length";
        }
        if (newMessage.length < this.WARNING_MIN_MESSAGE_LENGTH) {
            this.lowContentMessageIndexes.push(index + this.sessionIndex);
            return "min_length";
        }
        this.removeMessageWarnings(index);
        return "edited"
    }
    static removeMessageWarnings(index) {
        if (this.highContentMessageIndexes.includes(index)) {
            this.highContentMessageIndexes.splice(this.highContentMessageIndexes.indexOf(index), 1);
        }
        if (this.lowContentMessageIndexes.includes(index)) {
            this.lowContentMessageIndexes.splice(this.lowContentMessageIndexes.indexOf(index), 1);
        }
    }
    static getGenerationWarnings() {
        // Give warnings:
        let warnings = [];
        if (this.lowContentMessageIndexes.length > 0) {
            warnings.push("w_m_low");
        }
        if (this.highContentMessageIndexes.length > 0) {
            warnings.push("w_m_high");
        }
        const messageNumber = this.allRawMessages.length;
        if (messageNumber < this.WARNING_MIN_OASES_LENGTH && messageNumber > 0) {
            warnings.push("w_o_low");
        }
        if (messageNumber > this.WARNING_MAX_OASES_LENGTH) {
            warnings.push("w_o_high");
        }
        return warnings;
    }
    static checkGenerationErrors(messages, topic) {
        // Give errors:
        let errors = [];
        if (!this.readyForMessages()) {
            errors.push("e_not_ready");
        }
        if (messages.length <= 0) {
            errors.push("e_no_messages");
        }
        if (this.usageLimit < messages.length) {
            errors.push("e_usage_limit");
        }
        if (this.isGenerating) {
            errors.push("e_in_prog");
        }
        if (!topic) {
            errors.push("e_no_topic");
        }
        return errors;
    }

    // 4:
    static syncFromDatabase() {
        // Get sessionIndex from database:
        // Unpack most recent 'payload' into allRawMessages:
        // Record how many payloads are in database:
        // Set bool to true:
        this.syncedFromDatabase = true;
    }
    static loadPayLoadFromDatabase(payloadIndex) {
        // Load specific payload from database:
    }
    static readyForMessages() {
        return (this.syncedFromDatabase || this.guestUser);
    }
    static editMessageInDatabase(index, messageString) {
        // Set message in database to string:
    }
    static syncToDatabase() {
        // Updates 'payload' with all messages from this session:
        // If 'payload' is over 50, start new payload:
    }

    // 5:
    static startGenerationWithOptions(options) {
        let errors;
        if (options.generateRecent === true) {
            errors = this.checkGenerationErrors(this.allRawMessages, options.topic);
        }
        else {
            errors = this.checkGenerationErrors(this.allRawMessages.slice(options.startIndex, options.endIndex), options.topic);
        }
        if (errors.length > 0) {
            this.generationStatus = -2;
            return errors;
        }
        this.isGenerating = true;
        this.generationOptions = options;
        // Process messages, send to backend:
        this.generationStatus = 1;
        this.queueGenerationRequest();
        return 1;
    }
    static queueGenerationRequest() {
        // Queue generation request:
        // axios.post(this.backendURL + '/new/group', {
        //     messages: this.allRawMessages,
        //     name: "test"
        // })
        // .then((response) => {
        //     this.processGenerationResponse(response);
        // })
        // .catch((error) => {
        //     console.error(error);
        //     this.generationStatus = -2;
        // })
        setTimeout(() => {
            this.generationStatus = 2;
            this.isGenerating = false;
            console.log("Generation:");
            this.allRawMessages.forEach(message => console.log(message.content));
        }, 5000);
    }
    static processGenerationResponse(response) {
        // Clean and process messages, add to allOrganizedMessages:
        console.log(response);
    }
}