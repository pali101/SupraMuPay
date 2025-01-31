import React, { useState } from "react";
import Sparkle from "react-sparkle";
import WalletConnection from "./components/walletConnect.tsx";
import { redeemChannel } from "./functions/redeemChannel.ts"; // import redeemChannel function
import { createChannel } from "./functions/createChannel.ts"; // import createChannel function
import { getProvider } from "./components/walletConnect.tsx";
import "./App.css";
import "./animations.css";
import harryImage from "./assets/harry.gif";
import owlImage from "./assets/owl_flying.gif";
import letterImage from "./assets/letter.png";
import dumbledoreImage from "./assets/dumbledore.png";

let N = 100;

function App() {
  const [coins, setCoins] = useState(0);
  const [tripProgress, setTripProgress] = useState(0);
  const [deliveryInProgress, setDeliveryInProgress] = useState(false);
  const [receivedAmount, setreceivedAmount] = useState(0);
  const [flightCount, setFlightCount] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [account, setAccount] = useState(null);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showRedeemChannel, setShowRedeemChannel] = useState(false);
  const [createChannelData, setCreateChannelData] = useState({
    channelName: "",
    totalChannelAmount: "" || "100",
    amount: "",
    trustAnchor: "",
  });
  const [redeemChannelData, setRedeemChannelData] = useState({ redeemHex: "" });

  const sendOwl = (trips) => {
    let currentFlight = 0;

    const interval = setInterval(() => {
      currentFlight++;
      setFlightCount(currentFlight);

      let tripProgress = 0;
      const totalDuration = 2000;
      const stepDuration = 200;
      const progressStep = 100 / (totalDuration / stepDuration);

      const progressInterval = setInterval(() => {
        tripProgress += progressStep;
        setTripProgress(Math.min(tripProgress, 100));

        if (tripProgress >= 100) {
          clearInterval(progressInterval);
        }
      }, stepDuration);

      setreceivedAmount((prev) => prev + 10);

      if (currentFlight === trips) {
        clearInterval(interval);

        setTimeout(() => {
          setShowSuccessMessage(true);
          setTimeout(() => {
            setShowSuccessMessage(false);
          }, 3000);
          setDeliveryInProgress(false);
        }, 1000);
      }
    }, 2000);
  };

  const handleSendCoins = () => {
    if (coins <= 0 || deliveryInProgress || coins > 100 - receivedAmount)
      return;

    const trips = Math.floor(coins / 10);

    if (trips > 0) {
      setDeliveryInProgress(true);
      setTripProgress(0);
      setFlightCount(0);
      setShowSuccessMessage(false);
      sendOwl(trips);
    }
  };

  const toggleCreateChannel = () => {
    setShowCreateChannel(!showCreateChannel);
  };

  const toggleRedeemChannel = () => {
    setShowRedeemChannel(!showRedeemChannel);
  };

  const handleCreateChannel = async () => {
    const { merchantAddress, amount, totalChannelAmount, trustAnchor } =
      createChannelData;

    if (merchantAddress && amount && totalChannelAmount && trustAnchor) {
      try {
        // const supraProvider = account; // Assume 'account' contains the wallet provider
        // const merchantAddress = "0x123..."; // Replace with actual merchant address
        // const totalChannelAmount = 1000000; // Replace with actual total channel amount

        // Call the createChannel function
        const supraProvider = await getProvider();
        await createChannel(
          supraProvider,
          merchantAddress,
          parseInt(amount),
          totalChannelAmount,
          trustAnchor
        );
        alert("Channel Created Successfully");
        setShowCreateChannel(false);
      } catch (error) {
        console.error("Create Channel failed:", error);
      }
    } else {
      alert("Please enter valid channel details.");
    }
  };

  const handleRedeemChannel = async () => {
    const { redeemHex } = redeemChannelData;

    if (redeemHex) {
      try {
        // Get the wallet provider (supraProvider from the WalletConnection component)
        const supraProvider = await getProvider();
        await redeemChannel(
          supraProvider,
          redeemHex,
          parseInt(
            (receivedAmount * Number(createChannelData.totalChannelAmount)) /
              100
          )
        );
        setCoins(0);
        setreceivedAmount(0);
        alert("Channel Redeemed Successfully");
        setShowRedeemChannel(false);
      } catch (error) {
        console.error("Redeem Channel failed:", error);
      }
    } else {
      alert("Please enter valid redeem details.");
    }
  };

  return (
    <div className="App">
      <header className="App-Body">
        <nav className="navbar">
          <Sparkle
            color={"#FFF"}
            count={250}
            minSize={2}
            maxSize={6}
            overflowPx={10}
            fadeOutSpeed={70}
            newSparkleOnFadeOut={true}
            flicker={true}
            flickerSpeed={"slower"}
          />
          <div className="wallet-section">
            <WalletConnection account={account} setAccount={setAccount} />
          </div>
          <div className="navbar-buttons">
            <button onClick={toggleCreateChannel}>Create Channel</button>
            <button onClick={toggleRedeemChannel}>Redeem Channel</button>
          </div>
        </nav>

        <h1>LUMAS TRANSACTION - Make it happen!</h1>

        {/* Input Section */}
        <div className="input-section">
          <label htmlFor="coin-input">Enter % amount to Send:</label>
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
            disabled={
              deliveryInProgress || coins <= 0 || coins > 100 - receivedAmount
            }
          >
            {deliveryInProgress ? "Delivery in Progress..." : "Send"}
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

        {/* Success Message as a Toast */}
        {showSuccessMessage && (
          <div className="success-message">Amount Sent Successfully!</div>
        )}

        {/* Animation Section */}
        <div className="animation-section">
          <img src={harryImage} alt="Harry" className="harry-image" />
          <img
            src={owlImage}
            alt="Owl"
            className={`owl-image ${flightCount > 0 ? "owl-flying" : ""}`}
            style={{
              animationDuration: "2s",
              animationDelay: `${(flightCount - 1) * 2}s`,
              animationPlayState: "running",
            }}
          />
          <div className="dumbledore">
            <img src={letterImage} alt="Letter" className="letter-image" />
            <img
              src={dumbledoreImage}
              alt="Dumbledore"
              className="dumbledore-image"
            />
            <div className="global-progress-section">
              <p>Percentage Received: {receivedAmount}</p>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${(receivedAmount / 100) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Create Channel Form Popup */}
      {showCreateChannel && (
        <div className="form-popup">
          <div className="form-content">
            <h2>Create Channel</h2>
            <button className="close-btn" onClick={toggleCreateChannel}>
              X
            </button>
            <form onSubmit={(e) => e.preventDefault()}>
              <label>
                Merchant Address:
                <input
                  type="text"
                  value={createChannelData.merchantAddress}
                  onChange={(e) =>
                    setCreateChannelData({
                      ...createChannelData,
                      merchantAddress: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Total Channel Amount:
                <input
                  type="number"
                  value={createChannelData.totalChannelAmount}
                  onChange={(e) =>
                    setCreateChannelData({
                      ...createChannelData,
                      totalChannelAmount: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Amount:
                <input
                  type="number"
                  value={createChannelData.amount}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    setCreateChannelData({
                      ...createChannelData,
                      amount: newValue,
                    });
                    // setCoins(newValue * 10); // Update coins automatically
                  }}
                />
              </label>
              <label>
                Trust Anchor:
                <input
                  type="text"
                  value={createChannelData.trustAnchor}
                  onChange={(e) =>
                    setCreateChannelData({
                      ...createChannelData,
                      trustAnchor: e.target.value,
                    })
                  }
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  handleCreateChannel();
                  toggleCreateChannel();
                }}
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Redeem Channel Form Popup */}
      {showRedeemChannel && (
        <div className="form-popup">
          <div className="form-content">
            <h2>Redeem Channel</h2>
            <button className="close-btn" onClick={toggleRedeemChannel}>
              X
            </button>
            <form onSubmit={(e) => e.preventDefault()}>
              <label>
                Redeem Hex:
                <input
                  type="text"
                  value={redeemChannelData.redeemHex}
                  onChange={(e) =>
                    setRedeemChannelData({
                      ...redeemChannelData,
                      redeemHex: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                You can redeem{" "}
                {(receivedAmount *
                  Number(createChannelData.totalChannelAmount)) /
                  100}
              </label>
              <button
                type="button"
                onClick={() => {
                  handleRedeemChannel();
                  toggleRedeemChannel();
                }}
              >
                Redeem
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
