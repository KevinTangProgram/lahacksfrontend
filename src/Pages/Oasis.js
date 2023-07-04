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

const userId = "6444bb82eb14ecacdb125107";

function Oasis() {
    const [currentTab, setCurrentTab] = useState(["tabInactive", "tabActive", "tabInactive"]);
    const focusOasis = () => {
        setCurrentTab(["tabInactive", "tabActive", "tabInactive"]);
    }
    console.log(currentTab);
    return (
        <div>
            <div style={{"position": "relative", "display": "flex"}}>
                <img src="/images/icons/ocean.png" style={{"width": "100%", "z-index": "-1"}}>
                    
                </img>
                <h1 style={{"color": "black", "padding-top": "4em", "margin-top": "0", "text-align": "center", "width": "100%", "position": "absolute"}}>Good Morning, Guest</h1>
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