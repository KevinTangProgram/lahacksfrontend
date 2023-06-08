import '../CSS/Test.css';
import Authenticator from '../components/AuthenticationUI/authenticator';
import { useNavigate } from 'react-router-dom';

function Tab_home({ focusOasis }) {
    const navigate = useNavigate();

    return (
        <div className="backGround alignCenter">
            <h2>Welcome, Guest User</h2>
            <Authenticator />
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