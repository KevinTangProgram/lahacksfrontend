import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { UserManager } from '../utilities/userManager.js';

function Reset() {
    // Obtain email:
    const { token } = useParams();
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const fetchData = async () => {
        try {
            const email = await UserManager.resetPasswordPage(token);
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
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const handleChangePassword = (event) => { setPassword(event.target.value); }
    const handleChangeConfirmPassword = (event) => { setConfirmPassword(event.target.value); }
    // Errors:
    const [passwordError, setPasswordError] = useState(null);
    const [createAccMessage, setCreateAccMessage] = useState(null);
    const [accountCreated, setAccountCreated] = useState(false);
    const validateBoxes = () => {
        let valid = true;
        let focus = null;
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
    const inputRefPassword = useRef(null);
    const inputRefConfirmPassword = useRef(null);
    useEffect(() => {
        if (data)
        inputRefPassword.current.focus();
    }, [data]);
    const submitNow = () => {
        if (validateBoxes() && !accountCreated) {
            UserManager.resetPassword(token, password)
                .then(() => {
                    setCreateAccMessage("Password reset successfully! You may safely close this tab, returning to the previous page to login.");
                    setAccountCreated(true);
                    setStatus(1);
                })
                .catch((error) => {
                    setCreateAccMessage(error);
                    setStatus(0);
                    inputRefPassword.current.focus();
                });
        }
    }
    const clearNow = () => {
        if (!accountCreated) {
            setPassword("");
            setConfirmPassword("");
            setPasswordError(null);
            setCreateAccMessage(null);
            inputRefPassword.current.focus(); 
        }
    }

    // Output:
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
                    <h1 className="alignCenter">Reset Account Password</h1>
                    <div className="selectGridSmall">
                        <p>Email:</p>
                        <input value={data} disabled></input>
                        <p>New Password:</p>
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

export default Reset;