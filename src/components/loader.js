//
import '../CSS/Utils.css';


function Loader() {
    if (!props.type || props.type === "icon")
    return (
        // Singular Loading Icon:
        <div className="iconLoading"></div>
    );
    if (props.type === "fill")
    return (
        // Overlay the entire screen:
        <div class="loading-fill-overlay">
            <div class="loading-fill-animation"></div>
        </div>
    );
    if (props.type === "content")
    return (
        // Fill content to parent element size:
        <div className="backGround" style={{ "alignItems": "center" }}>
            <br></br>
            <div className="loading-content-background">
                <div className="loading-content-content">
                    <div className="loading-content-loader1">
                    </div>
                    <div className="loading-content-loader2">
                    </div>
                    <div className="loading-content-loader3">
                        <div className="loading-content-subloader"></div>
                        <div className="loading-content-subloader"></div>
                        <div className="loading-content-subloader"></div>
                        <div className="loading-content-subloader"></div>
                        <div className="loading-content-subloader"></div>
                    </div>
                </div>
            </div>
        </div>
        );

    return (
        <div className="backGround">hello</div>
    );
};

export default Loader;