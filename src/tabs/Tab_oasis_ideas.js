import '../CSS/Test.css';
import '../CSS/Tab_oasis.css';
import { MessageProcessor } from '../utilities/messageProcesser';
//
import React, { useState, useRef, useEffect } from 'react';


function Tab_oasis_ideas({ forceOpenUI }) {
    const [shortInput, setShortInput] = useState("");
    const [input, setInput] = useState(MessageProcessor.allRawMessages);
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
    // Scroll System:
        // Scroll to bottom on load:
    useEffect(() => {
        scrollToMessageID(-1);
    }, []);
        // Scroll to specific message:
    function scrollToMessageID(messageID) {
        if (messageID === -1) {
            messageID = input.length - 1 + MessageProcessor.sessionIndex;
        }
        const messageEle = document.getElementById(`${messageID}`);
        if (messageEle) {
            messageEle.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
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
        // Update messages on screen:
        setInput(MessageProcessor.allRawMessages);
        setCharCountString("");
        setTimeout(() => {
            scrollToMessageID(messageIndex);
        }, 0);    }
    function editThought() {

    }
    function deleteThought() {

    }
    function MessageDisplays() {
        {
            if (input.length === 0) {
                return <div className="singleMessage">Your Oasis is Empty- Add some ideas!</div>;
            }
            return (
                <div>
                    {input.map((message, i) => {
                        const lines = input[i].split('\n');
                        return (
                            <div className="singleMessage" key={i + MessageProcessor.sessionIndex} id={i + MessageProcessor.sessionIndex}>
                                <img className="iconTrash" src="./images/icons/iconTrash.png" alt="Delete" onClick={() => { deleteThought(); }} />
                                {lines.map((line, j) => (
                                    <div key={j}>{line}</div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            );
        }
    }

    return (
        <div className="ideaContainer">
            <div className="selectGrid">
                <div className="messageContainer">
                    <MessageDisplays />
                </div>
                <div className="inputGrid">
                    <textarea placeholder="Insert Thought" value={shortInput} onChange={handleChangeInput}
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
            </div>
        </div>
    );
}

export default Tab_oasis_ideas;