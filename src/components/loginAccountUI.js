import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {CONST} from '../utilities/CONST.js';
import '../CSS/Login.css';
import { ReactGoogleAuth } from "react-google-auth";
import { StorageManager } from '../utilities/storageManager.js';
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
        <div className="overlay" style={{
            left: '30%', top: '30%', width: '40%', height: '60%',
            backgroundColor: '#f3ffff', borderRadius: '1em', boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)'
        }}>
            <h1 style={{ "text-align": "center" }}>Welcome Back!</h1>
            <img className="icons::hover iconTrash" src="/images/icons/iconCancel.png" alt="Close" onClick={() => { props.setLoginState(0)} } />
            <div className="selectGridSmall">
                <input placeholder="Email address" value={username} onChange={handleChangeUsername}></input>
                <input placeholder="Password" type="password" value={password} onChange={handleChangePassword} style={{ "margin-top": "20px" }}></input>
                <div style={{ "font-size": "12px", "margin-top": "10px" }}>
                    <p1>Don't have an account? </p1>
                    <button style={{ "text-decoration": "none", "border": "none", "background-color": "transparent", "cursor": "pointer", "color": "#10a37f" }} onClick={() => {
                        props.setLoginState(2);
                    }}>Sign up</button>
                </div>
                <button className="selectCells" id="submitAndConfirmLong" style={{ "border-radius": "1em", "height": "2em", "width": "80%", "margin-top": "20px" }} onClick={() => {
                    loginAccount();
                }}>Login</button>
                <div style={{ "margin-top": "20px" }}>
                    <p1>or</p1>
                </div>
            </div>
            <div className="alignCenter">
                {/* <GoogleLogin
                    clientId={client_id}
                    buttonText="Sign in with Google"
                    onSuccess={(res) => {
                        console.log(res);

                    }}
                    onFailure={(res) => {
                        console.log(res);
                    }}
                    cookiePolicy={'single_host_origin'}
                /> */}
                <button>Login</button>

            </div>
        </div>
    );
}

export default LoginAccountUI;