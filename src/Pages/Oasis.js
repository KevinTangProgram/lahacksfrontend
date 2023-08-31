import '../CSS/Test.css';
//
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import { Context } from '../utilities/context';
//
import Tab_oasis from '../tabs/Tab_oasis';
import Tab_home from '../tabs/Tab_home';
import Tab_settings from '../tabs/Tab_settings';
//
import DebuggerPanel from '../utilities/debugger';
import { UserManager } from '../utilities/userManager';
import { OasisManager } from '../utilities/oasisManager';
import Authenticator from '../components/AuthenticationUI/authenticator';
import Loader from '../components/loader';
   

function Oasis() {
    // User popups:
    const [showLogin, setShowLogin] = useState(false);
    useEffect(() => {
        UserManager.refreshToken();
        const checkToken = async () => {
            if (await UserManager.getValidToken() === false) {
                setShowLogin(true);
            }
        }
        checkToken();
    }, []);
    // Meridian Display Logic:
    function getHour() {
        const timeString = (new Date()).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        const hour = Number(timeString.substring(0, timeString.indexOf(':')));
        const ante = timeString.includes("AM");
        if (ante && hour > 5)
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
    useEffect(() => {
        const interval = setInterval(() => {
            setTracker(getHour());
        }, 3000);
    }, []);
    const [tracker, setTracker] = useState(getHour());
    const welcome = ["Good Morning", "Good Afternoon", "Good Afternoon", "Good Evening", "Good Evening", "Good Morning"];
    const image = ["morning.png", "ocean.png", "afternoon.png", "evening.png", "night.png", "night.png"];
    
    // Tab Logic:
    const [currentTab, setCurrentTab] = useState(["tabInactive", "tabActive", "tabInactive"]);
    const focusOasis = () => {
        setCurrentTab(["tabInactive", "tabActive", "tabInactive"]);
    }

    // Oasis Instance Logic:
    const { id } = useParams();
    const context = useContext(Context);
    const [error, setError] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const fetchOasis = async () => {
        try {
            const oasis = await OasisManager.createOasisInstance(id);
            context.oasisInstance = oasis;
            setError(null);
            setLoaded(true);
        }
        catch (error) {
            context.oasisInstance = null;
            setError(error);
            setLoaded(false);
        }
    };
    useEffect(() => {
        setLoaded(false);
        fetchOasis();
    }, [id]);

    // Content Logic:
    function welcomeMessage()
    {
        if (!UserManager.user._id)
        {
            return ""; // Good evening
        }
        else
        {
            return ", " + UserManager.user.info.username.split(" ")[0]; // Good evening, [username]
        }
    }
    
    // Output:
    return (
        <div>
            {/* Background + Image:  */}
            <div style={{"position": "relative", "display": "flex"}}>
                <img src={"/images/icons/" + image[tracker]} style={{"width": "100%", "z-index": "-1"}} />
                <h1 style={{"color": "black", "padding-top": "5em", "margin-top": "0", "text-align": "center", "width": "100%", "position": "absolute", "fontStyle": "italic"}}>{welcome[tracker] + welcomeMessage()}</h1>
                <div id="noBackground" style={{"position": "absolute", "top": "auto", "bottom": "0", "width": "100%"}}>
                    <div className="threeButtons" style={{}}>
                        <button className="selectCells" id={currentTab[0]} onClick={() => { setCurrentTab(["tabActive", "tabInactive", "tabInactive"]) }}>Home</button>
                        <button className="selectCells" id={currentTab[1]} onClick={() => { setCurrentTab(["tabInactive", "tabActive", "tabInactive"]) }}>Oasis</button>
                        <button className="selectCells" id={currentTab[2]} onClick={() => { setCurrentTab(["tabInactive", "tabInactive", "tabActive"]) }}>Settings</button>
                    </div>
                </div>
            </div>
            {/* Content: */}
            <div className="activeTab">
                {/* Note: because the following components are not loaded until oasisInstance exists, 
            we can freely access oasisInstance inside them without null checks. */}
                {/* Tab_Home selected: */}
                {currentTab[0] === "tabActive" && <Tab_home focusOasis={focusOasis} />}
                {/* Tab_Oasis selected: */}
                {currentTab[1] === "tabActive" && (
                    <>
                        {error && <div className="oasisError">{error}</div>}
                        {!loaded ? <Loader type="content" /> : <Tab_oasis />}
                    </>
                )}
                {/* Tab_Settings selected: */}
                {currentTab[2] === "tabActive" && (
                    <>
                        {error && <div className="oasisError">{error}</div>}
                        {!loaded ? <Loader type="content" /> : <Tab_settings type="oasis" />}
                    </>
                )}
            </div>
            {showLogin && <Authenticator closeFunc={() => { setShowLogin(false) }} />}

            <DebuggerPanel />
        </div>
    );
}

export default Oasis;