import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {CONST} from '../../utilities/CONST.js';
import '../../CSS/Login.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { UserManager } from '../../utilities/userManager.js';
//

const client_id = "1045642159671-60op9ohkrl55eug9gdqu30blv4vdkjg7.apps.googleusercontent.com";

function LoginAccountUI(props) {
    // Textboxes:
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleChangeUsername = (event) => { setUsername(event.target.value); }
    const handleChangePassword = (event) => { setPassword(event.target.value); }

    const onSuccess = (googleUser) => {
        const profile = googleUser.getBasicProfile();
        console.log('Name: ' + profile.getName());
        console.log('Email: ' + profile.getEmail());
        console.log('Image URL: ' + profile.getImageUrl());
    };

    // Login:
    function loginAccount() {
        props.setLoginState(3);
        // axios.get(CONST.URL + "/login", {
        //     params: {
        //         user: username,
        //         password: password,
        //     }
        // })
        // .then((response) => {
        //     if (response.data !== "")
        //     {
        //         alert(response.data)
        //     }
        //     else
        //     {
        //         alert("Incorrect username or password.");
        //     }
        // })
    }

    // Output:
    return (
        <GoogleOAuthProvider clientId={client_id}>
        <div className="overlay" style={{
            left: '30%', top: '30%', width: '40%', height: '60%',
            backgroundColor: '#f3ffff', borderRadius: '1em', boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)'
        }}>

            <img className="icons::hover iconTrash" src="/images/icons/iconCancel.png" alt="Close" onClick={() => { props.setLoginState(0) }} style={{ "position": "absolute", "top": "30px", "right": "30px" }} />
            <h1 style={{ "textAlign": "center" }}>Welcome!</h1>
            <div className="selectGridSmall">
                <input placeholder="Email address" value={username} onChange={handleChangeUsername}></input>
                <input placeholder="Password" type="password" value={password} onChange={handleChangePassword} style={{ "marginTop": "20px" }}></input>
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
                            UserManager.continueWithGoogle(credentialResponse.credential)
                                .then((response) => {
                                    console.log('Response:', response);
                                    props.setLoginState(0);
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                        text="continue_with"
                        shape="pill"
                    />
            </div>
        </div>
        </GoogleOAuthProvider>
    );
}

export default LoginAccountUI;