import '../CSS/Test.css';
import '../CSS/Tab_oasis.css';
import { MessageProcessor } from '../utilities/messageProcesser';
//
import React, { useState } from 'react';


function Tab_oasis_ideas({ forceOpenUI }) {
    const [shortInput, setShortInput] = useState("");
    const [input, setInput] = useState([]);
    const handleChangeInput = (event) => {
        setShortInput(event.target.value);
        const textarea = event.target;
        textarea.style.height = "0em";
        textarea.style.height = `${textarea.scrollHeight + 5}px`;
    }
    function addThought() {
        let success = MessageProcessor.addMessage(shortInput);
        if (success === false) {
            alert("Error: Could not add message.");
            return;
        }
        let addedInput = input;
        addedInput.push(shortInput);
        setInput(addedInput);
        setShortInput("");
    }

    return (
        <div className="ideaContainer">
            <div className="selectGrid">
                <p>hello</p>
                <div className="inputGrid">
                    <textarea placeholder="What stuff is your professor saying now?" value={shortInput} onChange={handleChangeInput}
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
                    <button className="selectCells" id="submitAndConfirmLong" onClick={() => { forceOpenUI() }}>Organize Now?</button>
                </div>
            </div>
        </div>
    );
}

export default Tab_oasis_ideas;