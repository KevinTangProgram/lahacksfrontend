import React, { useState, useEffect, useRef } from 'react';
import { UserManager } from '../../utilities/userManager.js';
import { initializeSyncedObject } from 'react-synced-object'
import Tooltip from '../tooltip.js';
import '../../CSS/Login.css';

//

function CreateAccountUI(props) {
    // Email verification:
    const [showLoader, setShowLoader] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    const [email, setEmail] = useState("");
    const handleChangeEmail = (event) => { setEmail(event.target.value); }
    // Cooldowns:
    const cooldownLength = 60;
    const cache = initializeSyncedObject("cachedCooldown", "temp", { defaultValue: { cooldown: 0 }, safeMode: false }).data;
    const cooldownSeconds = Math.floor((Date.now() - cache.cooldownTime) / 1000);
    const [cooldown, setCooldown] = useState(cooldownSeconds < cooldownLength ? cooldownLength - cooldownSeconds : 0); 
    const startCooldown = () => {
        // Start cooldown:
        setCooldown(cooldownLength);
        cache.cooldownTime = Date.now();
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setCooldown(prevCooldown => {
                const newCooldown = prevCooldown - 1;
                return newCooldown >= 0 ? newCooldown : 0;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);
    // Submit:
    const submitNow = () => {
        if (email === "") {
            inputRef.current.focus();
            return;
        }
        const validateEmail = UserManager.validateInput("email", email);
        if (validateEmail === true) {
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
                    inputRef.current.focus();
                });
        }
        else {
            setError(validateEmail);
            inputRef.current.focus();
        }
    }
    const inputRef = useRef(null);
    useEffect(() => {
        inputRef.current.focus();
    }, []);

    // Output:
    return (
        <div>
            {/* Description:  */}
            <h1>Create Account</h1>
            <h3>To proceed, please verify your email</h3>
            <Tooltip text="Your email is used for authentication and collaboration. We will never spam you." />
            
            <div className="selectGridSmall">
                {/* Email Textbox:  */}
                <input ref={inputRef} placeholder="Email" value={email} onChange={handleChangeEmail} onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        if (cooldown < 1)
                        submitNow();
                    }
                    if (event.key === " ") {
                        event.preventDefault();
                    }
                }} ></input>
                <br></br>
                {/* Submit Button */}
                <button className={cooldown > 0 ? "loginLargeButton lowOpacity" : "loginLargeButton" } onClick={submitNow}
                    disabled={cooldown > 0}>{cooldown > 0 ? "Verify (" + cooldown + "s)" : "Verify"}</button>
                {/* Back Button */}
                <button className="loginLargeButton" onClick={() => {
                    props.setLoginState(1);
                }}>Back</button>
                {/* Error/Response Messages */}
                {error && (
                    <p className="loginError">{error}</p>
                )}
                {response && (
                    <p className="loginResponse">{response}</p>
                )}
                {showLoader && (
                    <div className="loader"></div>
                )}
            </div>
        </div>
    );
}

export default CreateAccountUI;