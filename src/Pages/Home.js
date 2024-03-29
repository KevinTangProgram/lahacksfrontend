import '../CSS/Test.css';
import Tab_home from '../tabs/Tab_home';
import Tab_settings from '../tabs/Tab_settings';
import DebuggerPanel from '../utilities/debugger';
//
import React, { useState, useEffect } from 'react';

function Home() {
    const [currentTab, setCurrentTab] = useState(["tabActive", "tabInactive"]);
    const focusOasis = () => {
        setCurrentTab(["tabInactive", "tabActive", "tabInactive"]);
    }
    return (
        <div className="Main">
            <div className="tablet" id="noBackground">
                <div className="threeButtons">
                    <button className="selectCells" id={currentTab[0]} onClick={() => { setCurrentTab(["tabActive", "tabInactive"]) }}>Home</button>
                    <button className="selectCells lowOpacity">Oasis</button>
                    <button className="selectCells" id={currentTab[1]} onClick={() => { setCurrentTab(["tabInactive", "tabActive"]) }}>Settings</button>
                </div>
            </div>

            <div className="activeTab">
                {currentTab[0] === "tabActive" && <Tab_home focusOasis={focusOasis} />}
                {currentTab[1] === "tabActive" && <Tab_settings default="user" />}
            </div>

            <DebuggerPanel />

        </div>

    );
}

export default Home;