import React, { useState } from 'react';
import axios from 'axios';

function Home()
{
    const [error, setError] = useState(false);
    const [responseTime, setResponseTime] = useState(false);
    const [input, setInput] = useState([]);
    const [shortInput, setShortInput] = useState("");
    const [output, setOutput] = useState([]);

    const handleChangeInput = (event) => {setShortInput(event.target.value);}

    const URL = "http://localhost:8080";

    function sendInput()
    {
        setResponseTime(true);
        let sentMessage = "";
        for (let i = 0; i < input.length; i++)
        {
            sentMessage += input[i] + ' ';
        }
        axios.get(URL + "/api/cohere", {
            params: {input: sentMessage + ' ' + shortInput},
        })
        .then (response => {
            let newOutput = output;
            newOutput.push(sentMessage + ' ' + shortInput);
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
    function searchButton(first = true)
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

    function QuestionAnswer({prompt, index})
    {
        if (index % 2 === 0)
        {
            return (
                <>
                    <div className="confirmGrid">
                        <p1>Prompt:</p1>
                        <p1>{prompt}</p1>
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

    function Thoughts({prompt, index})
    {
        return (<>
            <p1>{prompt}</p1>
            <br></br>
        </>)
    }

    return (
    <>
        <h1>Welcome to Idea Oasis</h1>
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
            
            {connectionError()}
            {searchButton()}
        </div>
        
        
    </>)
}

export default Home;