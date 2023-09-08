import '../CSS/Test.css';
import Tab_home from '../tabs/Tab_home';
import Tab_settings from '../tabs/Tab_settings';
import DebuggerPanel from '../utilities/debugger';
import { UserManager } from '../utilities/userManager';
import Authenticator from '../components/AuthenticationUI/authenticator';
import { Helmet } from 'react-helmet';
//
import React, { useState, useEffect } from 'react';

function Home() {
    // Tabs:
    const [currentTab, setCurrentTab] = useState(["tabActive", "tabInactive"]);
    const focusOasis = () => {
        setCurrentTab(["tabInactive", "tabActive", "tabInactive"]);
    }
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


    return (
        <div className="Main">
            <Helmet>
                <title>Homepage - Idea Oasis</title>
            </Helmet>
            <div className="tablet" id="noBackground">
                <div className="threeButtons">
                    <button className="selectCells" id={currentTab[0]} onClick={() => { setCurrentTab(["tabActive", "tabInactive"]) }}>Home</button>
                    <button className="selectCells lowOpacity">Oasis</button>
                    <button className="selectCells" id={currentTab[1]} onClick={() => { setCurrentTab(["tabInactive", "tabActive"]) }}>Settings</button>
                </div>
            </div>

            <div className="activeTab">
                {currentTab[0] === "tabActive" && <Tab_home focusOasis={focusOasis} />}
                {currentTab[1] === "tabActive" && <Tab_settings type="home" />}
            </div>

            {showLogin && <Authenticator closeFunc={() => { setShowLogin(false) }} />}


            <DebuggerPanel />

        </div>

    );
}

export default Home;