import React, { useState } from 'react';

function GenerationOptionsUI() {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  }

  return (
    <div>
      <button onClick={togglePopup}>Show Popup</button>
      {showPopup && 
        <div className="popup">
          <h2>Popup Title</h2>
          <p>Popup content goes here</p>
          <button onClick={togglePopup}>Close Popup</button>
        </div>
      }
    </div>
  );
}

export default GenerationOptionsUI;