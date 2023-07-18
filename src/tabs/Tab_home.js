import '../CSS/Home.css';
import Authenticator from '../components/AuthenticationUI/authenticator';
import ObserverComponent from '../components/observer';
import { useNavigate } from 'react-router-dom';
import { UserManager } from '../utilities/userManager';
import { useState, useEffect } from 'react';
import { OasisManager } from '../utilities/oasisManager';
import Tooltip from '../components/tooltip';
import { getHumanizedDate } from '../utilities/utilities';


function Tab_home({ focusOasis }) {
    const Output = () => {
        // Setup:
        const [showLogin, setShowLogin] = useState(false);
        const navigate = useNavigate();
        const UserComponent = () => {
            if (!UserManager.user._id) {
                // Guest user:
                return (
                    <div>
                        <h2>Welcome, Guest User</h2>
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
                        <h2>Welcome, {UserManager.user.info.username.split(" ")[0]}</h2>
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
                                <div className="oasisPreview" key={oasis._id} onClick={() => {
                                    navigate('/oasis/' + oasis._id);
                                    focusOasis();
                                }}>
                                    <div className="content">
                                        <div className="title">{oasis.info.title}</div>
                                        <div className="desc">
                                            {oasis.settings.sharing} oasis
                                            <br></br>
                                            {oasis.stats.size.ideaCount} ideas
                                            <br></br>
                                            last edit: {getHumanizedDate((oasis.stats.state.lastEditDate))}
                                        </div>
                                    </div>
                                    <Tooltip text={oasis.info.description} />
                                </div>
                            ))
                        ) : (
                            <p>No oases found.</p>
                        )}
                    </div>
                );
            }
            return (
                <div className="loader"></div>
            );
        };
        // Output:
        return (
            <div className="backGround alignCenter">
                <UserComponent />
                <p>Your Oases:</p>
                <button className="debugger-popup-button" onClick={() => {
                    OasisManager.createOasis("Test Oasis", "This is a test oasis.")
                        .then((response) => {
                            navigate('/oasis/' + response);
                            focusOasis();
                        })
                        .catch(error => {
                            console.log(error);
                        })
                }}> + </button>
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