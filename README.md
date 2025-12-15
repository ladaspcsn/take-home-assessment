# Healthcare Data Management Platform

A blockchain-integrated healthcare data management system built with the MERN stack, featuring patient record management, consent tracking with MetaMask signatures, and real-time analytics.

## 🚀 Features

### Core Functionality
- **Patient Management** - Browse, search, and view patient records with pagination
- **Patient Details** - Comprehensive patient information and medical record history
- **Consent Management** - Create and manage healthcare consents with blockchain verification
  - MetaMask signature integration
  - Real-time consent status tracking
  - Blockchain transaction hash verification

### Enhanced Features 
- **Statistics Dashboard** - Real-time platform analytics with visual progress indicators
- **Transaction History** - Complete blockchain transaction log with filtering capabilities
- **Web3 Integration** - Seamless wallet connection and signature workflows

## 🛠️ Tech Stack

**Frontend:**
- React 18
- ethers.js v6 (Web3 integration)
- MetaMask browser extension
- Modern CSS with responsive design

**Backend:**
- Node.js
- Express.js
- RESTful API architecture

**Blockchain:**
- Ethereum-compatible wallet integration
- Digital signature verification
- Transaction hash tracking

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- npm or yarn
- MetaMask browser extension installed
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ladaspcsn/take-home-assessment
cd take-home-assessment
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Start the Backend Server

```bash
cd backend
npm start
```

The backend will run on `http://localhost:5000`

### 5. Start the Frontend Application

Open a new terminal:

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

### 6. Connect MetaMask

Click the "Connect MetaMask" button in the top-right corner and approve the connection.

## 📱 Application Structure

```
take-home-assessment/
├── backend/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PatientList.js
│   │   │   ├── PatientDetail.js
│   │   │   ├── ConsentManagement.js
│   │   │   ├── StatsDashboard.js
│   │   │   ├── TransactionHistory.js
│   │   │   └── WalletConnection.js
│   │   ├── hooks/
│   │   │   └── useWeb3.js
│   │   ├── services/
│   │   │   └── apiService.js
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🎯 Key Features Explained

### Patient List Component
- **Pagination**: Navigate through patient records 12 at a time
- **Search**: Real-time search with debouncing (500ms delay)
- **Responsive Grid**: Automatically adjusts to screen size
- **Click Navigation**: Click any patient card to view details

### Patient Detail Component
- **Comprehensive Info**: Name, ID, DOB, gender, contact, address, wallet
- **Medical Records**: Display all associated medical records
- **Copy Wallet**: Click wallet address to copy to clipboard
- **Back Navigation**: Return to patient list

### Consent Management Component
- **Create Consents**: Sign consent forms with MetaMask
- **Filter by Status**: View all, active, or pending consents
- **Update Status**: Approve or revoke pending consents
- **Blockchain Verification**: Display transaction hashes for verified consents

### Statistics Dashboard
- **Real-time Metrics**: Platform-wide statistics
- **Visual Progress Bars**: Consent status breakdown
- **Color-coded Cards**: Quick insights with gradient backgrounds
- **Auto-refresh**: Updates every 30 seconds

### Transaction History
- **Complete Log**: All blockchain transactions
- **Wallet Filtering**: Filter by connected wallet address
- **Copy Functionality**: Click to copy transaction hashes and addresses
- **Type Badges**: Visual indicators for transaction types

## 🔐 Web3 Integration

This application uses MetaMask for:
- Wallet connection and account management
- Message signing for consent creation
- Signature verification on the backend
- Transaction tracking and display

### Signing Flow
1. User fills out consent form
2. Application generates a message: `"I consent to: {purpose} for patient: {patientId}"`
3. MetaMask prompts user to sign the message
4. Signed message is sent to backend for verification
5. Consent is created and stored with signature

## 🎨 Design Highlights

- **Modern UI**: Clean, professional interface with gradient accents
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Loading States**: Visual feedback during data fetching
- **Error Handling**: User-friendly error messages
- **Hover Effects**: Interactive elements with smooth transitions
- **Color Coding**: Consistent color scheme for statuses and types

## 🧪 Testing the Application

### Test Patient IDs
Use these patient IDs when creating consents:
- `patient-001` through `patient-020`

### Test Wallet Connection
1. Ensure MetaMask is installed and unlocked
2. Click "Connect MetaMask"
3. Approve the connection in the popup
4. Your wallet address will appear in the header

### Test Consent Creation
1. Navigate to "Consents" tab
2. Click "Create New Consent"
3. Enter a patient ID (e.g., `patient-001`)
4. Select a purpose from the dropdown
5. Click "Sign & Create Consent"
6. Approve the signature in MetaMask
7. New consent appears in the list

## 📊 API Endpoints Used

- `GET /api/patients` - List patients (with pagination and search)
- `GET /api/patients/:id` - Get patient details
- `GET /api/records/patient/:patientId` - Get patient medical records
- `GET /api/consents` - List consents (with status filter)
- `POST /api/consents` - Create new consent (requires signature)
- `PUT /api/consents/:id` - Update consent status
- `GET /api/transactions` - List blockchain transactions
- `GET /api/health/stats` - Get platform statistics

## 🚧 Known Limitations

- This is a frontend implementation with a mock backend
- Blockchain transactions are simulated (not on a real blockchain)
- No authentication/authorization implemented
- Data is not persisted (resets on server restart)

## 🎓 Skills demonstrated

Through this project, I demonstrated:
- React hooks (useState, useEffect) for state management
- Web3 integration with ethers.js and MetaMask
- RESTful API consumption
- Component-based architecture
- Responsive CSS design
- Error handling and loading states
- Asynchronous JavaScript (async/await)
- User experience best practices

## 📝 Notes

- All patient data is mock data for demonstration purposes
- MetaMask signature requests may be rejected by the user
- The application gracefully handles wallet disconnection
- Search functionality includes 500ms debounce for better performance

## 🙏 Acknowledgments

Built as a take-home assessment for AI Healthchains LLC. Special thanks for providing the backend infrastructure and API documentation.

---

**Developer**: Lada Kuprina 
**Date**: December 2025  
**Contact**: ladakuprina@gmail.com
