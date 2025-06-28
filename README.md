# Tendy: The Community-Powered Food Network

**Tendy connects customers directly with local farmers through community-organized group buys, fostering authentic relationships, ensuring fair pricing, and actively reducing food waste.**

This platform was built for the Tendy Hackathon, implementing the core features outlined in the "Tendy - Platform Specification (v2.4)".

[![Live Demo](https://img.shields.io/badge/Live_Demo-View_Here-brightgreen?style=for-the-badge&logo=vercel)](https://your-deployment-link.vercel.app)
[![Interactive Demo](https://img.shields.io/badge/Interactive_Demo-Try_Now-orange?style=for-the-badge&logo=react)](/demo)

---

## ✨ Key Features

This implementation goes beyond the standard MVP to include several key features from the specification:

### 🛒 For Customers:
* **Join Group Buys:** Discover and join public group buys for fresh, local produce
* **Fair & Transparent Pricing:** Clear breakdown of costs, including a **16% commission** (8% buyer fee, 8% farmer deduction) that supports the platform, farmers, and hosts
* **Create Private Groups:** Organize personal bulk orders with friends and family
* **Subscription Management:** Set up recurring deliveries with 5-15% savings
* **Influence Logistics:** Participate in approving host-initiated pickup time changes
* **Dispute Resolution:** Built-in dispute filing and resolution system for quality issues

### 🌱 For Farmers:
* **Tiered Verification System:** Trust-building system with **Tendy Sprout**, **Tendy Verified Harvest**, and **Tendy Landmark Farm** tiers
* **Standard & Waste-Warrior Listings:** Create standard product listings or special **"Waste-Warrior"** boxes (for "Verified Harvest" tier and above) to sell surplus produce and reduce waste
* **Farmer Dashboard:** Comprehensive dashboard showing verification status, earnings analytics, and performance metrics
* **Payout Management:** Transparent 92% revenue share with automatic payout processing
* **Product Management:** Full CRUD operations for product listings with real-time status tracking

### 🏠 For Verified Hosts:
* **Host Reward Engine:** Earn 2% of transaction value for every successful group buy you facilitate
* **Community Management:** Create and manage public groups for your neighborhood
* **Enhanced Dashboard:** Visual dashboard with earnings charts, community growth metrics, and performance analytics
* **Community Boost:** Notify neighbors in your zip code about new group opportunities
* **Time Change Management:** Propose new pickup times with member approval system
* **Delivery Confirmation:** Confirm successful pickups and trigger automatic farmer payouts

### 🔧 Platform Logic:
* **Robust Edge Case Handling:** Demonstrations for handling race conditions (full groups) and farmer-initiated cancellations with automatic refund processing
* **Real-time Notifications:** Comprehensive notification system for all user actions and status changes
* **Payment Authorization Flow:** Secure payment authorization that only charges when groups succeed
* **Design System Adherence:** Clean and consistent UI based on the specification's color palette, typography, and 8-pixel grid system

---

## 🎯 Interactive Demo Features

Experience the complete platform with our **Interactive Demo** that showcases:

### **Multi-Role Experience**
- **Customer Dashboard:** Join groups, manage subscriptions, file disputes
- **Farmer Dashboard:** Manage listings, track earnings, view verification tiers
- **Host Dashboard:** Manage groups, track community growth, use Community Boost

### **Real-time Simulations**
- **Payment Authorization:** See how payments are authorized but not charged until group success
- **Race Conditions:** Experience what happens when the last spot is taken
- **Group Cancellations:** See automatic refund processing in action
- **Time Change Proposals:** Watch real-time member response collection

### **Advanced Features**
- **Waste-Warrior Listings:** Special surplus produce boxes for verified farms
- **Community Boost:** Targeted neighborhood notifications for hosts
- **Subscription Management:** Recurring delivery setup with savings
- **Dispute Resolution:** Complete dispute filing and resolution workflow

---

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/tendy-hackathon.git
   cd tendy-hackathon
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Add your Supabase credentials to .env
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

5. **Access the Interactive Demo:**
   Navigate to `/demo` to experience all user roles and features.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, TypeScript, Vite
* **Styling:** Tailwind CSS with custom design system
* **State Management:** React Context API with optimistic updates
* **Database:** Supabase (PostgreSQL) with Row Level Security
* **Authentication:** Supabase Auth with role-based access control
* **Serverless Functions:** Supabase Edge Functions for Community Boost
* **Icons:** Phosphor Icons for consistent iconography
* **Charts:** Custom chart components for data visualization

---

## 🎨 Design System

The platform implements a comprehensive design system based on the specification:

### **Color Palette**
- **Primary:** Evergreen (#2E4034) - Trust and sustainability
- **Accent:** Harvest Gold (#EAAA00) - Energy and optimism
- **Background:** Parchment (#F9F8F5) - Warmth and approachability
- **Text:** Charcoal (#333333) and Stone (#A3A3A3) for hierarchy

### **Typography**
- **Headings:** Lora serif font for elegance and readability
- **Body:** Inter sans-serif font for modern clarity
- **Consistent scaling:** Following typographic hierarchy

### **Spacing System**
- **8px Grid:** All spacing follows consistent 8px increments
- **Responsive Design:** Mobile-first approach with thoughtful breakpoints

---

## 🏗️ Architecture Highlights

### **Component Organization**
- **Modular Design:** Each component focuses on a single responsibility
- **Reusable Components:** Consistent UI elements across the platform
- **Context-Based State:** Efficient state management with React Context

### **Data Flow**
- **Optimistic Updates:** Immediate UI feedback with server reconciliation
- **Real-time Features:** Live notifications and status updates
- **Error Handling:** Comprehensive error boundaries and user feedback

### **Security & Performance**
- **Row Level Security:** Database-level access control
- **Payment Security:** Authorization-first payment flow
- **Lazy Loading:** Code splitting for optimal performance
- **SEO Optimization:** Server-side rendering ready

---

## 📊 Key Metrics & Analytics

The platform provides comprehensive analytics for all user types:

### **For Hosts**
- Monthly earnings tracking with trend analysis
- Community growth metrics and member engagement
- Group success rates and performance indicators
- Interactive charts for data visualization

### **For Farmers**
- Revenue tracking with 92% payout transparency
- Product performance analytics
- Customer satisfaction ratings
- Verification tier progress tracking

### **For Customers**
- Order history with dispute tracking
- Subscription management with savings calculations
- Group participation analytics
- Community impact metrics

---

## 🌟 Standout Features

### **1. Farmer Verification Tiers**
Three-tier system building trust through progressive verification:
- **Tendy Sprout:** Business license verification
- **Tendy Verified Harvest:** Manual review + ratings
- **Tendy Landmark Farm:** Virtual tour + sustained excellence

### **2. Waste-Warrior Program**
Special listings for surplus produce that help reduce food waste while providing value to customers.

### **3. Community Boost**
Hosts can notify neighbors in their zip code about new group opportunities, building local food networks.

### **4. Smart Payment Flow**
Authorization-first system that only charges when groups succeed, with automatic refunds for cancellations.

### **5. Real-time Collaboration**
Time change proposals with member voting, live notifications, and instant status updates.

---

## 🎯 Hackathon Compliance

This implementation addresses all high-priority requirements from the specification:

✅ **16% Commission Structure** - Transparent fee breakdown  
✅ **Farmer Verification Tiers** - Complete three-tier system  
✅ **Waste-Warrior Listings** - Surplus produce program  
✅ **Host Reward System** - 2% earnings for community hosts  
✅ **Edge Case Handling** - Race conditions and cancellations  
✅ **Enhanced Dashboards** - Data visualization and analytics  
✅ **Design System Compliance** - 8px grid and brand colors  
✅ **Interactive Demo** - Multi-role experience showcase  

---

## 🚀 Future Enhancements

The platform is designed for scalability with planned features:

- **Mobile App:** React Native implementation
- **Advanced Analytics:** Machine learning for demand prediction
- **Expanded Payments:** Multiple payment methods and currencies
- **Social Features:** Community forums and farmer spotlights
- **API Integration:** Third-party logistics and inventory management

---

## 👥 Contributing

This project was built for the Tendy Hackathon. For questions or feedback, please reach out to the development team.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the Tendy Hackathon 2025**

*Connecting communities, supporting farmers, reducing waste - one group buy at a time.*