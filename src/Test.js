import React, { useState } from 'react';
import axios from 'axios';

function Test()
{
    const [shortInput, setShortInput] = useState("");

    const handleChangeInput = (event) => {setShortInput(event.target.value);
        const textarea = event.target;
        textarea.style.height = "0em";
        textarea.style.height = `${textarea.scrollHeight + 5}px`;}
        
    return (
        <>
        <div className="mainHeader">
            <img src="palm.png" id="homeImage" height="150" width="150" alt="Palm Tree"></img>
            <h1 className="centerVertically">Idea Oasis</h1>
        </div>

        <div className="tablet" id="noBackground">
            <div className="threeButtons">
                <button className="selectCells">Home</button>
                <button className="selectCells">Your Oasis</button>
                <button className="selectCells">About</button>
            </div>
        </div>
        <div className="backGround">
            <div className="tablet">
                <div className="dateAndTime">
                    <p1 className="alignLeft">{new Date().toLocaleDateString()}</p1>
                    <p1 className="alignRight">{new Date().toLocaleTimeString()}</p1>
                </div>
                <h1>Title</h1>
                <div className="twoButtons">
                    <button className="selectCells">Organized</button>
                    <button className="selectCells">Original Ideas</button>
                </div>
                <div>
                    <textarea placeholder="What stuff is your professor saying now?" value={shortInput} onChange={handleChangeInput}
                    // Add onKeyPress to add thought on enter
                    onKeyDown={(event) => { 
                        if (event.key === "Enter" && event.shiftKey) 
                        {
                            event.preventDefault();
                            setShortInput(shortInput+"\n")
                        }
                        else if (event.key === "Enter") 
                        {
                            const textarea = event.target;
                            textarea.style.height = "auto";
                            event.preventDefault(); 
                        }}}
                    ></textarea>
                </div>
            </div>
        </div>
        
        
        </>
    )
}

export default Test;