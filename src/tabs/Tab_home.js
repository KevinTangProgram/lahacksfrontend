import '../CSS/Test.css';
import Authenticator from '../components/AuthenticationUI/authenticator';
import ObserverComponent from '../components/observer';
import { useNavigate } from 'react-router-dom';
import { UserManager } from '../utilities/userManager';
import { useState } from 'react';

function Tab_home({ focusOasis }) {
    const [showLogin, setShowLogin] = useState(false);
    const navigate = useNavigate();
    const userComponent = () => {
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
    //
    return (
        <div className="backGround alignCenter">
            <ObserverComponent dependencies={"user"} Component={userComponent} />
            <p>Your Oases:</p>
            <button className="debugger-popup-button" onClick={() => {
                navigate('/oasis/1');
                focusOasis();
            }}> + </button>
            <button className="debugger-popup-button" onClick={() => {
                navigate('/oasis/2');
                focusOasis();
            }}> Unamed Oasis </button>
            <div className="loader"></div>
        </div>
    );
}

export default Tab_home;