import '../CSS/Test.css';
import React, { useState } from 'react';
import Authenticator from '../components/AuthenticationUI/authenticator';
import { UserManager } from '../utilities/userManager';

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
    // Promise tests:
    let promiseTest = new Promise((resolve, reject) => {
        console.log("starting promise");
        setTimeout(() => {
            console.log("promise resolved");
            resolve('hi');
        }, 2000);
    });;
    const startPromise = () => {
        promiseTest = new Promise((resolve, reject) => {
            console.log("starting promise");
            setTimeout(() => {
                console.log("promise resolved");
                resolve('hi');
            }, 2000);
        });
    }
    const checkPromise = async () => {
        if (promiseTest) {
            promiseTest.then((value) => {
                console.log(value);
            });
        }
    }
    const checkPromise2 = async () => {
        const response = await promiseTest;
        console.log(response);
    }
    return (
        <div className="backGround alignCenter">
            <button onClick={startPromise}>start Promise</button>
            <button onClick={checkPromise2}>check Promise</button>
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