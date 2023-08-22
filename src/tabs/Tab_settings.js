import React, { useState } from 'react';
import Tab_settings_user from './Tab_settings_user';
import Tab_settings_oasis from './Tab_settings_oasis';
import '../CSS/Tab_oasis.css';

import StatusBar from '../components/statusBar';
//
function Tab_settings(props) {
    // Tab Navigation:
    const showOasisSettings = (props.type === "oasis");
    const [bottomTab, setBottomTab] = useState(!showOasisSettings ? ["tabActive", "tabInactive"] : ["tabInactive", "tabActive"]);

    return (
        <div className="backGround" style={{"padding-bottom": "30px"}}>
            <div className="tablet">
                <StatusBar headerText={"hellohellohellohellohe llohellohellohello hellohellohellohellohellohellohellohello"}/>
                <div className="twoButtons">
                    <button className="selectCells" id={bottomTab[0]} onClick={() => { setBottomTab(["tabActive", "tabInactive"]) }}>User</button>
                    <button className={showOasisSettings ? "selectCells" : "selectCells lowOpacity"} id={showOasisSettings ? bottomTab[1] : null} onClick={() => { if (showOasisSettings) setBottomTab(["tabInactive", "tabActive"]); }}>Oasis</button>
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