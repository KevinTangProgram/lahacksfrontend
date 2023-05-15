import './CSS/Login.css';
//
import React, { useState } from 'react';
import axios from 'axios';
import crypto from 'crypto-js';
import CreateAccountUI from './components/createAccountUI';
//
function Login()
{
    // Textboxes:
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleChangeUsername = (event) => { setUsername(event.target.value); }
    const handleChangePassword = (event) => { setPassword(event.target.value); }
    // Create Acc:
    const [showCreateAcc, setShowCreateAcc] = useState(false);

    return (<>
        <button id="backButton" className="notWhite" onClick={() => {

        }}>&#10094;Back</button>
        <h1>Welcome to Idea Oasis</h1>
        {/* LOGIN */}
        <div className="selectGridSmall">
            <input placeholder="Username" value={username} onChange={handleChangeUsername}></input>
            <input placeholder="Password" type="password" value={password} onChange={handleChangePassword} ></input>

            <button className="selectCells" id="submitAndConfirmLong" onClick={() => {

            }}>Login</button>
            <br></br>
            <p1>or</p1>
            <br></br>
            <button className="selectCells" id="submitAndConfirmLong" onClick={() => {

            }}>Create Account</button>
        </div>
        {/* CREATE ACC */}
        {showCreateAcc && <CreateAccountUI />}
    </>
    )
}

export default Login;
