import React, { useState } from 'react';
import axios from 'axios';
const crypto = require('crypto-js');

function Home()
{
    const [error, setError] = useState(false);
    const [responseTime, setResponseTime] = useState(false);
    const [input, setInput] = useState([]);
    const [shortInput, setShortInput] = useState("");
    const [output, setOutput] = useState([]);
    const [tracker, setTracker] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userId, setUserId] = useState("");
    const [incorrectCred, setIncorrectCred] = useState(false);
    const [goodCred, setGoodCred] = useState(false);
    const [password2, setPassword2] = useState("");
    const [incorrectPass, setIncorrectPass] = useState(false);
    const [sentEmail, setSentEmail] = useState(false);

    const handleChangeInput = (event) => {setShortInput(event.target.value);}
    const handleChangeUsername = (event) => {setUsername(event.target.value);}
    const handleChangePassword = (event) => {setPassword(event.target.value);}
    const handleChangePassword2 = (event) => {setPassword2(event.target.value);}

    const URL = "https://gharial-cape.cyclic.app";
    //const URL = "http://localhost:8080";

    function sendInput()
    {
        setResponseTime(true);
        let addedInput = input;
        if (shortInput !== "")
        {
            addedInput.push(shortInput);
        }
        axios.put(URL + "/api/cohere", {
            id: userId,
            input: addedInput
        })
        .then (response => {
            let newOutput = output;
            newOutput.push(addedInput);
            newOutput.push(response.data);
            setOutput(newOutput);
            setInput([]);
            setShortInput("");
            setResponseTime(false);
            setError(false);
        })
        .catch(() => {
            console.error();
            setError(true);
            setResponseTime(false);
        })
    }

    function authenticate()
    {
        setResponseTime(true);
        axios.get(URL + "/auth", {
            params: {user: username, pass: crypto.SHA256(password).toString()}
        })
        .then (response => {
            if (response.data[0] !== "")
            {
                setTracker("");
                setUserId(response.data[0]);
                setOutput(response.data[1]);
                setIncorrectCred(false);
            }
            else
            {
                setIncorrectCred(true);
            }
            setResponseTime(false);
            setError(false);
        })
        .catch(() => {
            console.error();
            setError(true);
            setResponseTime(false);
        })
    }

    function newAccount()
    {
        if (password !== password2)
        {
            setIncorrectPass(true);
            return;
        }
        setResponseTime(true);
        axios.post(URL + "/new/account", {
            user: username,
            pass: crypto.SHA256(password).toString(),
        })
        .then (response => {
            if (response.data === 0)
            {
                setGoodCred(true);
                setIncorrectPass(false);
            }
            setResponseTime(false);
            setError(false);
        })
        .catch(() => {
            console.error();
            setError(true);
            setResponseTime(false);
        })
    }

    function deletePost(index)
    {
        let newOutput = output;
        newOutput.splice(index, 2);
        setOutput(newOutput);
        setResponseTime(true);
        axios.put(URL + '/delete', {
            id: userId,
            index: index
        })
        .then (response => {
            setResponseTime(false);
            setError(false);
        })
        .catch(() => {
            console.error();
            setError(true);
            setResponseTime(false);
        })
    }

    function sendEmail()
    {
        axios.get(URL + '/email', {
            id: userId
        })
        .then (response => {
            setSentEmail(true);
        })
        .catch(() => {
        })
    }

    function addThought()
    {
        let addedInput = input;
        addedInput.push(shortInput);
        setInput(addedInput);
        setShortInput("");
    }

    function connectionError()
    {
        if (error)
        {
            return <p1 className="alignCenter">There was an error with the connection. If this problem persists, please reload the page and try again.</p1>
        }
        return <></>
    }

    function incorrect()
    {
        if (incorrectCred)
        {
            return <p1 className="alignCenter">Invalid credentials</p1>
        }
        return <></>
    }

    function passwordMismatch()
    {
        if (incorrectPass)
        {
            return <p1 className="alignCenter">Passwords to not match</p1>
        }
        return <></>
    }

    function creactionSuccessful()
    {
        if (goodCred)
        {
            return <p1 className="alignCenter">Account Creation Successful! Go back to login.</p1>
        }
        return <></>
    }

    function emailNotify()
    {
        if (sentEmail)
        {
            return <p1 className="alignCenter">Email successfully sent!</p1>
        }
        return <></>
    }

    function Thoughts({prompt, index})
    {
        return (<>
            <p1>{prompt}</p1>
            <br></br>
        </>)
    }

    function QuestionAnswer({prompt, index})
    {
        if (index % 2 === 0)
        {
            return (
                <>
                    <div className="confirmGrid">
                        <p1>Prompt:</p1>
                        <div>
                            {prompt.map((index, i) => (<div><Thoughts prompt={prompt[i]} index={i}/></div>))}
                        </div>
                        <button className="pointer" onClick={() => deletePost(index)}><img src="trash.png" height="20px"></img></button>
                    </div>
                </>
            )
        }
        else{
            return (
                <>
                    <div className="confirmGrid">
                        <p1>Response:</p1>
                        <p1>{prompt}</p1>
                    </div>
                </>
            )
        }
    }

    function searchButton()
    {
        if (!responseTime)
        {
            return (<>
            <button className="selectCells" id="submitAndConfirmLong" onClick={() => {
                    sendInput();
                    setSentEmail(false);
                }}>Organize Now</button></>)
        }
        else
        {
            return (<>
            <button className="selectCells lowOpacity" id="submitAndConfirmLong" onClick={() => {
                }}>Organize Now</button></>)
        }
    }

    function loginButton()
    {
        if (!responseTime)
        {
            return (<>
            <button className="selectCells" id="submitAndConfirmLong" onClick={() => {
                    authenticate();
                    setUsername("");
                    setPassword("");
                }}>Login</button></>)
        }
        else
        {
            return (<>
            <button className="selectCells lowOpacity" id="submitAndConfirmLong" onClick={() => {
                }}>Login</button></>)
        }
    }

    function accountButton()
    {
        if (!responseTime)
        {
            return (<>
            <button className="selectCells" id="submitAndConfirmLong" onClick={() => {
                    newAccount();
                    setUsername("");
                    setPassword("");
                    setPassword2("");
                }}>Create Account</button></>)
        }
        else
        {
            return (<>
            <button className="selectCells lowOpacity" id="submitAndConfirmLong" onClick={() => {
                }}>Create Account</button></>)
        }
    }

    switch(tracker)
    {
        case "":
            return (
            <>
                <div className="container">
                    <img src="palm.png" id="homeImage" height="150" width="150" alt="Palm Tree"></img>
                </div>
                <button className="selectCells" id="submitAndConfirmVeryLong" onClick={() => {setTracker("login"); setSentEmail(false);}}>Login/Create Account</button>
                <h1>Please Enter Your Thoughts Below</h1>
                <div className="selectGrid">
                    {output.map((index, i) => (<div><QuestionAnswer prompt={output[i]} index={i}/></div>))}
                    <button className="pointer" onClick={() => sendEmail()}><img src="email.png" width="20px"></img></button>
                    <div className="inputGrid">
                        <input placeholder="What stuff is your professor saying now?" value={shortInput} onChange={handleChangeInput}></input>
                        <button className="selectCells" id="submitAndConfirm" onClick={() => {addThought();}}>+</button>
                    </div>
                    <div className="confirmGrid">
                        <p1>Current Thoughts:</p1>
                        <div>
                            {input.map((index, i) => (<div><Thoughts prompt={input[i]} index={i}/></div>))}
                        </div>
                    </div>
                    <br></br>
                    {connectionError()}
                    {searchButton()}
                </div>
            </>
            )
        case "login":
            return (
                <>
                    <h1>Welcome to Idea Oasis</h1>
                    <div className="selectGridSmall">
                        <input placeholder="Username" value={username} onChange={handleChangeUsername}></input>
                        <input placeholder="Password" type="password" value={password} onChange={handleChangePassword}></input>
                        
                        {incorrect()}
                        {connectionError()}
                        {loginButton()}
                        <br></br>
                        <p1>or</p1>
                        <button className="selectCells" id="submitAndConfirmLong" onClick={() => {
                            setTracker("setup");
                            setUsername("");
                            setPassword("");
                            setGoodCred(false);
                            setIncorrectPass(false);
                        }}>Create Account</button>
                    </div> 
                </>
            )
        case "setup":
            return (<>
                <button id="backButton" onClick={() => {
                    setTracker("login");
                }}>&#10094;Back</button>
                <h1>Welcome to Idea Oasis</h1>
                <div className="selectGridSmall">
                        <input placeholder="Username" value={username} onChange={handleChangeUsername}></input>
                        <input placeholder="Password" type="password" value={password} onChange={handleChangePassword}></input>
                        <input placeholder="Enter Password Again" type="password" value={password2} onChange={handleChangePassword2}></input>
                    
                    {passwordMismatch()}
                    {creactionSuccessful()}
                    {connectionError()}
                    {accountButton()}
                </div> 
            </>)
        default:
            return (<></>)
    }
}

export default Home;