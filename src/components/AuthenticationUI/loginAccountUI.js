import React, { useState, useEffect, useRef } from 'react';
import '../../CSS/Login.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { UserManager } from '../../utilities/userManager.js';
import { useNavigate } from 'react-router-dom';

//

const client_id = "1045642159671-60op9ohkrl55eug9gdqu30blv4vdkjg7.apps.googleusercontent.com";

function LoginAccountUI(props) {
    // Textboxes:
    const [email, setEmail] = useState(props.cachedEmail);
    const [password, setPassword] = useState(props.cachedPassword);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const handleChangeEmail = (event) => { setEmail(event.target.value); }
    const handleChangePassword = (event) => { setPassword(event.target.value); }
    // Login:
    const validateBoxes = () => {
        let valid = true;
        let focus = null;
        // Email checks:
        if (UserManager.validateInput("email", email) !== true) {
            setEmailError("Please enter a valid email.");
            valid = false;
            if (!focus) {
                focus = "email";
            }
        }
        else {
            setEmailError(null);
        }
        // Password checks:
        if (UserManager.validateInput("password", password) !== true) {
            setPasswordError("Please enter a valid password.");
            valid = false;
            if (!focus) {
                focus = "password";
            }
        }
        else {
            setPasswordError(null);
        }
        switch (focus) {
            case "email":
                inputRefEmail.current.focus();
                break;
            case "password":
                inputRefPassword.current.focus();
                break;
        }
        return valid;
    }
    function loginAccount() {
        if (validateBoxes()) {
            props.setCachedEmail(email);
            props.setCachedPassword(password);
            props.setLoginState(3);
            props.setError(null);
            UserManager.login(email, password)
            .then((response) => {
                onLoginSuccess();
            })
            .catch(error => {
                props.setError(error);
            })
        }
    }
    const navigate = useNavigate();
    function onLoginSuccess() {
        props.setLoginState(0);
        navigate("/home");
    }
    const [error, setError] = useState(null);
    // Submit:
    const inputRefEmail = useRef(null);
    const inputRefPassword = useRef(null);
    useEffect(() => {
        inputRefEmail.current.focus();
    }, []);


    // Output:
    return (
        <GoogleOAuthProvider clientId={client_id}>
        <div>
                {/* Header:  */}
            <h1 className="alignCenter">Welcome!</h1>
            <div className="selectGridSmall">
                {/* Email address and Password Boxes: */}
                <input ref={inputRefEmail} type="text" name="email" autoComplete="on" placeholder="Email address" value={email} onChange={handleChangeEmail} onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            inputRefPassword.current.focus();
                        }
                        if (event.key === " ") {
                            event.preventDefault();
                        }
                    }}></input>
                    {emailError && <p className="loginTextboxError">{emailError}</p>}
                    <input ref={inputRefPassword} type="password" name="password" autoComplete="on" placeholder="Password" value={password} onChange={handleChangePassword} style={{ "marginTop": "1em" }} onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            loginAccount();
                        }
                        if (event.key === " ") {
                            event.preventDefault();
                        }
                    }}></input>
                    {passwordError && <p className="loginTextboxError">{passwordError}</p>}
                {/* Create Account Button */}
                <button className="loginSmallButton" onClick={() => {
                    props.setLoginState(2);
                }}>Don't have an account?</button>
                {/* Custom Login Button */}
                <button className="loginLargeButton" onClick={() => { loginAccount() }}>Login</button>
                <p className="alignCenter" styles={{"margin-bottom": "auto"}}>or</p>
                {/* Google Login Button: */}
                <div className="loginLargeButton">
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            props.setLoginState(3);
                            props.setError(null);
                            UserManager.continueWithGoogle(credentialResponse.credential)
                                .then((response) => {
                                    onLoginSuccess();
                                })
                                .catch((error) => {
                                    props.setError(error);
                                });
                        }}
                        onError={() => {
                            setError("Problem authenticating with google - please try again in a moment.");
                        }}
                        text="continue_with"
                        shape="pill"
                    />
                </div>
                {/* Error Display: */}
                {error && (
                    <p className="loginTextboxError">{error}</p>
                )}
            </div>
        </div>
        </GoogleOAuthProvider>
    );
}

export default LoginAccountUI;