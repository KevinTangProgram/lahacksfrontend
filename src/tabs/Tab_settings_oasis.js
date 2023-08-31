import '../CSS/Test.css';
import React, { useState, useContext } from 'react';
import { Context } from '../utilities/context';
import Tooltip from '../components/tooltip';
import { getHumanizedDate } from '../utilities/utilities';
//
function Tab_settings_oasis() {
    // Oasis Data:
    const oasisInstance = useContext(Context).oasisInstance;
    if (!oasisInstance) {
        return (<p className="oasisError">Unable to access oasis settings</p>);
    }
    // Settings, Size, State:
    const settings = oasisInstance.getData("settings");
    const { size, state } = oasisInstance.getData("stats");
    // UI Components:
        // Sharing:
    const [sharing, setSharing] = useState(settings.sharing);
    const handleSharingChange = (event) => {
        setSharing(event.target.value);
        oasisInstance.setData("settings").sharing = event.target.value;
    }
        // Stats:
    const currentState = state.currentState;
    const createDate = state.createDate;
    const archiveDate = state.archiveDate ? state.archiveDate : "N/A";
    const numIdeas = size.ideaCount;
    const numNotes = size.noteCount;
        // Notifications:
    const [notifications, setNotifications] = useState({
        email: settings.misc[0] ? settings.misc[0] : false,
        text: settings.misc[0] ? settings.misc[1] : false
    });
    const handleNotificationChange = (event) => {
        const { name, checked } = event.target;
        const newState = { ...notifications, [name]: checked };
        setNotifications(newState);
        oasisInstance.setData("settings").misc[0] = newState;
    };

    // Output:
    return (
        <div className="backGround alignCenter">
            <div>
                <h3>Sharing</h3>
                <select value={sharing} onChange={handleSharingChange}>
                    <option value="local" disabled={!(sharing === "local")}>local</option>
                    <option value="private" disabled={(sharing === "local")}>private</option>
                    <option value="public" disabled={(sharing === "local")}>public</option>
                </select>
                <Tooltip text={
                    (sharing === "local") ? "Stored on your device - log in to change. " : 
                    (sharing === "private") ? "Accessible from your account only. " : 
                    (sharing === "public") ? "Accessible from any account. Note: currently does not support multiple concurrent users and may experience bugs. " : ""}/>
            </div>

            <div>
                <h3>Stats</h3>
                <div className='oasisPreview'>
                    <div className="content desc">
                        <br></br>
                        - Current State: {currentState} <br></br>
                        - Created: {getHumanizedDate(createDate)} <br></br>
                        - Archived: {archiveDate} <br></br>
                        - Ideas: {numIdeas} <br></br>
                        - Notes: {numNotes} <br></br>
                    </div>
                </div>
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
                    Text:
                    <input
                        type="checkbox"
                        name="text"
                        checked={notifications.text}
                        onChange={handleNotificationChange}
                    />
                </label>
                <Tooltip text={"Send notifications? Note: coming in the near future. "} />
            </div>
        </div>
    );
}

export default Tab_settings_oasis;