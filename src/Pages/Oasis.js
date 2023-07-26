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

const timeString = (new Date()).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
let temp = 0;
if (timeString.includes("AM") && Number(timeString.substring(0, timeString.indexOf(':'))) < 12 && Number(timeString.substring(0, timeString.indexOf(':'))) > 5) {
    temp = 0;
}
else if (timeString.includes("PM") && Number(timeString.substring(0, timeString.indexOf(':'))) < 5 || Number(timeString.substring(0, timeString.indexOf(':'))) == 12)
{
    temp = 1;
}
else if (timeString.includes("PM") && Number(timeString.substring(0, timeString.indexOf(':'))) > 4 && Number(timeString.substring(0, timeString.indexOf(':'))) < 7) {
    temp = 2;
}
else if (timeString.includes("PM") && Number(timeString.substring(0, timeString.indexOf(':'))) > 6 && Number(timeString.substring(0, timeString.indexOf(':'))) < 9) {
    temp = 3;
}
else if (timeString.includes("PM") && Number(timeString.substring(0, timeString.indexOf(':'))) > 8) {
    temp = 4;
}
else if (timeString.includes("AM") && Number(timeString.substring(0, timeString.indexOf(':'))) < 6)
{
    temp = 5;
}

function Oasis() {
    const [currentTab, setCurrentTab] = useState(["tabInactive", "tabActive", "tabInactive"]);
    const focusOasis = () => {
        setCurrentTab(["tabInactive", "tabActive", "tabInactive"]);
    }
    const [tracker, setTracker] = useState(temp);
    const welcome = ["Good Morning ", "Good Afternoon ", "Good Afternoon ", "Good Evening ", "Good Evening ", "Good Morning "];
    const image = ["morning.png", "ocean.png", "afternoon.png", "evening.png", "night.png", "night.png"];

    useEffect(() => {
        const interval = setInterval(() => {
            const timeString = (new Date()).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            if (timeString.includes("AM") && Number(timeString.substring(0, timeString.indexOf(':'))) < 12 && Number(timeString.substring(0, timeString.indexOf(':'))) > 5) {
                setTracker(0);
            }
            else if (timeString.includes("PM") && Number(timeString.substring(0, timeString.indexOf(':'))) < 5 || Number(timeString.substring(0, timeString.indexOf(':'))) == 12)
            {
                setTracker(1);
            }
            else if (timeString.includes("PM") && Number(timeString.substring(0, timeString.indexOf(':'))) > 4 && Number(timeString.substring(0, timeString.indexOf(':'))) < 7) {
                setTracker(2);
            }
            else if (timeString.includes("PM") && Number(timeString.substring(0, timeString.indexOf(':'))) > 6 && Number(timeString.substring(0, timeString.indexOf(':'))) < 9) {
                setTracker(3);
            }
            else if (timeString.includes("PM") && Number(timeString.substring(0, timeString.indexOf(':'))) > 8) {
                setTracker(4);
            }
            else if (timeString.includes("AM") && Number(timeString.substring(0, timeString.indexOf(':'))) < 6 || Number(timeString.substring(0, timeString.indexOf(':'))) == 12)
            {
                setTracker(5);
            }
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