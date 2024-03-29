import '../CSS/Home.css';
import Authenticator from '../components/AuthenticationUI/authenticator';
import ObserverComponent from '../components/observer';
import { useNavigate } from 'react-router-dom';
import { UserManager } from '../utilities/userManager';
import { useState, useEffect, useContext } from 'react';
import OasisContext from '../Pages/Oasis';

import { OasisManager } from '../utilities/oasisManager';
import Tooltip from '../components/tooltip';
import { getHumanizedDate } from '../utilities/utilities';
import { NavLink } from 'react-router-dom';
import CreateOasisUI from '../components/createOasisUI';



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
                        }}>logout</button>
                    </div>
                );
            }
        };
        const OasisViewComponent = () => {
            // Setup:
            const [oasisList, setOasisList] = useState(null);
            const [error, setError] = useState(null);
            useEffect(() => {
                OasisManager.getHomeView("all", "recent")
                    .then((response) => {
                        setOasisList(response);
                    })
                    .catch(error => {
                        console.log(error);
                        setError(error);
                    })
            }, []);
            // Output:
            if (error) {
                return (
                    <div>{error}</div>
                );
            }
            if (oasisList) {
                return (
                    <div>
                        {oasisList.length > 0 ? (
                            oasisList.map((oasis) => (
                                <NavLink to={"/oasis/" + oasis._id} className="oasisPreview" activeClassName="oasisPreview active" key={oasis._id} onClick={() => {
                                    // Normal click:
                                    // navigate('/oasis/' + oasis._id);
                                    focusOasis();
                                    // console.log("hey");
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
                        ) : (
                            <p styles={{marginTop: 0, marginBottom: 0, padding: 0}}>No oases found.</p>
                        )}
                    </div>
                );
            }
            return (
                <div className="loader"></div>
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