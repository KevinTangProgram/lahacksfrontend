import { Helmet } from "react-helmet";


function FourOFour() {
    return (
        <div className="container404 background">
            <Helmet>
                <title>404 - Idea Oasis</title>
            </Helmet>
            <div className="content404">
                <span className="number404">4</span>
                <img className="logo404" src="/images/icons/iconLogo.png" alt="0"></img>
                <span className="number404">4</span>
            </div>
            <div className="content404">
                <p className="errorMessage404">Oops! It looks like you took a wrong turn. The page you're looking for isn't here. </p>
            </div>
            <div className="content404">
                <div className="return-button-container404">
                    <a href="/" className="return-button404">Return to Home</a>
                </div>
            </div>
        </div>
    );
}

export default FourOFour;