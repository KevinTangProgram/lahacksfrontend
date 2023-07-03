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
                    </div>
                </div>
                
                
            </div>
        </>
    );
}

export default Intro;