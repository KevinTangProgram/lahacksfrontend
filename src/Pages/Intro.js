import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
//
import '../CSS/Test.css';
//
function Intro() {
    // Navigation:
    const navigate = useNavigate();
    const newOasis = () => {
        navigate('/oasis/' + uuidv4());
    }

    return (
        <div className="backGround alignCenter">
            <h1>Idea Oasis</h1>
            <h2> - Taking Notes, reimagined.</h2>
            <h2> - A New Style of NoteTaking.</h2>
            <br></br>
            <button className="debugger-popup-button"
            onClick = {newOasis}> Try Now </button>
            <br></br>
            <button className="debugger-popup-button"
            onClick = {() => {navigate('/home'); }}> Home </button>
        </div>
    );
}

export default Intro;