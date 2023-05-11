import '../CSS/Test.css';
//
import GenerationOptionsUI from '../components/generateUI';



function Tab_oasis_notes(options) {

    return (
        <div className="backGround">
            <p>NOTES!!</p>
            <GenerationOptionsUI openUIByDefault={options.openUIByDefault} titleValue={options.titleValue}/>
        </div>
    );
}

export default Tab_oasis_notes;