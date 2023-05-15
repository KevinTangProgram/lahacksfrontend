import React, { useState, useEffect } from 'react';
//

function LoginAccountUI() {
    // Textboxes:
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleChangeUsername = (event) => { setUsername(event.target.value); }
    const handleChangePassword = (event) => { setPassword(event.target.value); }
    // Output:
    return (
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
    );
}

export default LoginAccountUI;