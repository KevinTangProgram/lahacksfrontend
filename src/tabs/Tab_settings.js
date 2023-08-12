import '../CSS/Test.css';
import React, { useState } from 'react';
import Tab_settings_user from './Tab_settings_user';
import Tab_settings_oasis from './Tab_settings_oasis';
import Clock from '../components/clock';
import Observer from '../components/observer';
import '../CSS/Tab_oasis.css';
import { StorageManager } from '../utilities/storageManager';
//
function Tab_settings(props) {
    // Tab Navigation:
    const [bottomTab, setBottomTab] = useState([props.default === "user" ? "tabActive" : "tabInactive", props.default === "oasis" ? "tabActive" : "tabInactive"]);

    return (
        <div className="backGround" style={{"padding-bottom": "30px"}}>
            <div className="tablet">
                {/* start banner */}
                <div className="dateAndTime">
                    <Clock type={"date"} className={"alignLeft"} />
                    <Observer dependencies={"StorageState"} Component={() => {
                        if (StorageManager.unsyncCounter === 0) {
                            // Synced:
                            return <img className="iconSync" src="/images/icons/iconConfirm.png" alt="Synced" />
                        }
                        // Syncing:
                        return <div className="loader iconSync"></div> 
                        }} />
                    <h3 className="alignCenter">Settings</h3>
                    <Clock type={"time"} className={"alignRight"} />
                </div>
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