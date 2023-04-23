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

    const handleChangeInput = (event) => {setShortInput(event.target.value);}
    const handleChangeUsername = (event) => {setUsername(event.target.value);}
    const handleChangePassword = (event) => {setPassword(event.target.value);}

    const URL = "http://localhost:8080";

    function sendInput()
    {
        setResponseTime(true);
        let addedInput = input;
        if (shortInput !== "")
        {
            addedInput.push(shortInput);
        }
        console.log(addedInput);
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
                setTracker("main");
                setUserId(response.data[0]);
                setOutput(response.data[1]);
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
        setResponseTime(true);
        console.log(username);
        console.log(password);
        axios.post(URL + "/new/account", {
            user: username,
            pass: crypto.SHA256(password).toString(),
        })
        .then (response => {
            if (response.data === 0)
            {
                setTracker("");
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
    function searchButton()
    {
        if (!responseTime)
        {
            return (<>
            <button className="selectCells" id="submitAndConfirmLong" onClick={() => {
                    sendInput();
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
                }}>Create Account</button></>)
        }
        else
        {
            return (<>
            <button className="selectCells lowOpacity" id="submitAndConfirmLong" onClick={() => {
                }}>Create Account</button></>)
        }
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

    switch(tracker)
    {
        case "":
            return (
                <>
                    <h1>Welcome to Idea Oasis</h1>
                    <div className="selectGridSmall">
                            <input placeholder="Username" value={username} onChange={handleChangeUsername}></input>
                            <input placeholder="Password" value={password} onChange={handleChangePassword}></input>
                        
                        {connectionError()}
                        {loginButton()}
                        <br></br>
                        <p1>or</p1>
                        <button className="selectCells" id="submitAndConfirmLong" onClick={() => {
                            setTracker("setup")
                        }}>Create Account</button>
                    </div> 
                </>
            )
        case "main":
            return (
            <>
                <h1>Please Enter Your Thoughts Below</h1>
                <div className="selectGrid">
                    {output.map((index, i) => (<div><QuestionAnswer prompt={output[i]} index={i}/></div>))}
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
        case "setup":
            return (<>
            <h1>Welcome to Idea Oasis</h1>
                    <div className="selectGridSmall">
                            <input placeholder="Username" value={username} onChange={handleChangeUsername}></input>
                            <input placeholder="Password" value={password} onChange={handleChangePassword}></input>
                        
                        {connectionError()}
                        {accountButton()}
                    </div> 
            </>)
        default:
            return (<></>)
    }
}

export default Home;