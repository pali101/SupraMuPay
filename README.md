# μP2P
In today's world, one can find oneself stuck in service contracts which are defined by the corporate greed rather than your requirements. We intend to solve this by giving back control to you, the user. Our micro-transactions solution lets you granularise and adapt these service contracts to your needs, whether your need is for a few seconds or a couple of hours. Take your WiFi service contract for example, you are forced to pay on a monthly/yearly basis even though you might use it for a few minutes/hours. Our solution allows you to track this usage at a very granular level and pay only for what you have used. This provides you with the freedom you deserve, while ensuring more trust between you and the service provider.

## Contract
The key insight behind the scheme is to replace resource-hungry PKI operations with hash functions to reduce on-chain cost. Our contract facilitates decentralized payments using hashchains for token validation between payers and merchants.

##### Core Features:
- Channel creation: Users create channels with a trust anchor, locked Ether, and token parameters.
- Channel Redemption: Merchants redeem tokens, validated by the Utility contract. Contract sends proportional payment and refunds any remaining balance.
- Token Validation: Uses hashchains for secure, trustless token verification.

The process flow of interactions between the client, server, and smart contract is described in the following diagrams:

<img src="InteractionDiagram.png" alt="Hash Chain-Based Scheme" width="500"/>

This contract ensures secure, efficient, and trustless micro transactions for decentralized applications.


This is the frontend UI for the Transaction app, built using React and TypeScript. Follow the instructions below to set up the project on your local machine.

Prerequisites
Before starting, make sure you have the following installed:

Node.js (npm comes bundled with Node.js)
TypeScript
If you don’t have these installed, please download and install them first.

Setup
Clone the repository
Clone this repository to your local machine using Git:

bash
Copy
git clone https://github.com/pali101/SupraMuPay.git
cd SupraMuPay/transaction_ui
Install dependencies
Run the following command to install all required dependencies:

bash
Copy
npm install
Start the project
Once the installation is complete, run the following command to start the project:

bash
Copy
npm start
This will start the development server and open the application in your default browser. The app will typically be available at http://localhost:3000.

Troubleshooting
If you encounter any issues, ensure that Node.js and TypeScript are correctly installed on your system.

You can verify the installed versions by running:

bash
Copy
node -v
tsc -v
License
This project is licensed under the MIT License - see the LICENSE file for details.
