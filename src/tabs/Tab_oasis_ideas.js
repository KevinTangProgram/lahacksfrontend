import '../CSS/Test.css';
//
import React, { useState } from 'react';


function Tab_oasis_ideas() {
    const [shortInput, setShortInput] = useState("");
    const handleChangeInput = (event) => {
        setShortInput(event.target.value);
        const textarea = event.target;
        textarea.style.height = "0em";
        textarea.style.height = `${textarea.scrollHeight + 5}px`;
    }

    return (
        <div className="backGround">
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
                    }
                }}
            ></textarea>
        </div>
    );
}

export default Tab_oasis_ideas;