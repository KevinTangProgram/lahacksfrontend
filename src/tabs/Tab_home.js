import '../CSS/Test.css';
import LoginAccountUI from '../components/loginAccountUI';
import CreateAccountUI from '../components/createAccountUI';
//
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';



function Tab_home({ focusOasis }) {
    const navigate = useNavigate();
    const [loginState, setLoginState] = useState(0);

    return (
        <div className="backGround alignCenter">
            <h2>Welcome, Guest User</h2>
            <button onClick={() => {
                setLoginState(1);
            }}>login</button>
            {loginState === 1 && <LoginAccountUI setLoginState={setLoginState} />}
            {loginState === 2 && <CreateAccountUI setLoginState={setLoginState} />}
            <p>Your Oases:</p>
            <button className="debugger-popup-button" onClick={() => {
                navigate('/oasis/1');
                focusOasis();
            }}> + </button>
            <button className="debugger-popup-button" onClick={() => {
                navigate('/oasis/2');
                focusOasis();
            }}> Unamed Oasis </button>
            <div class="loader"></div>
        </div>
    );
}

export default Tab_home;