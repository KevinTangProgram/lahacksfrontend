import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { UserManager } from '../utilities/userManager.js';
import '../CSS/Login.css'
import { Helmet } from 'react-helmet';


function Setup() {
    // Obtain email:
    const { token } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const fetchData = async () => {
        try {
            const email = await UserManager.setupFromEmail(token);
            setData(email);
            setError(null);
        }
        catch (error) {
            setData(null);
            setError(error);
        }
    };
    useEffect(() => {
        fetchData();
    }, [token]);
    // Textboxes:
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const handleChangeUsername = (event) => { setUsername(event.target.value); }
    const handleChangePassword = (event) => { setPassword(event.target.value); }
    const handleChangeConfirmPassword = (event) => { setConfirmPassword(event.target.value); }
    // Errors:
    const [usernameError, setUsernameError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [createAccMessage, setCreateAccMessage] = useState(null);
    const [accountCreated, setAccountCreated] = useState(false);
    const validateBoxes = () => {
        let valid = true;
        let focus = null;
        // Username checks:
        const usernameValid = UserManager.validateInput("username", username);
        if (usernameValid === true) {
            setUsernameError(null);
        }
        else {
            setUsernameError(usernameValid);
            if (!focus) {
                focus = "username";
            }
            valid = false;
        }
        // Password checks:
        const passwordValid = UserManager.validateInput("password", password);
        if (passwordValid === true) {
            if (password === confirmPassword) {
                setPasswordError(null);
            }
            else {
                setPasswordError("Passwords do not match");
                valid = false;
                if (!focus) {
                    focus = "confirmPassword";
                }
            }
        }
        else {
            setPasswordError(passwordValid);
            valid = false;
            if (!focus) {
                focus = "password";
            }
        }
        switch (focus) {
            case "username":
                inputRefUsername.current.focus();
                break;
            case "password":
                inputRefPassword.current.focus();
                break;
            case "confirmPassword":
                inputRefConfirmPassword.current.focus();
                break;
        }
        return valid;
    }
    // Submit:
    const [status, setStatus] = useState(null);
    const inputRefUsername = useRef(null);
    const inputRefPassword = useRef(null);
    const inputRefConfirmPassword = useRef(null);
    useEffect(() => {
        if (data)
            inputRefUsername.current.focus();
    }, [data]);
    const submitNow = () => {
        if (validateBoxes() && !accountCreated) {
            UserManager.createAccount(token, username, password)
                .then(() => {
                    setCreateAccMessage("Account created successfully! You may safely close this tab, returning to the previous page to login.");
                    setAccountCreated(true);
                    setStatus(1);
                })
                .catch((error) => {
                    setCreateAccMessage(error);
                    setStatus(0);
                    inputRefUsername.current.focus();
                });
        }
    }
    const clearNow = () => {
        if (!accountCreated) {
            setUsername("");
            setPassword("");
            setConfirmPassword("");
            setUsernameError(null);
            setPasswordError(null);
            setCreateAccMessage(null);
            inputRefUsername.current.focus();
        }
    }

    // Error:
    if (error) {
        return (
            <div>
                <Helmet>
                    <title>Account Setup - Idea Oasis</title>
                </Helmet>
                <br></br><br></br>
                <p>Error: {error}</p>
            </div>
        );
    }
    // Output:
    return (
        <div>
            <Helmet>
                <title>Account Setup - Idea Oasis</title>
            </Helmet>
            {data ? (
                <div>
                    <h1 className="alignCenter">Setup Your Account</h1>
                    <div className="selectGridSmall">
                        <p>Email:</p>
                        <input value={data} disabled></input>
                        <p>Username:</p>
                        <input disabled={accountCreated} ref={inputRefUsername} placeholder="Username" value={username} onChange={handleChangeUsername} style={{ borderColor: !usernameError ? "black" : "red" }} onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                inputRefPassword.current.focus();
                            }
                        }}></input>
                        <p className="loginTextboxError">{usernameError}</p>
                        <p>Password:</p>
                        <input disabled={accountCreated} ref={inputRefPassword} placeholder="Password" type="password" value={password} onChange={handleChangePassword} style={{ borderColor: !passwordError ? "black" : "red" }} onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                inputRefConfirmPassword.current.focus();
                            }
                            if (event.key === " ") {
                                event.preventDefault();
                            }
                        }}></input>
                        <input disabled={accountCreated} ref={inputRefConfirmPassword} placeholder="Confirm Password" type="password" value={confirmPassword} onChange={handleChangeConfirmPassword} style={{ "borderColor": !passwordError ? "black" : "red", "margin-top": "1em" }} onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                submitNow();
                            }
                            if (event.key === " ") {
                                event.preventDefault();
                            }
                        }}></input>
                        <p className="loginTextboxError">{passwordError}</p>
                        <br></br>
                        <button className={accountCreated ? 'loginLargeButton lowOpacity' : 'loginLargeButton'} onClick={submitNow}>Submit</button>
                        <button className={accountCreated ? 'loginLargeButton lowOpacity' : 'loginLargeButton'} onClick={clearNow}>Clear</button>
                        
                        {createAccMessage &&
                            <p className={status === 1 ? "loginResponse" : "loginError"}>{createAccMessage}</p>}
                    </div>
                </div>
            ) : (
                <div className="loader"></div>  
            )}
        </div>
    );
}

export default Setup;