import './CSS/Login.css';
//
import React, { useState, useEffect } from 'react';
import CreateAccountUI from './components/createAccountUI';
import LoginAccountUI from './components/loginAccountUI';
import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
//

const client_id = "880561077463-92vhkg43l0fp5v93fdkgkkauf6dbok5s.apps.googleusercontent.com";

function Login()
{
    // Create Acc:
    const [showCreateAcc, setShowCreateAcc] = useState(false);

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

    return (<>
        <button id="backButton" className="notWhite" onClick={() => {
            window.location.href = "/";
        }}>&#10094;Back</button>
        <br></br>
        {/* LOGIN */}
        {!showCreateAcc && <LoginAccountUI setShowCreateAcc={setShowCreateAcc} />}
        {/* CREATE ACC */}
        {showCreateAcc && <CreateAccountUI setShowCreateAcc={setShowCreateAcc} />}

        <div>
            <GoogleLogin
                clientId={client_id}
                buttonText="Sign in with Google"
                onSuccess={(res) => {
                    window.location.href = "/";
                    //console.log(res);             //does not work because of widows.location.href. safe the information to a local variable

                }}
                onFailure={(res) => {
                    console.log(res);
                }}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    </>
    )
}

export default Login;
