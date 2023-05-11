import React, { useState, useEffect, Component } from 'react';

export class MessageProcessor {
    // Constants:
    static ERROR_MAX_MESSAGE_LENGTH = 1000; // 1000 characters, ~200 words.
    static WARNING_MAX_MESSAGE_LENGTH = 250; // 1000 characters, ~50 words.
    static WARNING_MIN_MESSAGE_LENGTH = 20; // 20 characters, ~3-4 words.
    static WARNING_MIN_OASES_LENGTH = 4; // 4 messages.
    static WARNING_MAX_OASES_LENGTH = 40; // 40 messages.
    // Sync:
    static syncedFromDatabase = false;
    static guestUser = false;
    static sessionIndex = 0; // Obtained from database, the true index of allRawMessages[0].
    // Raw Messages:
    static allRawMessages = []; // Array of strings, index corresponds to order.
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
    static currentIndex = 0; // Index of the message currently being generated.

    // Functionality:
    // 1. Add, Remove, and Edit Messages.
    // 2. Track messages and oases properties.
    // 3. Provide warnings and errors, enforce usage limits.
    // 4. Sync to and from database.
    // 5. Connect with backend for GPT-3 generation.
    // 6. Handle API failures.

    // 1:
    static addMessage(newMessage) {
        if (!this.readyForMessages()) {
            return false;
        }
        this.allRawMessages.push(newMessage);
        this.syncToDatabase;
        // Grab index, check for warnings, return:
        const index = this.allRawMessages.indexOf(newMessage) + this.sessionIndex;
        this.handleMessageWarnings(index, newMessage);
        return index;
    }
    static removeMessage(masterIndex) {
        if (masterIndex < this.sessionIndex) {
            // Deleting a message from previous session:
            editMessageInDatabase(masterIndex, "");
            return;
        }
        // Delete a message from this session:
        this.allRawMessages.splice(masterIndex - this.sessionIndex, 1);
        handleMessageWarnings(masterIndex - this.sessionIndex, "");
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
        this.allRawMessages[masterIndex - this.sessionIndex] = messageString;

    }
    
    // 2:
    static trackMessageProperties() {

    }
    static trackOasisProperties() {

    }

    // 3:
    handleMessageWarnings(index, newMessage) {
        if (newMessage === "") {
            // Deleting message:
            removeMessageWarnings(index);
            return;
        }
        // Edit or adding message:
        if (newMessage.size > this.WARNING_MAX_MESSAGE_LENGTH) {
            highContentMessageIndexes.push(index + sessionIndex);
            return "max_length";
        }
        if (newMessage.size < this.WARNING_MIN_MESSAGE_LENGTH) {
            lowContentMessageIndexes.push(index + sessionIndex);
            return "min_length";
        }
        this.removeMessageWarnings(index);
    }
    removeMessageWarnings(index) {
        if (highContentMessageIndexes.includes(index)) {
            highContentMessageIndexes.splice(highContentMessageIndexes.indexOf(index), 1);
        }
        if (lowContentMessageIndexes.includes(index)) {
            lowContentMessageIndexes.splice(lowContentMessageIndexes.indexOf(index), 1);
        }
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
        return this.syncedFromDatabase || this.guestUser;
    }
    static editMessageInDatabase(index, messageString) {
        // Set message in database to string:
    }
    static syncToDatabase() {
        // Updates 'payload' with all messages from this session:
        // If 'payload' is over 50, start new payload:
    }

    // 5:
    static getGenerationWarnings() {
        // Give warnings:
        let warnings = [];
        if (this.lowContentMessageIndexes.length > 0) {
            warnings.push("m_low");
        }
        if (this.highContentMessageIndexes.length > 0) {
            warnings.push("m_high");
        }
        if (this.allRawMessages.length < this.WARNING_MIN_OASES_LENGTH) {
            warnings.push("o_low");
        }
        if (this.allRawMessages.length > this.WARNING_MAX_OASES_LENGTH) {
            warnings.push("o_high");
        }
        return warnings;
    }
    static startGenerationWithOptions(options) {
        if (this.isGenerating) {
            this.generationStatus = -1;
            return;
        }
        this.isGenerating = true;
        this.generationOptions = options;
        // Process messages, send to backend:
        this.generationStatus = 1;
        this.queueGenerationRequest();
    }
    static queueGenerationRequest() {
        // Queue generation request:
        setTimeout(() => {
            this.generationStatus = 2;
            this.isGenerating = false;
        }, 5000);
    }
    static processGenerationResponse(response) {
        // Clean and process messages, add to allOrganizedMessages:
    }
}