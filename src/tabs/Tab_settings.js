import React, { useState, useContext } from 'react';
import { Context } from '../utilities/context';
import Tab_settings_user from './Tab_settings_user';
import Tab_settings_oasis from './Tab_settings_oasis';
import '../CSS/Tab_oasis.css';
import { UserManager } from '../utilities/userManager';
import Authenticator from '../components/AuthenticationUI/authenticator';

import StatusBar from '../components/OasisUI/statusBar';
//
function Tab_settings(props) {
    // Oasis:
    const oasisInstance = useContext(Context).oasisInstance;
    const showOasis = oasisInstance && (props.type === "oasis");
    // Tab Navigation:
    const [bottomTab, setBottomTab] = useState(!showOasis ? ["tabActive", "tabInactive"] : ["tabInactive", "tabActive"]);
    // Login Tab:
    const [showUserSettings, setShowUserSettings] = useState(UserManager.user._id !== undefined);
    const [showLogin, setShowLogin] = useState(false);
    const closeMenuAndRefresh = () => {
        setShowLogin(false);
        setShowUserSettings(UserManager.user._id !== undefined);
    }
    const LoginMenu = () => {
        return (
            <div className="alignCenter">
                <br></br>
                <button onClick={() => {
                    setShowLogin(true);
                }}>login</button>
                {showLogin && <Authenticator closeFunc={closeMenuAndRefresh} />}
            </div>
        );
    }


    return (
        <div className="backGround" style={{"paddingBottom": "30px"}}>
            <div className="tablet">
                <StatusBar />
                <div className="twoButtons">
                    <button className="selectCells" id={bottomTab[0]} onClick={() => { setBottomTab(["tabActive", "tabInactive"]) }}>User</button>
                    <button className={showOasis ? "selectCells" : "selectCells lowOpacity"} id={showOasis ? bottomTab[1] : null} onClick={() => { if (showOasis) setBottomTab(["tabInactive", "tabActive"]); }}>Oasis</button>
                </div>
            </div>
            <div className="activeTab">
                {bottomTab[0] === "tabActive" && (
                    showUserSettings ? <Tab_settings_user /> : <LoginMenu />)}
                {bottomTab[1] === "tabActive" &&  <Tab_settings_oasis />}
            </div>
        </div>
    );
}



export default Tab_settings;