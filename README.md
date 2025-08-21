# 🏠 Blockchain Web3 based Real Estate Investing

**A revolutionary decentralized real estate investment platform powered by Web3 technology, enabling users to invest in virtual properties using cryptocurrency and MetaMask wallet integration.**

![Real Estate Platform](public/real-estate.png)

## 🌟 **Key Features**

### 🔗 **Web3 Integration**
- **MetaMask Wallet Connection** - Seamless blockchain wallet integration
- **Multi-Wallet Support** - MetaMask, WalletConnect, Coinbase Wallet
- **Real-time Balance Display** - Live ETH balance and network detection
- **Cross-chain Compatible** - Supports multiple blockchain networks

### 💝 **Advanced Property Interaction**
- **Smart Like System** - Blockchain-backed property favorites
- **Persistent User Preferences** - Wallet-specific property tracking
- **Real-time Analytics** - Live property engagement metrics
- **Backend Data Storage** - MongoDB integration for user interactions

### 📊 **Comprehensive Admin Dashboard**
- **Real-time Analytics** - Property likes, user engagement, transaction volume
- **User Management** - Wallet address tracking and user roles
- **Property Management** - Listing status and performance metrics
- **Transaction Monitoring** - Complete order and payment history

### 🎨 **Modern User Experience**
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Smooth Animations** - Framer Motion powered interactions
- **Interactive Property Cards** - Swiper carousels with countdown timers
- **Professional UI/UX** - Bootstrap 5 with custom styling

![Marketplace View](public/marketplace.png)

---

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- MetaMask browser extension
- Git

### **Installation**

```bash
# Clone the repository
git clone <repository-url>
cd blockchain-web3-real-estate-investing

# Install dependencies
npm install

# Set up environment variables
cp server/config/config.env.example server/config/config.env
# Edit config.env with your credentials

# Start development servers
npm run dev  # Starts both frontend and backend
```

### **Access the Application**
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:4000
- 📊 **Admin Dashboard**: http://localhost:3000/dashboard (after wallet connection)

---

## 🏗️ **Architecture Overview**

### **Frontend Stack**
- ⚛️ **React 18** - Modern functional components with hooks
- 🔗 **Web3.js** - Blockchain interaction and wallet integration
- 🎨 **Bootstrap 5** - Responsive UI framework
- 🎬 **Framer Motion** - Smooth animations and transitions
- 🎠 **Swiper.js** - Touch-friendly carousels
- 📱 **React Router** - Client-side routing

### **Backend Stack**
- 🚀 **Node.js + Express** - RESTful API server
- 🍃 **MongoDB + Mongoose** - Document database with ODM
- 🔐 **JWT Authentication** - Secure token-based auth
- 📁 **Cloudinary** - Image upload and management
- 🔒 **bcryptjs** - Password hashing
- 📧 **SendGrid** - Email service integration

### **Blockchain Integration**
- 🦊 **MetaMask API** - Primary wallet integration
- ⛓️ **Web3.js** - Ethereum blockchain interaction
- 🔗 **Multi-chain Support** - Ethereum, Polygon, BSC ready
- 💰 **ETH Transactions** - Cryptocurrency payment handling

---

## 📁 **Project Structure**

```
blockchain-web3-real-estate-investing/
├── 📁 public/                    # Static assets
│   ├── 🖼️ real-estate.png        # Platform screenshots
│   └── 🖼️ marketplace.png       
├── 📁 src/                       # React frontend
│   ├── 📁 components/            # Reusable components
│   │   ├── 🔗 WalletModal.js     # Web3 wallet connection
│   │   └── 📊 AdminDashboard.js  # Analytics dashboard
│   ├── 📁 contexts/              # React Context APIs
│   │   ├── 🌐 Web3Context.js     # Wallet state management
│   │   └── 💖 LikesContext.js    # Property likes system
│   ├── 📁 pages/                 # Page components
│   └── ⚛️ App.js                 # Main application
├── 📁 server/                    # Node.js backend
│   ├── 📁 config/                # Configuration
│   ├── 📁 controllers/           # Business logic
│   │   └── 💖 likesController.js # Likes management
│   ├── 📁 models/                # Database schemas
│   │   └── 💖 Like.js            # Property likes model
│   ├── 📁 routes/                # API endpoints
│   │   └── 💖 likesRoute.js      # Likes API routes
│   └── 📁 middlewares/           # Custom middleware
└── 📄 package.json              # Dependencies
```

