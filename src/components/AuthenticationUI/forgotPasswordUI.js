import React, { useState, useEffect, useRef } from 'react';
import { UserManager } from '../../utilities/userManager.js';
import { StorageManager } from '../../utilities/storageManager.js'
import Tooltip from '../tooltip.js';
import '../../CSS/Login.css';


function ForgotPasswordUI(props) {
    // Email verification:
    const [showLoader, setShowLoader] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    const [email, setEmail] = useState("");
    const handleChangeEmail = (event) => { setEmail(event.target.value); }
    // Cooldowns:
    const cooldownLength = 60;
    const cache = StorageManager.createSyncedObject({ cooldownTime: 0 }, "temp", "cachedCooldown");
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
        if (email.includes("@") && email.includes(".")) {
            startCooldown();
            setShowLoader(true);
            UserManager.resetPasswordEmail(email)
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
    }
    const inputRef = useRef(null);
    useEffect(() => {
        inputRef.current.focus();
    }, []);

    // Output:
    return (
        <div>
            {/* Description:  */}
            <h1 className="alignCenter">Reset Password</h1>
            <h3>To proceed, please enter the email associated with your account. </h3>
            <Tooltip text="We will send you an email with a link to reset your password." />
            
            <div className="selectGridSmall">
                {/* Email Textbox: */}
                <input ref={inputRef} type="text" name="email" autocomplete="on" placeholder="Email" value={email} onChange={handleChangeEmail} onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        event.preventDefault();
                        if (cooldown < 1)
                        submitNow();
                    }
                }} ></input>
                <br></br>
                {/* Submit Button:  */}
                <button className={cooldown > 0 ? "selectCells lowOpacity" : "selectCells"} id="submitAndConfirmLong" style={{ "borderRadius": "1em", "height": "2em", "width": "80%" }} onClick={submitNow}
                    disabled={cooldown > 0}
                >{cooldown > 0 ? "Verify (" + cooldown + "s)" : "Verify"}</button>
                {/* Back Button:  */}
                <button className="selectCells" id="submitAndConfirmLong" style={{ "borderRadius": "1em", "height": "2em", "width": "80%" }} onClick={() => {
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

export default ForgotPasswordUI;