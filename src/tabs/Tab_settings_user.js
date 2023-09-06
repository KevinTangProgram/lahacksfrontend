import '../CSS/Test.css';
import React, { useEffect, useState } from 'react';
import Authenticator from '../components/AuthenticationUI/authenticator';
import { UserManager } from '../utilities/userManager';
import Tooltip from '../components/tooltip';
import Loader from '../components/loader';
import { getHumanizedDate } from '../utilities/utilities';

//
function Tab_settings_user() {
    // User info:
    const user = UserManager.user;
    const settings = user.settings;
    const { username, email } = user.info;
    const { theme, notifications, oasisSort, privacy, misc } = settings;
    const { joinDate, messagesSent, oasisCreated, oasisDeleted} = user.stats;

    // Save changes and Syncing Icons:
        // Enum setup:
    const STATE = {
        CLEAN_INITIAL: 0, // Initial state, no banner shown.
        DIRTY_OPEN_BANNER: 1, // Marked as dirty, animate banner opening.
        DIRTY_STATIC: 2,  // Visible banner with sync button.
        DIRTY_SYNCING: 3,  // Visible banner with loading icon.
        DIRTY_ERROR: 4,  // Visible banner with error icon.
        CLEAN_CLOSE_BANNER: 5, // Marked as clean, animate banner closing.
        //
        showBanner() {
            return userState !== STATE.CLEAN_INITIAL;
        },
        bannerClassName() {
            switch (userState) {
                case STATE.DIRTY_OPEN_BANNER:
                    return "saveChangesBanner opening";
                case STATE.CLEAN_CLOSE_BANNER:
                    return "saveChangesBanner closing";
                default:
                    return "saveChangesBanner"; // DIRTY_STATIC, DIRTY_SYNCING, DIRTY_ERROR.
            }
        },
        isLoading() {
            return userState === STATE.DIRTY_SYNCING;
        },
        showButton() {
            return (userState === STATE.DIRTY_OPEN_BANNER || userState === STATE.DIRTY_STATIC);
        },
        isSynced() {
            return userState === STATE.CLEAN_CLOSE_BANNER || userState === STATE.CLEAN_INITIAL;
        },
        isDirty() {
            return userState !== STATE.CLEAN_INITIAL;
        }
    }
    const [userState, setUserState] = useState(user.STATE ? user.STATE : STATE.CLEAN_INITIAL); 
    const [error, setError] = useState(null);
    const saveChanges = () => {
        if (STATE.isLoading()) {
            return;
        }
        setUserState(STATE.DIRTY_SYNCING);
        user.STATE = user.STATE = STATE.CLEAN_INITIAL;
        UserManager.syncChanges()
            .then(() => {
                setUserState(STATE.CLEAN_CLOSE_BANNER);
                setError(null);
            })
            .catch((error) => {
                setUserState(STATE.DIRTY_ERROR);
                user.STATE = STATE.DIRTY_ERROR;
                setError(error);
            });
    }
    const markDirty = () => {
        setUserState(STATE.DIRTY_OPEN_BANNER);
        user.STATE = STATE.DIRTY_STATIC;
    }



    // Sections:
    function Profile() {
        // Privacy:
        const [visibilityState, setVisibilityState] = useState(privacy.profile === "public");
        const handleVisibilityChange = (event) => {
            const { name, checked } = event.target;
            setVisibilityState(checked);
            privacy.profile = (checked ? "public" : "private");
            markDirty();
        }
        // Security:
            // Reset Password:
        const [activeAuthMenu, setActiveAuthMenu] = useState(0); // 0=none, 1=reset password, 2=delete account.
        const closeFunc = () => {
            setActiveAuthMenu(0);
        }
        const UserPreview = () => {
            return (
                <div className='oasisPreview'>
                    <h3 className="title">My Profile: </h3>
                    <div className="content desc">
                        <p style={{ "textDecoration": "underline" }}>{username}</p> <br />
                        <input disabled value={email} />
                    </div>
                </div>
            );
        }
        return (
            <div>
                {/* Profile Information:  */}
                <UserPreview />
                <div>
                    <h3>Profile Visiblity: </h3>
                    <label>
                        Publicly visible:
                        <input
                            type="checkbox"
                            name="profile visibility"
                            checked={visibilityState}
                            onChange={handleVisibilityChange}
                        />
                    </label>
                    <Tooltip text={"Functionality coming soon!"} />
                </div>

                <div>
                    <h3>Security: </h3>
                    <button onClick={() => {setActiveAuthMenu(1)}}>Reset Password</button>
                    <button onClick={() => {setActiveAuthMenu(2)}}>Delete Account</button>
                    {/* Open Reset Password Menu: */}
                    {activeAuthMenu === 1 && <Authenticator menuID={4} closeFunc={closeFunc} email={email} />}
                    {/* Open Delete Account Menu: */}
                    {activeAuthMenu === 2 && <Authenticator menuID={5} closeFunc={closeFunc} UserPreview={UserPreview} />}
                </div>
            </div>
        );
    }
    function Stats() {
        return (
            <div>
                <h3>Stats</h3>
                <ul>
                    <li>Joined: {getHumanizedDate(joinDate)}</li>
                    <li>Messages Sent: {messagesSent}</li>
                    <li>Oasis Created: {oasisCreated}</li>
                    <li>Oasis Deleted: {oasisDeleted}</li>
                </ul>
            </div>
        );
    }
    function Settings() {
        // Theme:
        const [themeState, setThemeState] = useState(theme);
        const handleThemeChange = (event) => {
            setThemeState(event.target.value);
            settings.theme = event.target.value;
            markDirty();
        }
        // Notifications:
            // checkbox, on or off.
        const [notificationsState, setNotificationsState] = useState(notifications);
        const handleNotificationsChange = (event) => {
            const { name, checked } = event.target;
            setNotificationsState(checked);
            settings.notifications = checked;
            markDirty();
        }
        // Oasis Sorting:
        const [oasisSortState, setOasisSortState] = useState(oasisSort);
        const handleOasisSortChange = (event) => {
            setOasisSortState(event.target.value);
            settings.oasisSort = event.target.value;
            markDirty();
        }
        // Privacy:
            // idk.

        // Output:
        return (
            <div>
                <div>
                    <h3>Theme</h3>
                    <select value={themeState} onChange={handleThemeChange}>
                        <option value="default" disabled={false}>default</option>
                        <option value="light" disabled={true}>light</option>
                        <option value="dark" disabled={true}>dark</option>
                    </select>
                    <Tooltip text={"More themes coming soon!"} />
                </div>

                <div>
                    <h3>Oasis Preview Sorting</h3>
                    <label>
                        Recently Edited:
                        <input
                            type="radio"
                            name="oasisSort"
                            value="recent"
                            checked={oasisSortState === 'recent'}
                            onChange={handleOasisSortChange}
                        />
                    </label>
                    <label>
                        Alphabetical:
                        <input
                            type="radio"
                            name="oasisSort"
                            value="alphabetical"
                            checked={oasisSortState === 'alphabetical'}
                            onChange={handleOasisSortChange}
                        />
                    </label>
                </div>

                <div>
                    <h3>Misc: </h3>
                    <label>
                        Notifications:
                        <input

                            type="checkbox"
                            name="notifications"
                            checked={notificationsState}
                            onChange={handleNotificationsChange}
                        />
                    </label>
                </div>
            </div>
        );
    }

    // Tab switcher:
    const [tab, setTab] = useState("profile");

    // Output:
    return (
        <div className="backGround alignCenter">
            {STATE.showBanner() &&
                <div className={STATE.bannerClassName()}>
                    <div className="content">
                        You have unsaved changes:
                        {STATE.showButton() && <button className={STATE.isLoading() ? "lowOpacity" : ""} onClick={saveChanges}> save </button>}
                    </div>
                {STATE.isDirty() && <div className="twoIcon-container">
                    <div className="icon-container">
                        {STATE.isLoading() && (
                        <Loader type="icon" />)}
                        {STATE.isSynced() && (
                        <img className="iconSynced" src="/images/icons/iconConfirm.png" alt="Synced" />)}
                    </div>
                    <div className="icon-container">
                        {error && (
                        <Tooltip text={error} iconComponent={() => { return <img className="iconError" src="/images/icons/iconExclamation.png" alt="Error" /> }} />)}
                    </div>
                </div>}
            </div>}

            <button style={{"textDecoration": (tab === "profile" ? "underline" : "none")}} onClick={() => {setTab("profile")}}>Profile</button>
            <button style={{"textDecoration": (tab === "stats" ? "underline" : "none")}} onClick={() => {setTab("stats")}}>Stats</button>
            <button style={{"textDecoration": (tab === "settings" ? "underline" : "none")}} onClick={() => {setTab("settings")}}>Settings</button>
            {tab === "profile" && <Profile />}
            {tab === "stats" && <Stats />}
            {tab === "settings" && <Settings />}
        </div>
    );
}

export default Tab_settings_user;
