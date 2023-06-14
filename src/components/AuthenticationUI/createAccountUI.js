import React, { useState } from 'react';
import { UserManager } from '../../utilities/userManager.js';
//

function CreateAccountUI(props) {
    // vars/functions:
    const [error, setError] = useState(null);
    const [email, setEmail] = useState("");
    const handleChangeEmail = (event) => { setEmail(event.target.value); }

    // return:
    return (
        <div className="overlay" style={{
            left: '30%', top: '30%', width: '40%', height: '60%',
            backgroundColor: '#f3ffff', borderRadius: '1em', boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)'
        }}>
            <h1 style={{"textAlign": "center"}}>Create Account</h1>
            <h3>To proceed, please verify your email</h3>
            <div className="selectGridSmall">
                <input placeholder="Email" value={email} onChange={handleChangeEmail} ></input>
                <br></br>
                <button className="selectCells" id = "submitAndConfirmLong" style={{"borderRadius": "1em", "height": "2em", "width": "80%"}} onClick={() =>{
                    if (email.includes("@") && email.includes(".")) {
                        UserManager.verifyEmail(email)
                        .catch((error) => {
                            setError(error);
                        });
                    }
                    else {
                        setError("Please enter a valid email");
                    }
                }}>Verify</button>
                <button className="selectCells" id = "submitAndConfirmLong" style={{"borderRadius": "1em", "height": "2em", "width": "80%"}} onClick={() => {
                    props.setLoginState(1);
                }}>Back</button>
                {error && (
                    <p>Error: {error}</p>
                )}
            </div>
        </div>
    );
}

export default CreateAccountUI;