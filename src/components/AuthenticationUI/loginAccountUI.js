import React, { useState } from 'react';
import '../../CSS/Login.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { UserManager } from '../../utilities/userManager.js';
//

const client_id = "1045642159671-60op9ohkrl55eug9gdqu30blv4vdkjg7.apps.googleusercontent.com";

function LoginAccountUI(props) {
    // Textboxes:
    const [email, setEmail] = useState(props.cachedEmail);
    const [password, setPassword] = useState(props.cachedPassword);
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const handleChangeEmail = (event) => { setEmail(event.target.value); }
    const handleChangePassword = (event) => { setPassword(event.target.value); }

    // Login:
    const validateBoxes = () => {
        let valid = true;
        // Email checks:
        if ((!email.includes("@") || !email.includes("."))) {
            setEmailError("Please enter a valid email.");
            valid = false;
        }
        else {
            setEmailError(null);
        }
        // Password checks:
        if (password.length < 5 || password.length > 20) {
            setPasswordError("Please enter a valid password.");
            valid = false;
        }
        else {
            setPasswordError(null);
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
                props.setLoginState(0);
            })
            .catch(error => {
                props.setError(error);
            })
        }
    }
    const [error, setError] = useState(null);


    // Output:
    return (
        <GoogleOAuthProvider clientId={client_id}>
        <div className="overlay" style={{
            left: '30%', top: '25%', width: '40%', height: '70%',
            backgroundColor: '#f3ffff', borderRadius: '1em', boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)'
        }}>

            <img className="icons::hover iconTrash" src="/images/icons/iconCancel.png" alt="Close" onClick={() => { props.setLoginState(0) }} style={{ "position": "absolute", "top": "30px", "right": "30px" }} />
            <h1 style={{ "textAlign": "center" }}>Welcome!</h1>
            <div className="selectGridSmall">
                <input placeholder="Email address" value={email} onChange={handleChangeEmail}></input>
                    {emailError && <p style={{ color: "red", margin: 0, padding: 0 }}>{emailError}</p>}
                <input placeholder="Password" type="password" value={password} onChange={handleChangePassword} style={{ "marginTop": "20px" }}></input>
                    {passwordError && <p style={{ color: "red", margin: 0, padding: 0 }}>{passwordError}</p>}
                <div style={{ "fontSize": "12px", "marginTop": "20px" }}>
                    <button style={{ "textDecoration": "none", "border": "none", "backgroundColor": "transparent", "cursor": "pointer", "color": "#10a37f" }} onClick={() => {
                        props.setLoginState(2);
                    }}>Don't have an account?</button>
                </div>
                <button className="selectCells" id="submitAndConfirmLong" style={{ "borderRadius": "1em", "height": "2em", "width": "80%", "marginTop": "20px" }} onClick={() => {
                    loginAccount();
                }}>Login</button>
                <div style={{ "marginTop": "5px" }}>
                    <p>or</p>
                </div>
                    <GoogleLogin
                        onSuccess={credentialResponse => {
                            props.setLoginState(3);
                            props.setError(null);
                            UserManager.continueWithGoogle(credentialResponse.credential)
                                .then((response) => {
                                    props.setLoginState(0);
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
                    {error && (
                        <p style={{ color: "red" }}>{error}</p>
                    )}
            </div>
        </div>
        </GoogleOAuthProvider>
    );
}

export default LoginAccountUI;