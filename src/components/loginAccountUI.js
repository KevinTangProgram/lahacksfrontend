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
        <>
            <h1 style={{"text-align": "center"}}>Login</h1>
            <div className="selectGridSmall">
                <input placeholder="Username" value={username} onChange={handleChangeUsername}></input>
                <br></br>
                <input placeholder="Password" type="password" value={password} onChange={handleChangePassword} ></input>
                <br></br>
                <button className="selectCells" id="submitAndConfirmLong" style={{"border-radius": "1em", "height": "2em", "width": "80%"}} onClick={() => {

                }}>Login</button>
                <br></br>
                <p1>or</p1>
                <br></br>
                <button className="selectCells" id="submitAndConfirmLong" style={{"border-radius": "1em", "height": "2em", "width": "80%"}} onClick={() => {

                }}>Create Account</button>
            </div>
        </>
        
    );
}

export default LoginAccountUI;