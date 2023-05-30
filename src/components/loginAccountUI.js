import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {CONST} from '../utilities/CONST.js';
import '../CSS/Login.css';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
//

const client_id = "880561077463-92vhkg43l0fp5v93fdkgkkauf6dbok5s.apps.googleusercontent.com";

function LoginAccountUI(props) {
    // Textboxes:
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleChangeUsername = (event) => { setUsername(event.target.value); }
    const handleChangePassword = (event) => { setPassword(event.target.value); }

    useEffect(() => {
        function start() {
            gapi.client.init({
                clientId: client_id,
                scope: ""        
            })
        };
        gapi.load('client:auth2', start);
        // function onSignIn(googleUser) {
        //     var profile = googleUser.getBasicProfile();
        //     console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        //     console.log('Name: ' + profile.getName());
        // }
    }, []);

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
        <>
            <h1 style={{"text-align": "center"}}>Welcome Back!</h1>
            <div className="selectGridSmall">
                <input placeholder="Email address" value={username} onChange={handleChangeUsername}></input>
                <input placeholder="Password" type="password" value={password} onChange={handleChangePassword} style={{"margin-top": "20px"}}></input>
                <div style={{"font-size": "12px", "margin-top": "10px"}}>
                    <p1>Don't have an account? </p1>
                    <button style={{"text-decoration": "none", "border": "none", "background-color": "transparent", "cursor": "pointer", "color": "#10a37f"}} onClick={() => {
                    props.setShowCreateAcc(true);}}>Sign up</button>
                </div>
                <button className="selectCells" id="submitAndConfirmLong" style={{"border-radius": "1em", "height": "2em", "width": "80%", "margin-top": "20px"}} onClick={() => {
                    loginAccount();
                }}>Login</button>
                <div style={{"margin-top": "20px"}}>
                    <p1>or</p1>
                </div>
            </div>
            <div style={{"display": "flex", "align-items": "center"}}>
                <GoogleLogin
                    clientId={client_id}
                    buttonText="Sign in with Google"
                    onSuccess={(res) => {
                        //window.location.href = "/";
                        console.log(res);             //does not work because of widows.location.href. save the information to a local variable

                    }}
                    onFailure={(res) => {
                        console.log(res);
                    }}
                    cookiePolicy={'single_host_origin'}
                />
            </div>
        </>
        
    );
}

export default LoginAccountUI;