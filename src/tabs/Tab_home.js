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
import CreateOasisUI from '../components/createOasisUI';
import Loader from '../components/loader';

function Tab_home({ focusOasis }) {
    const Output = () => {
        // Setup:
        const [showLogin, setShowLogin] = useState(false);
        const [showCreateOasis, setShowCreateOasis] = useState(false);
        const navigate = useNavigate();
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
            }, []);
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
            // Output:
            if (error) {
                return (
                    <div className="oasisError">{error}</div>
                );
            }
            if (oasisList) { // loaded:
                return (
                    <div>
                        {/* No Oases Found:  */}
                        {oasisList.length === 0 && oasisSecondaryList.length === 0 && <p styles={{ marginTop: 0, marginBottom: 0, padding: 0 }}>No oases found - create a new one or log in.</p>}
                        {/* Main Oases:  */}
                        <div>
                        {oasisList.length > 0 && (
                            oasisList.map((oasis) => (
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
                                    <div style={{"display":"flex", "margin-left":"45%"}}>
                                        <Tooltip text={oasis.info.description} />
                                        {/* <div style={{"position":"relative", "left":"45%", "top":"0%"}}>h</div> */}
                                        <button className="alignRight">=</button>
                                    </div>

                                </NavLink>
                            ))
                        )}
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
            return (
                <Loader type="content" />
            );
        };
        function goToNewOasis(ID) {
            setShowCreateOasis(false);
            navigate('/oasis/' + ID);
            focusOasis();
        }
        // Output:
        return (
            <div className="backGround alignCenter">
                {/* Welcome, User! */}
                <UserComponent />
                <p>Your Oases:</p>
                {/* Button to open UI: */}
                <button className="oasisCreate" onClick={() => { setShowCreateOasis(true); }}> + </button>
                {/* Oasis Creation UI: */}
                {showCreateOasis && <CreateOasisUI closeFunc={() => { setShowCreateOasis(false) }} navFunc={goToNewOasis}/>}
                {/* View all oases: */}
                <OasisViewComponent />
            </div>
        );
    }
    // Output
    return (
        <ObserverComponent dependencies={"user"} Component={Output} />
    );
}

export default Tab_home;