import '../CSS/Test.css';
//
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import { Context } from '../utilities/context';
import { useSyncedObject, deleteSyncedObject } from 'react-synced-object';
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
import { Helmet } from 'react-helmet';
import { currentDateKey } from '../components/clock';
   

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
    const MeridianDisplay = () => {
        const { syncedData } = useSyncedObject(currentDateKey);
        function getHour() {
            const now = syncedData.now;
            const hour = now.hour();
            const isAM = now.format('A') === 'AM';

            if (isAM && hour > 5) {
                return 0;
            } else if (!isAM && (hour < 5 || hour === 12)) {
                return 1;
            } else if (!isAM && hour > 4 && hour < 7) {
                return 2;
            } else if (!isAM && hour > 6 && hour < 9) {
                return 3;
            } else if (!isAM && hour > 8) {
                return 4;
            } else if (isAM && (hour < 6 || hour === 12)) {
                return 5;
            }
            return null;
        }
        function welcomeMessage() {
            if (!UserManager.user._id) {
                return ""; // Good evening
            }
            else {
                return ", " + UserManager.user.info.username.split(" ")[0]; // Good evening, [username]
            }
        }
        const tracker = getHour();
        const welcome = ["Good Morning", "Good Afternoon", "Good Afternoon", "Good Evening", "Good Evening", "Good Morning"];
        const image = ["morning.png", "ocean.png", "afternoon.png", "evening.png", "night.png", "night.png"];

        return (
            <div style={{ "position": "relative", "display": "flex" }}>
                <img src={"/images/icons/" + image[tracker]} style={{ "width": "100%", "z-index": "-1" }} />
                <h1 style={{ "color": "black", "padding-top": "5em", "margin-top": "0", "text-align": "center", "width": "100%", "position": "absolute", "fontStyle": "italic" }}>{welcome[tracker] + welcomeMessage()}</h1>
            </div>
        );
    };

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

    // Tab Logic:
    const [currentTab, setCurrentTab] = useState(["tabInactive", "tabActive", "tabInactive"]);
    const focusOasis = (ID) => {
        setCurrentTab(["tabInactive", "tabActive", "tabInactive"]);
        // Delete the active oasis syncedObject if:
            // 1. We are moving to a new oasis (diff ID).
            // 2. Other tabs aren't using the active oasis.
            // - EX: two tabs of "my oasis", one tab does focusOasis("my new oasis")
        if (context?.oasisInstance) {
            const oldID = context.oasisInstance.data._id;
            if (oldID !== ID) {
                deleteSyncedObject(`oasis/${oldID}`);
            }
        }
    }

    
    // Output:
    return (
        <div>
            {/* Helmet: */}
            {context.oasisInstance && <Helmet>
                <title>'{context.oasisInstance.getData("info").title}' - Idea Oasis</title>
            </Helmet>}

            {/* Meridian Display + Tab Select:  */}
            <div style={{"position": "relative", "display": "flex"}}>
                <MeridianDisplay />
                <div id="noBackground" style={{"position": "absolute", "top": "auto", "bottom": "0", "width": "100%"}}>
                    <div className="threeButtons" style={{}}>
                        <button className="selectCells" id={currentTab[0]} onClick={() => { setCurrentTab(["tabActive", "tabInactive", "tabInactive"]) }}>Home</button>
                        <button className="selectCells" id={currentTab[1]} onClick={() => { setCurrentTab(["tabInactive", "tabActive", "tabInactive"]) }}>Oasis</button>
                        <button className="selectCells" id={currentTab[2]} onClick={() => { setCurrentTab(["tabInactive", "tabInactive", "tabActive"]) }}>Settings</button>
                    </div>
                </div>
            </div>

            {/* Content: */}
            {/* Note: because the following components are not loaded until oasisInstance exists, 
            we can freely access oasisInstance inside them without null checks. */}
            <div className="activeTab">
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

            {/* Popups: */}
            {showLogin && <Authenticator closeFunc={() => { setShowLogin(false) }} />}
            <DebuggerPanel />
        </div>
    );
}

export default Oasis;