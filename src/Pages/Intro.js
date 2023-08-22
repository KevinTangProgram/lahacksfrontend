import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import { OasisManager } from '../utilities/oasisManager';
import { useState } from 'react';
//
import '../CSS/Test.css';
//
function Intro() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    // Try Now:
    const navigate = useNavigate();
    const newOasis = () => {
        OasisManager.createNewOasis("My Oasis", "Trying out idea oasis!")
            .then((response) => {
                setLoading(false);
                navigate('/oasis/' + response);
            })
            .catch(error => {
                setLoading(false);
                setError(error);
            })
    }

    return (
        <>
            <video autoPlay="autoPlay" muted style={{"width": "100%", "height": "99.5vh", "object-fit": "cover"}}>
                <source src="/images/icons/waves.mp4" type="video/mp4" />
            </video>
            <div className="introduction">
                <h1 className="firstHeader">Idea Oasis</h1>
                <h2 className="secondHeader">Taking Notes, reimagined</h2>
                <h2 className="thirdHeader">A New Style of Notetaking</h2>
                <div style={{"display": "flex", "width": "100%", "margin-left": "auto", "margin-right": "auto"}}>
                    <div style={{"margin-left": "auto", "margin-right": "auto"}}>
                        <button className="hover-underline-animation" style={{"margin-left": "20px", "margin-right": "20px"}} onClick = {newOasis}> Try Now </button>
                        <button className="hover-underline-animation" style={{"margin-left": "20px", "margin-right": "20px"}} onClick = {() => {navigate('/home'); }}> Home </button>
                        {/* Error Display: */}
                        {error && <p className="loginTextboxError">{error}</p>}
                        {/* Loading Display: */}
                        {loading && <div className="loader"></div>}
                    </div>
                </div>
                
                
            </div>
        </>
    );
}

export default Intro;