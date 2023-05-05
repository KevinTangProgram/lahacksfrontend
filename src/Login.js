import './CSS/Login.css';
//
import React, { useState } from 'react';
import axios from 'axios';
//
function Login()
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userId, setUserId] = useState("");
    const [error, setError] = useState(false);
    const [incorrectCred, setIncorrectCred] = useState(false);
    const [responseTime, setResponseTime] = useState(false);

    const handleChangeUsername = (event) => {setUsername(event.target.value);}
    const handleChangePassword = (event) => {setPassword(event.target.value);}

    function incorrect()
    {
        if (incorrectCred)
        {
            return <p1 className="alignCenter">Invalid credentials</p1>
        }
        return <></>
    }

    function connectionError()
    {
        if (error)
        {
            return <p1 className="alignCenter">There was an error with the connection. If this problem persists, please reload the page and try again.</p1>
        }
        return <></>
    }

    function authenticate()
    {
        setResponseTime(true);
        axios.get(URL + "/auth", {
            params: {user: username, pass: crypto.SHA256(password).toString()}
        })
        .then (response => {
            if (response.data[0] !== "")
            {
                setTracker("");
                setUserId(response.data[0]);
                setOutput(response.data[1]);
                setIncorrectCred(false);
            }
            else
            {
                setIncorrectCred(true);
            }
            setResponseTime(false);
            setError(false);
        })
        .catch(() => {
            console.error();
            setError(true);
            setResponseTime(false);
        })
    }

    function loginButton()
    {
        if (!responseTime)
        {
            return (<>
            <button className="selectCells" id="submitAndConfirmLong" onClick={() => {
                    authenticate();
                    setUsername("");
                    setPassword("");
                }}>Login</button></>)
        }
        else
        {
            return (<>
            <button className="selectCells lowOpacity" id="submitAndConfirmLong" onClick={() => {
                }}>Login</button></>)
        }
    }
    
    return (<>
        <a id="backButton" className="notWhite" href="/">&#10094;Back</a>
        <h1>Welcome to Idea Oasis</h1>
        <div className="selectGridSmall">
            <input placeholder="Username" value={username} onChange={handleChangeUsername}></input>
            <input placeholder="Password" type="password" value={password} onChange={handleChangePassword} ></input>
            
            {incorrect()}
            {connectionError()}
            {loginButton()}
            <br></br>
            <p1>or</p1>
            <br></br>
            <button className="selectCells" id="submitAndConfirmLong" onClick={() => {
                setUsername("");
                setPassword("");
                setIncorrectPass(false);
            }}>Create Account</button>
        </div> 
        </>
)
}

export default Login;
