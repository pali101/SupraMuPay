import React, { useState } from 'react';
import Sparkle from 'react-sparkle'

import './App.css';
import './animations.css';
import owlImage from './assets/owl.png';
import letterImage from './assets/letter.png';

let N = 100; // Global variable for total remaining amount

function App() {
  const [coins, setCoins] = useState(0); // Coins to send
  const [tripProgress, setTripProgress] = useState(0); // Progress for each trip
  const [deliveryInProgress, setDeliveryInProgress] = useState(false); // Block actions during delivery
  const [remainingAmount, setRemainingAmount] = useState(N); // Track the remaining global balance
  const [flightCount, setFlightCount] = useState(0); // Track current flight
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // Control success pop-up visibility

  const sendOwl = (trips) => {
    let currentFlight = 0;

    const interval = setInterval(() => {
      currentFlight++;
      setFlightCount(currentFlight); // Update flight number for the animation

      // Simulate trip progress for each trip (0 -> 100%)
      let tripProgress = 0;
      const totalDuration = 2000; // Duration of one trip in ms
      const stepDuration = 200; // Update progress every 100ms
      const progressStep = 100 / (totalDuration / stepDuration); // Step size to reach 100%

      const progressInterval = setInterval(() => {
        tripProgress += progressStep; // Increment by calculated step
        setTripProgress(Math.min(tripProgress, 100)); // Ensure it doesn't exceed 100%

        if (tripProgress >= 100) {
          clearInterval(progressInterval); // Stop when progress reaches 100%
        }
      }, stepDuration);

      // Update global remaining amount after completing the current trip
      setRemainingAmount((prev) => prev - 10);

      // Stop after all trips
      if (currentFlight === trips) {
        clearInterval(interval);

        // Show success message briefly
        setTimeout(() => {
          setShowSuccessMessage(true);
          setDeliveryInProgress(false); // Unlock the form
        }, 1000);
      }
    }, 2000); // 1-second delay between trips
  };


  const handleSendCoins = () => {
    if (coins <= 0 || deliveryInProgress || coins > remainingAmount) return;

    const trips = Math.floor(coins / 10); // Determine the number of trips (10 coins per trip)

    if (trips > 0) {
      setDeliveryInProgress(true); // Lock the form
      setTripProgress(0); // Reset progress for each trip
      setFlightCount(0); // Reset the owl's flight count
      setShowSuccessMessage(false); // Reset success pop-up
      sendOwl(trips); // Start the trips
    }
  };

  return (
    <div className="App">
      <header className="App-Body">
        <nav className="navbar">
          <Sparkle
            color={'#FFF'}
            count={250}

            minSize={2}
            maxSize={6}
            overflowPx={10}

            // How quickly sparkles disappear
            fadeOutSpeed={70}
            // Whether we should create an entirely new sparkle when one
            // fades out. If false, we'll just reset the opacity, keeping
            // all other attributes of the sparkle the same.
            newSparkleOnFadeOut={true}
            flicker={true}
            // One of: 'slowest', 'slower', 'slow', 'normal', 'fast', 'faster', 'fastest'
            flickerSpeed={'slower'}
          />
        </nav>

        <h1>LUMAS TRANSACTION - Make it happen!</h1>

        {/* Input Section */}
        <div className="input-section">
          <label htmlFor="coin-input">Enter amount to Send:</label>
          <input
            id="coin-input"
            type="number"
            value={coins}
            onChange={(e) => setCoins(Number(e.target.value))}
            disabled={deliveryInProgress}
          />
          <button
            className="send-button"
            onClick={handleSendCoins}
            disabled={deliveryInProgress || coins <= 0 || coins > remainingAmount}
          >
            {deliveryInProgress ? 'Delivery in Progress...' : 'Send'}
          </button>
        </div>

        {/* Progress Section */}
        {deliveryInProgress && (
          <div className="progress-section">
            <p>{tripProgress.toFixed(0)}%</p>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${tripProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="success-message">
            <p>🎉 Amount Sent Successfully: {coins} Coins! 🎉</p>
          </div>
        )}

        {/* Animation Section */}
        <div className="animation-section">
          <img
            src={owlImage}
            alt="Owl"
            className={`owl-image ${flightCount > 0 ? 'owl-flying' : ''}`}
            style={{
              animationDuration: '2s', // Match this to the interval duration
              animationDelay: `${(flightCount - 1) * 2}s`, // Delay for each trip
              animationPlayState: 'running', // Ensure the animation plays fully each trip
            }}
          />


          <div className="letterbox">
            <img src={letterImage} alt="Letter" className="letter-image" />
            <p>Dumbledore</p>

            {/* Remaining Amount Section */}
            <div className="global-progress-section">
              <p>Remaining Amount: {remainingAmount}</p>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${(remainingAmount / N) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
