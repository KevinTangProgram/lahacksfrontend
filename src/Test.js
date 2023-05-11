import './CSS/Test.css';
//
import React, { useState, useEffect } from 'react';
//
import Tab_oasis from './tabs/Tab_oasis';
import Tab_home from './tabs/Tab_home';
import Tab_settings from './tabs/Tab_settings';

function Test()
{
    const [currentTab, setCurrentTab] = useState(["tabInactive", "tabActive", "tabInactive"]);
        
    return (
        <div className="Main">
            <div className="mainHeader">
                <img src="/images/icons/iconLogo.png" id="homeImage" height="150" width="150" alt="Palm Tree"></img>
                <div className="centerVertically">
                    <h1 className="mainTitle">Idea Oasis</h1>
                    <a className="mainTitle" href="/pricing">Pricing</a>
                </div>
            </div>

            <div className="tablet" id="noBackground">
                <div className="threeButtons">
                    <button className="selectCells" id={currentTab[0]} onClick={() => { setCurrentTab(["tabActive", "tabInactive", "tabInactive"]) }}>Home</button>
                    <button className="selectCells" id={currentTab[1]} onClick={() => { setCurrentTab(["tabInactive", "tabActive", "tabInactive"]) }}>Your Oasis</button>
                    <button className="selectCells" id={currentTab[2]} onClick={() => { setCurrentTab(["tabInactive", "tabInactive", "tabActive"]) }}>Settings</button>
                </div>
            </div>

            <div className="activeTab">
                {currentTab[0] === "tabActive" && <Tab_home />}
                {currentTab[1] === "tabActive" && <Tab_oasis />}
                {currentTab[2] === "tabActive" && <Tab_settings />}
            </div>
        </div>
    );
}

export default Test;