---

## 🎯 **Core Functionality**

### **1. Wallet Integration**
```javascript
// Connect to MetaMask
const { connectMetaMask, account, balance } = useWeb3();

// Display wallet info
<Button onClick={connectMetaMask}>
  {connected ? `${balance} ETH - ${shortAddress}` : 'Connect Wallet'}
</Button>
```

### **2. Property Interaction System**
```javascript
// Like/Unlike properties
const { toggleLike, isLiked } = useLikes();

// Smart like button
<i 
  className={isLiked(propertyId) ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart'}
  onClick={() => toggleLike(propertyId)}
/>
```

### **3. Real-time Analytics**
```javascript
// Admin dashboard metrics
const stats = {
  totalLikes: 156,
  uniqueUsers: 89,
  totalVolume: '1,234.56 ETH',
  activeProperties: 45
};
```

---

## 🔧 **Environment Configuration**

### **Required Environment Variables**
```env
# MongoDB Database
MONGO_URI=mongodb://localhost:27017/web3-real-estate

# JWT Authentication
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# Cloudinary (Image Storage)
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# SendGrid (Email Service)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_MAIL=your-email@domain.com

# Application Settings
PORT=4000
NODE_ENV=development
```

---

## 📊 **API Endpoints**

### **User Management**
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User authentication
- `GET /api/user/me` - Get user profile

### **Property Interactions**
- `POST /api/likes` - Add/update property like
- `GET /api/likes/user/:address` - Get user's liked properties
- `GET /api/likes/all` - Get all likes (admin)
- `GET /api/likes/stats` - Analytics data

### **Property Management**
- `GET /api/products` - Get all properties
- `GET /api/product/:id` - Get property details
- `POST /api/admin/product/new` - Create property (admin)

---

## 🎮 **User Journey**

### **For Investors**
1. **Connect Wallet** → Click "Connect Wallet" → Select MetaMask
2. **Browse Properties** → Explore property marketplace
3. **Like Properties** → Save favorites with heart icons
4. **View Portfolio** → Track liked properties and investments
5. **Make Transactions** → Use ETH for property investments

### **For Admins**
1. **Connect Wallet** → Admin wallet connection
2. **Access Dashboard** → Navigate to `/dashboard`
3. **Monitor Analytics** → View real-time platform metrics
4. **Manage Users** → Track user engagement
5. **Property Management** → Monitor property performance

---

## 🚀 **Development Scripts**

```bash
# Development (both frontend & backend)
npm run dev

# Backend only
npm run server

# Frontend only  
npm run client

# Production build
npm run build

# Production start
npm start

# Run tests
npm test
```

---

## 🔐 **Security Features**

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Password Hashing** - bcryptjs for secure password storage
- ✅ **CORS Protection** - Cross-origin request security
- ✅ **Input Validation** - Comprehensive request validation
- ✅ **Wallet Integration** - Blockchain-based user verification
- ✅ **Environment Variables** - Secure configuration management

---

## 🌐 **Deployment**

### **Production Deployment**
```bash
# Build for production
npm run build

# Set production environment
export NODE_ENV=production

# Start production server
npm start
```

### **Docker Deployment** (Optional)
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
```

---

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📜 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **MetaMask** - For Web3 wallet integration
- **MongoDB** - For reliable database storage
- **React** - For the amazing frontend framework
- **Bootstrap** - For responsive UI components
- **Framer Motion** - For smooth animations

---

## 📞 **Contact & Support**

- 🐦 **Twitter**: [@iabhays_](https://x.com/iabhays_)
- 📸 **Instagram**: [@iabhays](https://www.instagram.com/iabhays/)
- 💼 **LinkedIn**: [Abhijeet Kumar](https://www.linkedin.com/in/abhijeetabhay/)

---

**⭐ If you found this project helpful, please give it a star on GitHub!**

**🚀 Ready to revolutionize real estate investment with blockchain technology? Let's build the future together!**
