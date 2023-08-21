import React, { useState } from 'react';
import Tab_settings_user from './Tab_settings_user';
import Tab_settings_oasis from './Tab_settings_oasis';
import Clock from '../components/clock';
import '../CSS/Tab_oasis.css';
import SyncStatus from '../components/syncStatus';
import StatusBar from '../components/statusBar';
//
function Tab_settings(props) {
    // Tab Navigation:
    const [bottomTab, setBottomTab] = useState([props.default === "user" ? "tabActive" : "tabInactive", props.default === "oasis" ? "tabActive" : "tabInactive"]);

    return (
        <div className="backGround" style={{"padding-bottom": "30px"}}>
            <div className="tablet">
                {/* start banner */}
                <StatusBar header={"hello"}/>
                {/* end banner */}
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