import '../CSS/Test.css';
import React, { useState } from 'react';
import Authenticator from '../components/AuthenticationUI/authenticator';
import { UserManager } from '../utilities/userManager';
import Tooltip from '../components/tooltip';

//
function Tab_settings_user() {
    // User Data:
    const [showLogin, setShowLogin] = useState(false);
    if (!UserManager.user._id) {
        return (<div className="alignCenter">
            <br></br>
            <button onClick={() => {
                setShowLogin(true);
            }}>login</button>
            {showLogin && <Authenticator closeFunc={() => { setShowLogin(false) }} />}
        </div>);
    }
    // User Settings:
    const settings = UserManager.getSettings();
    const { theme, notifications, oasisSort, privacy, misc } = settings;
    const syncSettings = () => {
        UserManager.syncSettings()
        .then(() => {
            console.log("Settings synced");
        })
        .catch((error) => {
            console.log(error);
        });
    }
    // Theme:
    const [themeState, setThemeState] = useState(theme);
    const handleThemeChange = (event) => {
        setThemeState(event.target.value);
        settings.theme = event.target.value;
    }
    // Notifications:

    // Oasis Sorting:
    const [oasisSortState, setOasisSortState] = useState(oasisSort);
    const handleOasisSortChange = (event) => {
        setOasisSortState(event.target.value);
        settings.oasisSort = event.target.value;
    }

    return (
        <div className="backGround alignCenter">
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
            <button onClick={syncSettings}>sync now</button>
        </div>
    );
}

export default Tab_settings_user;

function Tab_settings_user2() {
    // Options:
    // Theme:
    const [theme, setTheme] = useState('default');
    const handleThemeChange = (event) => {
        setTheme(event.target.value);
    };
    // Notifications:
    const [notifications, setNotifications] = useState({
        email: false,
        push: true,
        sms: false
    });
    const handleNotificationChange = (event) => {
        const { name, checked } = event.target;
        setNotifications(prevState => ({
            ...prevState,
            [name]: checked
        }));
    };
    // Bubble Sorting:
    const [bubbleSort, setBubbleSort] = useState('latest');
    const handleBubbleSortChange = (event) => {
        setBubbleSort(event.target.value);
    };

    return (
        <div className="backGround alignCenter">
            <div>
                <h3>Theme</h3>
                <select value={theme} onChange={handleThemeChange}>
                    <option value="default">Default</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </div>

            <div>
                <h3>Notifications</h3>
                <label>
                    Email:
                    <input
                        type="checkbox"
                        name="email"
                        checked={notifications.email}
                        onChange={handleNotificationChange}
                    />
                </label>
                <label>
                    Push Notifications:
                    <input
                        type="checkbox"
                        name="push"
                        checked={notifications.push}
                        onChange={handleNotificationChange}
                    />
                </label>
                <label>
                    SMS:
                    <input
                        type="checkbox"
                        name="sms"
                        checked={notifications.sms}
                        onChange={handleNotificationChange}
                    />
                </label>
            </div>

            <div>
                <h3>Bubble Sorting</h3>
                <label>
                    Latest:
                    <input
                        type="radio"
                        name="bubbleSort"
                        value="latest"
                        checked={bubbleSort === 'latest'}
                        onChange={handleBubbleSortChange}
                    />
                </label>
                <label>
                    Popular:
                    <input
                        type="radio"
                        name="bubbleSort"
                        value="popular"
                        checked={bubbleSort === 'popular'}
                        onChange={handleBubbleSortChange}
                    />
                </label>
            </div>
        </div>
    );
}