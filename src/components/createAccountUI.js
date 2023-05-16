import React, { useState, useEffect } from 'react';
import axios from 'axios';
import crypto from 'crypto-js';
import {CONST} from '../utilities/CONST.js';
//

function CreateAccountUI(props) {

    // vars/functions:
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const handleChangeUsername = (event) => { setUsername(event.target.value); }
    const handleChangePassword = (event) => { setPassword(event.target.value); }
    const handleChangeEmail = (event) => { setEmail(event.target.value); }
    // Create account:
    function createAccount() {
        axios.post(CONST.URL + "/new/account", {
            user: username,
            password: password,
            email: email
        })
    }

    // return:
    return (
        <>
            <h1 style={{"text-align": "center"}}>Create Account</h1>
            <div className="selectGridSmall">
                <input placeholder="Username" value={username} onChange={handleChangeUsername}></input>
                <br></br>
                <input placeholder="Password" type="password" value={password} onChange={handleChangePassword} ></input>
                <br></br>
                <input placeholder="(Optional) Email" value={email} onChange={handleChangeEmail} ></input>
                <br></br>
                <button className="selectCells" id = "submitAndConfirmLong" style={{"border-radius": "1em", "height": "2em", "width": "80%"}} onClick={() => {
                    createAccount();
                    props.setShowCreateAcc(false);
                }}>Create Account</button>
            </div>
        </>
    );
}

export default CreateAccountUI;