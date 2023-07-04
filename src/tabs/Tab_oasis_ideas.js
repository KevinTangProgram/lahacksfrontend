import '../CSS/Test.css';
import '../CSS/Tab_oasis.css';
import { MessageProcessor } from '../utilities/messageProcesser';
import { StorageManager } from '../utilities/storageManager';
import SingleMessage from '../components/singleMessage';
import React, { useState, useRef, useEffect } from 'react';
import ObserverComponent from '../components/observer';
//


function Tab_oasis_ideas({ forceOpenUI }) {
    const [shortInput, setShortInput] = useState("");
    const [charCountString, setCharCountString] = useState("");
    const handleChangeInput = (event) => {
        const textarea = event.target;
        // Enforce max chars:
        let inputString = textarea.value;
        if (inputString.length > MessageProcessor.ERROR_MAX_MESSAGE_LENGTH) {
            inputString = inputString.substring(0, MessageProcessor.ERROR_MAX_MESSAGE_LENGTH);
        }
        if (inputString.length > 0.8 * MessageProcessor.ERROR_MAX_MESSAGE_LENGTH) {
            setCharCountString(`${inputString.length} / ${MessageProcessor.ERROR_MAX_MESSAGE_LENGTH}`);
        }
        else {
            setCharCountString("");
        }
        // Auto-resize textarea (for up to 10 lines):
        setShortInput(inputString);
    }
    // Focus/scroll System:
        // Text area:
    const textareaRef = useRef(null);
    useEffect(() => {
    // Scroll & focus on load:
        focusTextarea();
        setTimeout(() => {
            scrollToMessageID(-1);
        }, 500);
    }, []);
        // Scroll to specific message:
    function scrollToMessageID(messageID) {
        if (messageID === -1) {
            messageID = MessageProcessor.allRawMessages.length - 1 + MessageProcessor.sessionIndex;
        }
        const messageEle = document.getElementById(`${messageID}`);
        if (messageEle) {
            setTimeout(() => {
                messageEle.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 0);
        }
    }
        // Focus on textarea:
    function focusTextarea() {
        textareaRef.current.focus();
    }

    // Add and update messages:
    function addThought() {
        if (shortInput === "") {
            return false;
        }
        const messageIndex = MessageProcessor.addMessage(shortInput);
        if (messageIndex === false) {
            alert("Error: Could not add message.");
            return false;
        }
        setShortInput("");
        setCharCountString("");
    }
    function editThought(index, newMessage) {
        MessageProcessor.editMessage(index, newMessage);
    }
    function deleteThought(index) {
        MessageProcessor.removeMessage(index);
    }
    function MessageDisplays() {
        if (!MessageProcessor.readyForMessages()) {
            return <div className="singleMessage">Loading...</div>;
        }
        return (< ObserverComponent dependencies={MessageProcessor.allRawMessagesKey} Component={() => {
        {
            useEffect(() => {
                // Scroll & focus on rerender:
                scrollToMessageID(-1);
                focusTextarea();
            }, []);
            if (MessageProcessor.allRawMessages.length === 0) {
                return <div className="singleMessage">Your Oasis is Empty- Add some ideas!</div>;
            }
            return (
                <div>
                    {MessageProcessor.allRawMessages.map((message, i) => {
                        return (
                            <SingleMessage key={i} rawMessage={message} index={i}
                                functions={{ edit: editThought, delete: deleteThought, refocus: focusTextarea }} />
                        )
                    })}
                </div>
            );
        }
        }} />);
    }

    return (
        <div className="ideaContainer">
            <div className="selectGrid">
                <div className="messageContainer">
                    <MessageDisplays />
                </div>
                <div className="inputGrid">
                    <textarea ref={textareaRef} placeholder="Insert Thought" value={shortInput} onChange={handleChangeInput}
                        // Add onKeyPress to add thought on enter
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && event.shiftKey) {
                                event.preventDefault();
                                setShortInput(shortInput + "\n")
                            }
                            else if (event.key === "Enter") {
                                const textarea = event.target;
                                textarea.style.height = "auto";
                                event.preventDefault();
                                addThought();
                            }
                        }}
                    ></textarea>
                    <button className="selectCells" id="submitAndConfirm" onClick={() => { addThought(); }}>
                        +
                        <br></br>
                        {charCountString}
                        </button>
                    <button className="selectCells" id="submitAndConfirmLong" onClick={() => { forceOpenUI() }}>Open Menu</button>
                </div>
                < ObserverComponent dependencies={"StorageState"} Component={() => { return <div>{StorageManager.unsyncCounter === 0 ? null : 'saving...'}</div>}} />
            </div>
        </div>
    );
}

export default Tab_oasis_ideas;