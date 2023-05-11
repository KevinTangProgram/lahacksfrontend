import './CSS/Test.css';
//
import React, { useState, useEffect } from 'react';
import Clock from './components/clock.js';
import GenerationOptionsUI from './components/generateUI';

const userId = "6444bb82eb14ecacdb125107";

function Test()
{
    const [shortInput, setShortInput] = useState("");
    const [currentTab, setCurrentTab] = useState(["tabInactive", "tabActive", "tabInactive"]);
    const [bottomTab, setBottomTab] = useState(["tabActive", "tabInactive"]);

    const handleChangeInput = (event) => {setShortInput(event.target.value);
        const textarea = event.target;
        textarea.style.height = "0em";
        textarea.style.height = `${textarea.scrollHeight + 5}px`;}

    function addIndividualMessage()
    {
        
    }
        
    return (
        <>
        <div className="mainHeader">
            <img src="/images/icons/iconLogo.png" id="homeImage" height="150" width="150" alt="Palm Tree"></img>
            <div className="centerVertically">
                <h1 className="mainTitle">Idea Oasis</h1>
                <a className="mainTitle" href="/pricing">Pricing</a>
            </div>
        </div>

        <div className="tablet" id="noBackground">
            <div className="threeButtons">
                <button className="selectCells" id={currentTab[0]} onClick={() => {setCurrentTab(["tabActive", "tabInactive", "tabInactive"])}}>Home</button>
                <button className="selectCells" id={currentTab[1]} onClick={() => {setCurrentTab(["tabInactive", "tabActive", "tabInactive"])}}>Your Oasis</button>
                <button className="selectCells" id={currentTab[2]} onClick={() => {setCurrentTab(["tabInactive", "tabInactive", "tabActive"])}}>Settings</button>
            </div>
        </div>
        <div className="backGround">
            <div className="tablet">
                <div className="dateAndTime">
                    <Clock type={"date"} className={"alignLeft"}/>
                    <Clock type={"time"} className={"alignRight"}/>
                </div>
                <h1>Title</h1>
                <div className="twoButtons">
                    <button className="selectCells" id={bottomTab[0]} onClick={() => {setBottomTab(["tabActive", "tabInactive"])}}>Ideas</button>
                    <button className="selectCells" id={bottomTab[1]} onClick={() => {setBottomTab(["tabInactive", "tabActive"])}}>Generated Notes</button>
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
        <GenerationOptionsUI 
            title = ""
            messageArray = {["hello my name is Aaron, I have words, and I can swim.", "hello2", "OMGI"]}
        />
        
        </>
    )
}

export default Test;