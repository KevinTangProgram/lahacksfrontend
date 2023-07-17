import '../CSS/Test.css';
import Authenticator from '../components/AuthenticationUI/authenticator';
import ObserverComponent from '../components/observer';
import { useNavigate } from 'react-router-dom';
import { UserManager } from '../utilities/userManager';
import { useState, useEffect } from 'react';
import { OasisManager } from '../utilities/oasisManager';
import Tooltip from '../components/tooltip';


function Tab_home({ focusOasis }) {
    const [showLogin, setShowLogin] = useState(false);
    const navigate = useNavigate();
    const UserComponent = () => {
        if (!UserManager.user.ID) {
            // Guest user:
            return (
                <div>
                    <h2>Welcome, Guest User</h2>
                    <button onClick={() => {
                        setShowLogin(true);
                    }}>login</button>
                    {showLogin && <Authenticator closeFunc={() => {setShowLogin(false)}}/>}
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
                            <div className="debugger-popup-button" key={oasis.ID} onClick={() => {
                                navigate('/oasis/' + oasis.ID);
                                focusOasis();
                                }}>
                                {oasis.info.title} 
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
    // Output
    return (
        <div className="backGround alignCenter">
            <ObserverComponent dependencies={"user"} Component={UserComponent} />
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

export default Tab_home;