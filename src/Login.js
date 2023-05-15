import './CSS/Login.css';
//
import React, { useState } from 'react';
import axios from 'axios';
import crypto from 'crypto-js';
import CreateAccountUI from './components/createAccountUI';
import LoginAccountUI from './components/loginAccountUI';
//

function Login()
{
    // Create Acc:
    const [showCreateAcc, setShowCreateAcc] = useState(true);

    return (<>
        <button id="backButton" className="notWhite" onClick={() => {
            window.location.href = "/";
        }}>&#10094;Back</button>
        <br></br>
        <h1>Welcome to Idea Oasis</h1>
        {/* LOGIN */}
        {!showCreateAcc && <LoginAccountUI />}
        {/* CREATE ACC */}
        {showCreateAcc && <CreateAccountUI />}
    </>
    )
}

export default Login;
