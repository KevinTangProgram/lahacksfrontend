import '../CSS/Test.css';
import React, { useState, useContext } from 'react';
import { OasisManager } from '../utilities/oasisManager';
import OasisContext from '../Pages/Oasis';

//
function Tab_settings_oasis() {
    const [theme, setTheme] = useState('default');
    const [notifications, setNotifications] = useState({
        email: false,
        push: true,
        sms: false
    });
    const [bubbleSort, setBubbleSort] = useState('latest');

    const handleThemeChange = (event) => {
        setTheme(event.target.value);
    };

    const handleNotificationChange = (event) => {
        const { name, checked } = event.target;
        setNotifications(prevState => ({
            ...prevState,
            [name]: checked
        }));
    };

    const handleBubbleSortChange = (event) => {
        setBubbleSort(event.target.value);
    };

    // Test:
    const oasis = useContext(OasisContext);
    // oasis.data.settings.sharing
    const [sharing, setSharing] = useState(oasis.data.settings.sharing);
    const handleSharingChange = (event) => {
        setSharing(event.target.value);
    }

    return (
        <div className="backGround alignCenter">
            <h2>OASIS</h2>

            <div>
                <h3>Sharing</h3>
                <input
                    type="text"
                    name="Sharing"
                    onChange={handleSharingChange}
                    value={sharing}
                />
                <button onClick={() => {
                    // const oasis = OasisManager.createOasisInstance("64b8c85ec43ee3c7eef0bf93")
                    // .then((oasis) => {
                    //     oasis.foo({generationOptions: {}, sharing: sharing, misc: []});
                    // })
                    // .catch((error) => {
                    //     console.log(error);
                    // });
                }}>update</button>
            </div>

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

export default Tab_settings_oasis;