import '../CSS/Home.css';
import Authenticator from '../components/AuthenticationUI/authenticator';
import ObserverComponent from '../components/observer';
import { useNavigate } from 'react-router-dom';
import { UserManager } from '../utilities/userManager';
import { useState, useEffect } from 'react';

import { OasisManager } from '../utilities/oasisManager';
import ManageOasisUI from '../components/OasisUI/manageOasisUI';
import Loader from '../components/loader';
import SingleOasisPreview from '../components/OasisUI/singleOasisPreview';

function Tab_home({ focusOasis }) {
    const Output = () => {
        // Setup:
        const navigate = useNavigate();
        // User Auth:
        const [showLogin, setShowLogin] = useState(false);
        const UserComponent = () => {
            if (!UserManager.user._id) {
                // Guest user:
                return (
                    <div>
                        <h2 style={{"margin-top": "0", "padding-top": "1em"}}>Welcome, Guest User</h2>
                        <button onClick={() => {
                            setShowLogin(true);
                        }}>login</button>
                        {showLogin && <Authenticator closeFunc={() => { setShowLogin(false) }} />}
                    </div>
                );
            }
            else {
                // Logged in user:
                return (
                    <div>
                        <h2 style={{ "margin-top": "0", "padding-top": "1em" }}>Welcome, {UserManager.user.info.username.split(" ")[0]}</h2>
                        <button onClick={() => {
                            UserManager.logout();
                            navigate("/home");
                        }}>logout</button>
                    </div>
                );
            }
        };
        // Oasis Preview and UIs:
        const OasisViewComponent = () => {
            // Oasis Previews:
            const [oasisList, setOasisList] = useState(null);
            const [oasisSecondaryList, setOasisSecondaryList] = useState(null);
            const [showSecondaryOases, setShowSecondaryOases] = useState(false);
            const [error, setError] = useState(null);
            const [syncLocalLoading, setSyncLocalLoading] = useState(false);
            const [syncLocalError, setSyncLocalError] = useState(null);
            const getOases = async () => {
                OasisManager.getHomeView("all", "recent")
                    .then((response) => {
                        setOasisList(response.mainOases);
                        setOasisSecondaryList(response.syncableOases);
                        setError(null);
                    })
                    .catch(error => {
                        setError(error);
                        setOasisList(null);
                        setOasisSecondaryList(null);
                    })
            }
            useEffect(() => {
                getOases();
            }, []);
            const syncLocalOases = () => {
                setSyncLocalLoading(true);
                OasisManager.syncLocalOases()
                    .then(() => {
                        setSyncLocalError(null);
                        setSyncLocalLoading(false);
                        navigate("/home");
                    })
                    .catch(error => {
                        setSyncLocalError(error);
                        setSyncLocalLoading(false);
                    })
            }
            // Context Menu:
                // We specify which singleOasisPreview should show their menu using setOpenMenuId.
                // Each singleOasisPreview can call setOpenMenuId to change the currently open menu.
            const [openMenuId, setOpenMenuId] = useState(null);
            const [coords, setCoords] = useState({x: 0, y: 0});
            const openContextMenu = (oasisID, posX, posY) => {
                setOpenMenuId(oasisID);
                if (posX && posY) {
                    setCoords({x: posX, y: posY});
                }
            }
            useEffect(() => {
                const handleClick = () => {
                    openContextMenu(null);
                };
                window.addEventListener('click', handleClick);
                return () => {
                    window.removeEventListener('click', handleClick);
                };
            }, []);
            // Oasis UI:
                // The UI takes in the oasis and menu to display:
            const [activeOasis, setActiveOasis] = useState(null);
            const [activeMenu, setActiveMenu] = useState(null);
            const openOasisUI = (oasis, menu) => {
                        setActiveOasis(oasis);
                        setActiveMenu(menu);
                    }
            // Component:
            const OasisUIComponent = () => {
                // Setup:
                function goToNewOasis(ID) {
                    navigate('/oasis/' + ID);
                    focusOasis();
                }
                // Output:
                return (
                    <div>
                        {/* Oasis Creation UI: */}
                        {activeMenu === "create" && <ManageOasisUI type="create" onSuccess={goToNewOasis} closeFunc={() => { setActiveMenu(null) }} />}
                        {/* Oasis Edit UI: */}
                        {activeMenu === "edit" && <ManageOasisUI type="edit" oasis={activeOasis} onSuccess={getOases} closeFunc={() => { setActiveMenu(null) }} />}
                        {/* Oasis Delete UI: */}
                        {activeMenu === "delete" && <ManageOasisUI type="delete" oasis={activeOasis} onSuccess={getOases} closeFunc={() => { setActiveMenu(null) }} />}
                    </div>
                );
            }

            // Output:
            if (!oasisList) {
                // Handle loading and errors:
                if (error) {
                    return (
                        <div className="oasisError">{error}</div>
                    );
                } else {
                    return (
                        <Loader type="content" />
                    );
                }
            }
            return (
                <div>
                    {/* Create Oasis Button: */}
                    <button className="oasisCreate" onClick={() => { openOasisUI(null, "create"); }}> + </button>
                    {/* No Oases Found:  */}
                    {oasisList.length === 0 && oasisSecondaryList.length === 0 && <p styles={{ marginTop: 0, marginBottom: 0, padding: 0 }}>No oases found - create a new one or log in.</p>}
                    {/* Main Oases:  */}
                    <div>
                        {oasisList.length > 0 && (oasisList.map((oasis) => {
                            const props = {
                                oasis,
                                focusOasis,
                                openOasisUI,
                                contextMenuInfo: {setMenu: openContextMenu, showMenu: openMenuId === oasis._id, coords: coords}
                            };
                            return <SingleOasisPreview {...props}/>
                        }))}                            
                    </div>
                    {/* Secondary Oases:  */}
                    {oasisSecondaryList.length > 0 && (<>
                        {!showSecondaryOases &&
                            <div>
                                {/* Expand: */}
                                <button className="oasisCreate" onClick={() => { setShowSecondaryOases(true); }}> (+) </button>
                            </div>}
                        {showSecondaryOases &&
                            <div>
                                {/* Buttons: */}
                                <div>
                                    {/* Collapse: */}
                                    <button className="oasisCreate" onClick={() => { setShowSecondaryOases(false); }}> (-) </button>
                                    <br></br>
                                    {/* Sync: */}
                                    <button className={syncLocalLoading ? "lowOpacity" : ""} onClick={() => { if (!syncLocalLoading) syncLocalOases() }}>
                                        Sync local oases
                                    </button>
                                    {syncLocalLoading && <Loader type="icon" />}
                                    {syncLocalError && (
                                        <div>
                                            {syncLocalError.split('\n').map((line, index) => (
                                                <p key={index} className="oasisError">{line}</p>
                                            ))}
                                            <button onClick={() => { navigate("/home"); }}>Refresh</button>
                                        </div>)}
                                </div>
                                {/* Oases: */}
                                <div>
                                    {(oasisSecondaryList.map((oasis) => {
                                        const props = {
                                            oasis,
                                            focusOasis,
                                            openOasisUI,
                                            contextMenuInfo: { setMenu: openContextMenu, showMenu: openMenuId === oasis._id, coords: coords }
                                        };
                                        return <SingleOasisPreview {...props} />
                                    }))}
                                </div>

                            </div>}

                    </>)}
                    <OasisUIComponent />
                </div>
            );
        };

        // Output:
        return (
            <div className="backGround alignCenter">
                {/* Welcome, User! */}
                <UserComponent />
                <p>Your Oases:</p>
                {/* View all oases: */}
                <OasisViewComponent/>
            </div>
        );
    }
    // Output
    return (
        <ObserverComponent dependencies={"user"} Component={Output} />
    );
}

export default Tab_home;