import '../CSS/Test.css';
import React, { useState } from 'react';
import Tab_settings_user from './Tab_settings_user';
import Tab_settings_oasis from './Tab_settings_oasis';
//
function Tab_settings(props) {
    // Tab Navigation:
    const [bottomTab, setBottomTab] = useState([props.default === "user" ? "tabActive" : "tabInactive", props.default === "oasis" ? "tabActive" : "tabInactive"]);

    return (
        <div className="backGround">
            <div className="tablet">
                <h2 className="alignCenter" >Settings</h2>
                <div className="twoButtons">
                    <button className="selectCells" id={bottomTab[0]} onClick={() => { setBottomTab(["tabActive", "tabInactive"]) }}>User</button>
                    <button className="selectCells" id={bottomTab[1]} onClick={() => { setBottomTab(["tabInactive", "tabActive"]) }}>Oasis</button>
                </div>
            </div>
            <div className="activeTab">
                {bottomTab[0] === "tabActive" && <Tab_settings_user />}
                {bottomTab[1] === "tabActive" && <Tab_settings_oasis />}
            </div>
        </div>
    );
}

export default Tab_settings;