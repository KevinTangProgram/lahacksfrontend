import '../CSS/Test.css';
import React, { useState } from 'react';

//
function Tab_settings_user() {
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

export default Tab_settings_user;