//


function SingleOasisPreview(props) {


    return (
        props.oases.map((oasis) => (
            <NavLink to={"/oasis/" + oasis._id} className="oasisPreview" activeClassName="oasisPreview active" key={oasis._id} onClick={() => {
                focusOasis();
            }}>
                <div className="content">
                    <div className="title">{oasis.info.title}</div>
                    <div className="desc">
                        - {oasis.settings.sharing} oasis
                        <br></br>
                        - {oasis.stats.size.ideaCount} ideas
                        <br></br>
                        - edited {getHumanizedDate(oasis.stats.state.lastEditDate)}
                    </div>
                </div>
                <div style={{ "display": "flex", "margin-left": "45%" }}>
                    <Tooltip text={oasis.info.description} />
                    {/* <div style={{"position":"relative", "left":"45%", "top":"0%"}}>h</div> */}
                    <button className="alignRight">=</button>
                </div>

            </NavLink>
        ))
    );
}

export default SingleOasisPreview;