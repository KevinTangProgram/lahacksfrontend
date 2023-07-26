import '../CSS/Test.css';
//
import React, { useState, useEffect } from 'react';
//
import Tab_oasis from '../tabs/Tab_oasis';
import Tab_home from '../tabs/Tab_home';
import Tab_settings from '../tabs/Tab_settings';
//
import DebuggerPanel from '../utilities/debugger';
import Clock from '../components/clock';
import { UserManager } from '../utilities/userManager';

const userId = "6444bb82eb14ecacdb125107";

function Oasis() {
    
    function getHour() {
        const timeString = (new Date()).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        const hour = Number(timeString.substring(0, timeString.indexOf(':')));
        const ante = timeString.includes("AM");
        if (ante && hour > 5 && hour < 12)
        {
            return 0;
        }
        else if (!ante && hour < 5 || hour == 12)
        {
            return 1;
        }
        else if (!ante && hour > 4 && hour < 7)
        {
            return 2;
        }
        else if (!ante && hour > 6 && hour < 9)
        {
            return 3;
        }
        else if (!ante && hour > 8)
        {
            return 4;
        }
        else if (ante && hour < 6 || hour == 12)
        {
            return 5;
        }
    }

    const [currentTab, setCurrentTab] = useState(["tabInactive", "tabActive", "tabInactive"]);
    const focusOasis = () => {
        setCurrentTab(["tabInactive", "tabActive", "tabInactive"]);
    }
    const [tracker, setTracker] = useState(getHour());
    const welcome = ["Good Morning ", "Good Afternoon ", "Good Afternoon ", "Good Evening ", "Good Evening ", "Good Morning "];
    const image = ["morning.png", "ocean.png", "afternoon.png", "evening.png", "night.png", "night.png"];

    useEffect(() => {
        const interval = setInterval(() => {
            setTracker(getHour());
        }, 3000);
    }, []);

    function welcomeMessage()
    {
        if (!UserManager.user._id)
        {
            return "Guest";
        }
        else
        {
            return UserManager.user.info.username.split(" ")[0];
        }
    }

    return (
        <div>
            <div style={{"position": "relative", "display": "flex"}}>
                <img src={"/images/icons/" + image[tracker]} style={{"width": "100%", "z-index": "-1"}}>
                    
                </img>
                <h1 style={{"color": "black", "padding-top": "5em", "margin-top": "0", "text-align": "center", "width": "100%", "position": "absolute"}}>{welcome[tracker] + welcomeMessage()}</h1>
                <div id="noBackground" style={{"position": "absolute", "top": "auto", "bottom": "0", "width": "100%"}}>
                    <div className="threeButtons" style={{}}>
                        <button className="selectCells" id={currentTab[0]} onClick={() => { setCurrentTab(["tabActive", "tabInactive", "tabInactive"]) }}>Home</button>
                        <button className="selectCells" id={currentTab[1]} onClick={() => { setCurrentTab(["tabInactive", "tabActive", "tabInactive"]) }}>Oasis</button>
                        <button className="selectCells" id={currentTab[2]} onClick={() => { setCurrentTab(["tabInactive", "tabInactive", "tabActive"]) }}>Settings</button>
                    </div>
                </div>
            </div>
            
            <div className="activeTab">
                {currentTab[0] === "tabActive" && <Tab_home focusOasis={focusOasis} />}
                {currentTab[1] === "tabActive" && <Tab_oasis />}
                {currentTab[2] === "tabActive" && <Tab_settings default="oasis" />}
            </div>

            <DebuggerPanel />
        </div>

    );
}

export default Oasis;