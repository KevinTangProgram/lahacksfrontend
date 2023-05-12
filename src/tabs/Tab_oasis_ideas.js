import '../CSS/Test.css';
import '../CSS/Tab_oasis.css';
import { MessageProcessor } from '../utilities/messageProcesser';
//
import React, { useState, useRef, useEffect } from 'react';


function Tab_oasis_ideas({ forceOpenUI }) {
    const [shortInput, setShortInput] = useState("");
    const [input, setInput] = useState(MessageProcessor.allRawMessages);
    const handleChangeInput = (event) => {
        setShortInput(event.target.value);
        const textarea = event.target;
        //textarea.style.height = "0em";
        //textarea.style.height = `${textarea.scrollHeight + 5}px`;
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
                    <button className="selectCells" id="submitAndConfirm" onClick={() => { addThought(); }}>+</button>
                    <button className="selectCells" id="submitAndConfirmLong" onClick={() => { forceOpenUI() }}>Open Menu</button>
                </div>
            </div>
        </div>
    );
}

export default Tab_oasis_ideas;