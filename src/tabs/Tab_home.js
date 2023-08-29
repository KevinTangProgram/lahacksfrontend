import '../CSS/Home.css';
import Authenticator from '../components/AuthenticationUI/authenticator';
import ObserverComponent from '../components/observer';
import { useNavigate } from 'react-router-dom';
import { UserManager } from '../utilities/userManager';
import { useState, useEffect, useContext } from 'react';

import { OasisManager } from '../utilities/oasisManager';
import Tooltip from '../components/tooltip';
import { getHumanizedDate } from '../utilities/utilities';
import { NavLink } from 'react-router-dom';
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
        // Oasis UI's:
            // Create Oasis:
        const [showCreateOasis, setShowCreateOasis] = useState(false);
        function goToNewOasis(ID) {
            navigate('/oasis/' + ID);
            focusOasis();
        }
            // Edit/Delete Oasis:
        const [update, setUpdate] = useState(0);
        const rerender = () => {
            setUpdate(update + 1);
            console.log(update);
        }
        const [activeOasis, setActiveOasis] = useState(null);
        const [showEditOasis, setShowEditOasis] = useState(false);
        const [showDeleteOasis, setShowDeleteOasis] = useState(false);
        function openOasisEditUI(oasis) {
            setActiveOasis(oasis);
            setShowEditOasis(true);
        }
        function openOasisDeleteUI(oasis) {
            setActiveOasis(oasis);
            setShowDeleteOasis(true);
        }
        // Oasis Previews:
        const OasisViewComponent = () => {
            // Setup:
            const [oasisList, setOasisList] = useState(null);
            const [oasisSecondaryList, setOasisSecondaryList] = useState(null);
            const [showSecondaryOases, setShowSecondaryOases] = useState(false);
            const [error, setError] = useState(null);
            const [syncLocalLoading, setSyncLocalLoading] = useState(false);
            const [syncLocalError, setSyncLocalError] = useState(null);
            useEffect(() => {
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
            }, [update]);
            const syncLocalOases = () => {
                setSyncLocalLoading(true);
                OasisManager.syncLocalOases()
                    .then(() => {
                        setSyncLocalError(null);
                        setSyncLocalLoading(false);
                        // useContext(Context).oasisInstance = null;
                        navigate("/home");
                    })
                    .catch(error => {
                        setSyncLocalError(error);
                        setSyncLocalLoading(false);
                    })
            }
            // Context Menu Logic:
            // We specify which singleOasisPreview should show their menu using setOpenMenuId.
            // Each singleOasisPreview can call setOpenMenuId to change the currently open menu.
            const [openMenuId, setOpenMenuId] = useState(null);
            useEffect(() => {
                const handleClick = () => {
                    setOpenMenuId(null);
                };
                window.addEventListener('click', handleClick);
                return () => {
                    window.removeEventListener('click', handleClick);
                };
            }, []);

            // Output:
                // Error:
            if (error) {
                return (
                    <div className="oasisError">{error}</div>
                );
            }
                // Normal:
            if (oasisList) { // loaded:
                return (
                    <div>
                        {/* No Oases Found:  */}
                        {oasisList.length === 0 && oasisSecondaryList.length === 0 && <p styles={{ marginTop: 0, marginBottom: 0, padding: 0 }}>No oases found - create a new one or log in.</p>}
                        {/* Main Oases:  */}
                        <div>
                            {oasisList.length > 0 && (oasisList.map((oasis) => {
                                const props = {
                                    oasis,
                                    setOpenMenuId,
                                    showMenu: openMenuId === oasis._id,
                                    focusOasis,
                                    openOasisEditUI,
                                    openOasisDeleteUI,
                                };
                                return <SingleOasisPreview {...props}/>
                            }))}                            
                        </div>
                        {/* Secondary oases:  */}
                        {oasisSecondaryList.length > 0 && (<>
                            {!showSecondaryOases &&
                                <div>
                                    <button className="oasisCreate" onClick={() => { setShowSecondaryOases(true); }}> (+) </button>
                                </div>}
                            {showSecondaryOases &&
                                <div>
                                    <div>
                                        <button className="oasisCreate" onClick={() => { setShowSecondaryOases(false); }}> (-) </button>
                                        <br></br>
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
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        {(
                                            oasisSecondaryList.map((oasis) => (
                                                <NavLink to={"/oasis/" + oasis._id} className="oasisPreview" activeClassName="oasisPreview active" key={oasis._id} onClick={() => {
                                                    focusOasis();
                                                }}>
                                                    <div className="content">
                                                        <div className="title">{oasis.info.title}</div>
                                                        <div className="desc">
                                                            - {oasis.settings.sharing} oasis
                                                            <br></br>
                                                            - {oasis.stats.size.ideaCount} ideas
                                                            <br></br>
                                                            - edited {getHumanizedDate(oasis.stats.state.lastEditDate)}
                                                        </div>
                                                    </div>
                                                    <Tooltip text={oasis.info.description} />
                                                </NavLink>
                                            ))
                                        )}
                                    </div>

                                </div>}

                        </>)}
                    </div>
                );
            }
                // Loader:
            return (
                <Loader type="content" />
            );
        };
        // Output:
        return (
            <div className="backGround alignCenter">
                {/* Welcome, User! */}
                <UserComponent />
                <p>Your Oases:</p>
                {/* Button to open UI: */}
                <button className="oasisCreate" onClick={() => { setShowCreateOasis(true); }}> + </button>
                {/* Oasis Creation UI: */}
                {showCreateOasis && <ManageOasisUI type="create" onSuccess={goToNewOasis} closeFunc={() => { setShowCreateOasis(false); }} />}
                {/* Oasis Edit UI: */}
                {showEditOasis && <ManageOasisUI type="edit" oasis={activeOasis} onSuccess={rerender} closeFunc={() => { setShowEditOasis(false) }} />}
                {/* Oasis Delete UI: */}
                {showDeleteOasis && <ManageOasisUI type="delete" oasis={activeOasis} onSuccess={rerender} closeFunc={() => { setShowDeleteOasis(false) }} />}
                {/* View all oases: */}
                <OasisViewComponent key={update}/>
            </div>
        );
    }
    // Output
    return (
        <ObserverComponent dependencies={"user"} Component={Output} />
    );
}

export default Tab_home;