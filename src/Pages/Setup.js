import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { UserManager } from '../utilities/userManager.js';
import '../CSS/Login.css'

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
        // Username checks:
        if (username.length < 3 || username.length > 20) {
            setUsernameError("Username must be between 3 and 20 characters long");
            valid = false;
        }
        else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            setUsernameError("Username can only contain letters, numbers, and underscores");
            valid = false;
        }
        else {
            setUsernameError(null);
        }
        // Password checks:
        if (password.length < 5 || password.length > 20) {
            setPasswordError("Password must be between 5 and 20 characters long");
            valid = false;
        }
        else if (!/^[a-zA-Z0-9_\-+$!@#%&^*]+$/.test(password)) {
            setPasswordError("Password can only contain letters, numbers, and the following symbols: _ - + $ ! @ # % & ^ *");
            valid = false;
        }
        else if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            valid = false;
        }
        else {
            setPasswordError(null);
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
                <br></br><br></br>
                <p>Error: {error}</p>
            </div>
        );
    }
    // Output:
    return (
        <div>
            {data ? (
                <div>
                    <h1 className="alignCenter">Setup Your Account</h1>
                    <div className="selectGridSmall">
                        <p>Email:</p>
                        <input value={data} disabled></input>
                        <p>Username:</p>
                        <input ref={inputRefUsername} placeholder="Username" value={username} onChange={handleChangeUsername} style={{ borderColor: !usernameError ? "black" : "red" }} onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                inputRefPassword.current.focus();
                            }
                        }}></input>
                        <p className="loginTextboxError">{usernameError}</p>
                        <p>Password:</p>
                        <input ref={inputRefPassword} placeholder="Password" type="password" value={password} onChange={handleChangePassword} style={{ borderColor: !passwordError ? "black" : "red" }} onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                inputRefConfirmPassword.current.focus();
                            }
                        }}></input>
                        <input ref={inputRefConfirmPassword} placeholder="Confirm Password" type="password" value={confirmPassword} onChange={handleChangeConfirmPassword} style={{ "borderColor": !passwordError ? "black" : "red", "margin-top": "1em" }} onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                submitNow();
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