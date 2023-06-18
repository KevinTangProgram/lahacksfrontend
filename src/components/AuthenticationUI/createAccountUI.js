import React, { useState, useEffect } from 'react';
import { UserManager } from '../../utilities/userManager.js';
import Tooltip from '../tooltip.js';
//

function CreateAccountUI(props) {
    // Email verification:
    const [showLoader, setShowLoader] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    const [email, setEmail] = useState("");
    const handleChangeEmail = (event) => { setEmail(event.target.value); }
    // Cooldowns:
    const [cooldown, setCooldown] = useState(0); 
    const startCooldown = () => {
        // Start cooldown:
        const cooldownLength = 61;
        setCooldown(cooldownLength);
        const timer = setInterval(() => {
            setCooldown(prevValue => prevValue - 1);
        }, 1000);
        // Stop timer after cooldown:
        setTimeout(() => {
            clearInterval(timer);
            setCooldown(0);
        }, cooldownLength * 1000);
    };


    // return:
    return (
        <div className="overlay" style={{
            left: '30%', top: '30%', width: '40%', height: '60%',
            backgroundColor: '#f3ffff', borderRadius: '1em', boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)'
        }}>
            <h1 style={{"textAlign": "center"}}>Create Account</h1>
            <h3>To proceed, please verify your email</h3>
            <Tooltip text="Your email is used for authentication and collaboration. We will never spam you." />
            <div className="selectGridSmall">
                <input placeholder="Email" value={email} onChange={handleChangeEmail} ></input>
                <br></br>
                <button className={cooldown > 0 ? "selectCells lowOpacity" : "selectCells" } id ="submitAndConfirmLong" style={{"borderRadius": "1em", "height": "2em", "width": "80%"}} onClick={() =>{
                    if (email.includes("@") && email.includes(".")) {
                        startCooldown();
                        setShowLoader(true);
                        UserManager.verifyEmail(email)
                        .then((response) => {
                            setShowLoader(false);
                            setResponse(response);
                            setError(null);
                        })
                        .catch((error) => {
                            setShowLoader(false);
                            setError(error);
                            setResponse(null);
                        });
                    }
                    else {
                        setError("Please enter a valid email");
                    }
                }}
                    disabled={cooldown > 0}
                >{cooldown > 0 ? "Verify (" + cooldown + "s)" : "Verify"}</button>
                <button className="selectCells" id = "submitAndConfirmLong" style={{"borderRadius": "1em", "height": "2em", "width": "80%"}} onClick={() => {
                    props.setLoginState(1);
                }}>Back to login</button>
                {error && (
                    <p style={{"color": "red"}}>{error}</p>
                )}
                {response && (
                    <p style={{ "color": "green" }}>{response}</p>
                )}
                {showLoader && (
                    <div className="loader"></div>
                )}
            </div>
        </div>
    );
}

export default CreateAccountUI;