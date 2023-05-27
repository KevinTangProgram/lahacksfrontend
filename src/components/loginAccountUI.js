import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {CONST} from '../utilities/CONST.js';
//

function LoginAccountUI(props) {
    // Textboxes:
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleChangeUsername = (event) => { setUsername(event.target.value); }
    const handleChangePassword = (event) => { setPassword(event.target.value); }
    // Login:
    function loginAccount() {
        axios.get(CONST.URL + "/login", {
            params: {
                user: username,
                password: password,
            }
        })
        .then((response) => {
            if (response.data !== "")
            {
                alert(response.data)
            }
            else
            {
                alert("Incorrect username or password.");
            }
        })
    }



    // Output:
    return (
        <>
            <h1 style={{"text-align": "center"}}>Login</h1>
            <div className="selectGridSmall">
                <input placeholder="Username" value={username} onChange={handleChangeUsername}></input>
                <br></br>
                <input placeholder="Password" type="password" value={password} onChange={handleChangePassword} ></input>
                <br></br>
                <button className="selectCells" id="submitAndConfirmLong" style={{"border-radius": "1em", "height": "2em", "width": "80%"}} onClick={() => {
                    loginAccount();
                }}>Login</button>
                <br></br>
                <p1>or</p1>
                <br></br>
                <button className="selectCells" id="submitAndConfirmLong" style={{"border-radius": "1em", "height": "2em", "width": "80%"}} onClick={() => {
                    props.setShowCreateAcc(true);
                }}>Create Account</button>
            </div>
        </>
        
    );
}

export default LoginAccountUI;