# Web3TV

Web3TV is a decentralized movie platform built on the **Mantle APAC Chain**, developed during the **Gaia Autonomous Hackathon**. The platform offers a secure and fair way to upload, purchase, and watch movies using blockchain and NFT technology. 

## Key Features

### Admin Side
1. **Movie Encryption & Upload:** Movies are encrypted using **CryptoJS** for added security and uploaded to the **IPFS** network.
2. **Blockchain Integration:** Metadata and movie details are stored on the **Mantle APAC Chain** after a transaction confirmation via MetaMask.

### User Side
1. **NFT-based Ownership:** Users can purchase movies and receive an **NFT** as proof of ownership, enabling access to the content.
2. **Secure Access Control:** Only the buyer who holds the NFT can decrypt and watch the movie, preventing unauthorized sharing or piracy.
3. **Chatbot Integration:** A chatbot powered by **Gaia.ai** is integrated to assist users with detailed information about movies, ensuring an engaging experience.

### Future Enhancements
1. **Content Authenticity Protocol:** Developing a system to verify the authenticity of content and publishers for trust and security.
2. **Improved User Experience:** Refining the platform interface and features for seamless navigation and functionality.

## Progress During Hackathon

### Week 1: Ideation and Setup
- Defined the project concept and finalized the use of **Mantle APAC Chain** and **IPFS**.
- Planned the core functionalities for both admin and user sides.

### Week 2: Admin Side Development
- Built functionality to encrypt movies using **CryptoJS**.
- Successfully integrated IPFS for decentralized storage.
- Enabled MetaMask transactions for storing movie metadata on the blockchain.

### Week 3: User Side and Chatbot Integration
- Developed a user flow for purchasing movies with blockchain payments.
- Implemented NFT issuance for movie ownership.
- Integrated a **Gaia.ai-powered chatbot** to provide movie-related information to users.

### Week 4: Security and Future Development
- Implemented secure decryption using NFTs for authorized movie access.
- Added a system to prevent unauthorized viewing even if the NFT is transferred.
- Began developing the protocol for verifying content and publisher authenticity.

## How It Works
1. **Uploading a Movie:**
   - Admin encrypts the movie with **CryptoJS** and uploads it to **IPFS**.
   - MetaMask is used to confirm the transaction, and the movie details are stored on the **Mantle APAC Chain**.

2. **Purchasing a Movie:**
   - Users can browse movies and purchase them using blockchain payments.
   - After confirming the transaction, users receive an NFT, which grants access to the movie.

3. **Watching a Movie:**
   - The platform decrypts the movie using the NFT and data from the blockchain.
   - Only the buyer can access the movie, ensuring secure and fair use.

4. **Chatbot Assistance:**
   - Users can interact with the **Gaia.ai-powered chatbot** to get detailed information about movies, including genres, cast, and ratings.

## Tech Stack
- **Blockchain:** Mantle APAC Chain
- **Storage:** IPFS
- **Encryption:** CryptoJS
- **Payments & Wallet:** MetaMask
- **Chatbot:** Gaia.ai

## Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/Ayushsingla1/gaia-autonomous-web3tv.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Ensure you have MetaMask installed and connected to the Mantle Sepolia testnet.

## Future Goals
- Launch the content authenticity protocol.
- Expand the chatbot capabilities for enhanced user interaction.
- Optimize the platform for scalability and a broader audience.


We hope Web3TV will revolutionize how movies are distributed and consumed in the Web3 era. Join us in building a fair, secure, and decentralized future for entertainment!

