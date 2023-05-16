import './CSS/Login.css';
//
import React, { useState } from 'react';
import CreateAccountUI from './components/createAccountUI';
import LoginAccountUI from './components/loginAccountUI';
//

function Login()
{
    // Create Acc:
    const [showCreateAcc, setShowCreateAcc] = useState(false);

    return (<>
        <button id="backButton" className="notWhite" onClick={() => {
            window.location.href = "/";
        }}>&#10094;Back</button>
        <br></br>
        {/* LOGIN */}
        {!showCreateAcc && <LoginAccountUI />}
        {/* CREATE ACC */}
        {showCreateAcc && <CreateAccountUI />}
    </>
    )
}

export default Login;
