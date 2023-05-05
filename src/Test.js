import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Test()
{
    const [shortInput, setShortInput] = useState("");
    const [currentTab, setCurrentTab] = useState(["selected", "", "selected"]);
    const [hour, setHour] = useState(new Date().toLocaleTimeString().substring(0, new Date().toLocaleTimeString().length - 6) + new Date().toLocaleTimeString().substring(new Date().toLocaleTimeString().length - 3, new Date().toLocaleTimeString().length));


    useEffect(() => {
        const interval = setInterval(() => {
            setHour(new Date().toLocaleTimeString().substring(0, new Date().toLocaleTimeString().length - 6) + new Date().toLocaleTimeString().substring(new Date().toLocaleTimeString().length - 3, new Date().toLocaleTimeString().length));
        }, 1000);
        return () => clearInterval(interval);
    }, [hour])

    const handleChangeInput = (event) => {setShortInput(event.target.value);
        const textarea = event.target;
        textarea.style.height = "0em";
        textarea.style.height = `${textarea.scrollHeight + 5}px`;}
        
    return (
        <>
        <div className="mainHeader">
            <img src="images/icons/iconLogo.png" id="homeImage" height="150" width="150" alt="Palm Tree"></img>
            <div className="centerVertically">
                <h1 className="mainTitle">Idea Oasis</h1>
                <a className="mainTitle" href="/pricing">Pricing</a>
            </div>
        </div>

        <div className="tablet" id="noBackground">
            <div className="threeButtons">
                <button className="selectCells" id={currentTab[0]} onClick={() => {setCurrentTab(["", "selected", "selected"])}}>Home</button>
                <button className="selectCells" id={currentTab[1]} onClick={() => {setCurrentTab(["selected", "", "selected"])}}>Your Oasis</button>
                <button className="selectCells" id={currentTab[2]} onClick={() => {setCurrentTab(["selected", "selected", ""])}}>Settings</button>
            </div>
        </div>
        <div className="backGround">
            <div className="tablet">
                <div className="dateAndTime">
                    <p1 className="alignLeft">{new Date().toLocaleDateString()}</p1>
                    <p1 className="alignRight">{new Date().toLocaleTimeString().substring(0, new Date().toLocaleTimeString().length - 6) + new Date().toLocaleTimeString().substring(new Date().toLocaleTimeString().length - 3, new Date().toLocaleTimeString().length)}</p1>
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