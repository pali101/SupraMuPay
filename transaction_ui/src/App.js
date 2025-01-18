import React, { useState } from 'react';
import './App.css';
import './animations.css';
import owlImage from './assets/owl.png'; // Add an owl image in the public/assets folder
import letterImage from './assets/letter.png'; // Add a letter image in the public/assets folder

function App() {
  const [coins, setCoins] = useState(0);
  const [lettersReceived, setLettersReceived] = useState(0);
  const [deliveryInProgress, setDeliveryInProgress] = useState(false);

  const handleSendCoins = () => {
    if (coins <= 0 || deliveryInProgress) return;

    setDeliveryInProgress(true);
    setLettersReceived(0);

    const totalParts = 10;
    const delay = 500; // Delay between each delivery in ms
    let currentPart = 0;

    const interval = setInterval(() => {
      currentPart++;
      setLettersReceived(currentPart);

      if (currentPart === totalParts) {
        clearInterval(interval);
        setDeliveryInProgress(false);
      }
    }, delay);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🦉 Harry Potter Owl Delivery System</h1>
        <div className="input-section">
          <label htmlFor="coin-input">Enter Coins to Send:</label>
          <input
            id="coin-input"
            type="number"
            value={coins}
            onChange={(e) => setCoins(Number(e.target.value))}
            disabled={deliveryInProgress}
          />
        </div>
        <button onClick={handleSendCoins} disabled={deliveryInProgress || coins <= 0}>
          {deliveryInProgress ? 'Delivery in Progress...' : 'Send Coins'}
        </button>
        <div className="progress-section">
          <p>
            {lettersReceived} / 10 letters received
          </p>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${(lettersReceived / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Owl Animation Section */}
        <div className="animation-section">
          <img
            src={owlImage}
            alt="Owl"
            className={`owl-image ${deliveryInProgress ? 'owl-flying' : ''}`}
          />
          <div className="letterbox">
            <img src={letterImage} alt="Letter" className="letter-image" />
            <p>Dumbledore's Letterbox</p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;