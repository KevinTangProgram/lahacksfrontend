import '../CSS/Test.css';
//
import GenerationOptionsUI from '../components/generateUI';



function Tab_oasis_notes(options) {

    return (
        <div className="selectGrid">
            <p>Your Oasis is Empty- Generate some notes!</p>
            <p>Your Oasis is Empty- Generate some notes!</p>
            <p>Your Oasis is Empty- Generate some notes!</p>
            <p>Your Oasis is Empty- Generate some notes!</p>
            <GenerationOptionsUI openUIByDefault={options.openUIByDefault} titleValue={options.titleValue}/>
        </div>
    );
}

export default Tab_oasis_notes;