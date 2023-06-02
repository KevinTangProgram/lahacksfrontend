

import '../CSS/Test.css';
//
import React, { useState, useEffect } from 'react';
//
import Tab_home from '../tabs/Tab_home';
import Tab_settings from '../tabs/Tab_settings';
//
import DebuggerPanel from '../utilities/debugger';

const userId = "6444bb82eb14ecacdb125107";

function Home() {
    const [currentTab, setCurrentTab] = useState(["tabActive", "tabInactive"]);

    return (
        <div className="Main">
            <div className="tablet" id="noBackground">
                <div className="threeButtons">
                    <button className="selectCells" id={currentTab[0]} onClick={() => { setCurrentTab(["tabActive", "tabInactive"]) }}>Home</button>
                    <button className="selectCells lowOpacity">Oasis</button>
                    <button className="selectCells" id={currentTab[1]} onClick={() => { setCurrentTab(["tabInactive", "tabActive"]) }}>User Settings</button>
                </div>
            </div>

            <div className="activeTab">
                {currentTab[0] === "tabActive" && <Tab_home setCurrentTab={setCurrentTab} />}
                {currentTab[1] === "tabActive" && <Tab_settings />}
            </div>

            <DebuggerPanel />

        </div>

    );
}

export default Home;