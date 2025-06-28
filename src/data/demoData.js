// src/data/demoData.js

export const initialUsers = {
  "user-001": { 
    id: "user-001", 
    email: "customer@tendy.com", 
    role: "customer",
    name: "Alex Smith",
    avatar: "https://i.pravatar.cc/80?img=1",
    joinDate: "2024-08-15"
  },
  "user-002": { 
    id: "user-002", 
    email: "host@tendy.com", 
    role: "host",
    name: "Charles Green",
    avatar: "https://i.pravatar.cc/80?img=10",
    joinDate: "2024-07-20",
    verificationStatus: "Completed",
    groupsHosted: 15,
    totalMembersServed: 127,
    hostRating: 4.9
  },
  "user-003": { 
    id: "user-003", 
    email: "farmer@tendy.com", 
    role: "farmer",
    name: "Diana Prince",
    farmName: "Sunrise Organics",
    avatar: "https://i.pravatar.cc/80?img=3",
    joinDate: "2024-06-10",
    verificationTier: "Level 1: Tendy Sprout",
    businessLicenseVerified: true
  },
  "user-004": { 
    id: "user-004", 
    email: "farmer2@tendy.com", 
    role: "farmer",
    name: "Edward Kent",
    farmName: "Green Valley Produce",
    avatar: "https://i.pravatar.cc/80?img=5",
    joinDate: "2024-05-15",
    verificationTier: "Level 2: Tendy Verified Harvest",
    businessLicenseVerified: true,
    manualReviewCompleted: true,
    averageRating: 4.8
  },
  "user-005": { 
    id: "user-005", 
    email: "farmer3@tendy.com", 
    role: "farmer",
    name: "Fiona Glenanne",
    farmName: "Landmark Heritage Farm",
    avatar: "https://i.pravatar.cc/80?img=9",
    joinDate: "2024-04-20",
    verificationTier: "Level 3: Tendy Landmark Farm",
    businessLicenseVerified: true,
    manualReviewCompleted: true,
    virtualTourCompleted: true,
    averageRating: 4.9
  }
};

export const initialProducts = {
  "prod-001": {
    id: "prod-001",
    title: "Organic Gala Apples - 2kg Bag",
    description: "Crisp, sweet, and juicy Gala apples, freshly picked from Sunrise Organics. Perfect for snacking and baking.",
    price: 8.50,
    originalPrice: 12.00,
    weight: "2kg bag",
    imageUrl: "https://images.unsplash.com/photo-1593280424033-4c969b854817?q=80&w=2940&auto=format&fit=crop",
    farmerId: "user-003",
    isWasteWarrior: false,
    spotsTotal: 20,
    daysLeft: 5,
    status: "active"
  },
  "prod-002": {
    id: "prod-002",
    title: "Heirloom Tomatoes - 1kg",
    description: "A colorful mix of our best heirloom tomatoes. Incredible flavor that you won't find in a supermarket.",
    price: 6.00,
    originalPrice: 9.00,
    weight: "1kg mix",
    imageUrl: "https://images.unsplash.com/photo-1588650364232-38997a78336b?q=80&w=2940&auto=format&fit=crop",
    farmerId: "user-003",
    isWasteWarrior: false,
    spotsTotal: 30,
    daysLeft: 3,
    status: "active"
  },
  "prod-003": {
    id: "prod-003",
    title: "Free-Range Eggs - Dozen",
    description: "Farm fresh, large brown eggs from our happy, free-range chickens at Green Valley Produce.",
    price: 5.25,
    originalPrice: 7.50,
    weight: "dozen",
    imageUrl: "https://images.unsplash.com/photo-1587486913049-52fc082a934b?q=80&w=2894&auto=format&fit=crop",
    farmerId: "user-004",
    isWasteWarrior: false,
    spotsTotal: 40,
    daysLeft: 2,
    status: "active"
  },
  "prod-004": {
    id: "prod-004",
    title: "Sourdough Bread - Large Loaf",
    description: "Naturally leavened sourdough, baked fresh in our farm kitchen. Crusty on the outside, soft on the inside.",
    price: 7.00,
    originalPrice: 10.00,
    weight: "large loaf",
    imageUrl: "https://images.unsplash.com/photo-1533083328223-2396395d8523?q=80&w=2940&auto=format&fit=crop",
    farmerId: "user-004",
    isWasteWarrior: false,
    spotsTotal: 15,
    daysLeft: 6,
    status: "active"
  },
  "prod-005": {
    id: "prod-005",
    title: "Farmer's Surplus Selection - Medium Box",
    description: "🌱 WASTE-WARRIOR LISTING: Help us reduce food waste! This box contains a surprise mix of cosmetically imperfect but perfectly delicious and fresh produce from our harvest this week.",
    price: 15.00,
    originalPrice: 25.00,
    weight: "approx. 5-7kg",
    imageUrl: "https://images.unsplash.com/photo-1598254505245-5ecd46d79a24?q=80&w=2940&auto=format&fit=crop",
    farmerId: "user-005",
    isWasteWarrior: true,
    spotsTotal: 10,
    daysLeft: 4,
    status: "active"
  },
  "prod-006": {
    id: "prod-006",
    title: "Raw Wildflower Honey - 500g Jar",
    description: "Pure, unfiltered honey from our heritage farm's beehives. Each jar captures the essence of our wildflower meadows.",
    price: 18.00,
    originalPrice: 24.00,
    weight: "500g jar",
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800&auto=format&fit=crop",
    farmerId: "user-005",
    isWasteWarrior: false,
    spotsTotal: 25,
    daysLeft: 8,
    status: "active"
  }
};

export const initialGroups = {
  "group-001": {
    id: "group-001",
    productId: "prod-001",
    hostId: "user-002",
    moq: 20,
    currentOrders: 15,
    members: ["user-001"],
    status: "Active",
    pickupTime: "Saturday, 4:00 PM - 6:00 PM",
    proposedTime: null,
    memberResponses: []
  },
  "group-002": {
    id: "group-002",
    productId: "prod-002",
    hostId: "user-002",
    moq: 30,
    currentOrders: 27,
    members: ["user-001"],
    status: "Active",
    pickupTime: "Sunday, 2:00 PM - 4:00 PM",
    proposedTime: null,
    memberResponses: []
  },
  "group-003": {
    id: "group-003",
    productId: "prod-003",
    hostId: null, // No host - direct from farmer
    moq: 40,
    currentOrders: 38,
    members: [],
    status: "Active",
    pickupTime: "Friday, 6:00 PM - 8:00 PM",
    proposedTime: null,
    memberResponses: []
  },
  "group-004": {
    id: "group-004",
    productId: "prod-004",
    hostId: null,
    moq: 15,
    currentOrders: 9,
    members: [],
    status: "Active",
    pickupTime: "Thursday, 5:00 PM - 7:00 PM",
    proposedTime: null,
    memberResponses: []
  },
  "group-005": {
    id: "group-005",
    productId: "prod-005",
    hostId: null,
    moq: 10,
    currentOrders: 4,
    members: [],
    status: "Active",
    pickupTime: "Wednesday, 3:00 PM - 5:00 PM",
    proposedTime: null,
    memberResponses: []
  },
  "group-006": {
    id: "group-006",
    productId: "prod-006",
    hostId: null,
    moq: 25,
    currentOrders: 5,
    members: [],
    status: "Active",
    pickupTime: "Saturday, 10:00 AM - 12:00 PM",
    proposedTime: null,
    memberResponses: []
  }
};

export const initialSubscriptions = {
  "sub-001": {
    id: "sub-001",
    userId: "user-001",
    productId: "prod-002",
    productName: "Heirloom Tomatoes - 1kg",
    farmerName: "Sunrise Organics",
    price: 6.00,
    deliveryFrequency: "Weekly",
    nextDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Active",
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1588650364232-38997a78336b?q=80&w=2940&auto=format&fit=crop",
    totalDeliveries: 3,
    remainingDeliveries: 9
  },
  "sub-002": {
    id: "sub-002",
    userId: "user-001",
    productId: "prod-003",
    productName: "Free-Range Eggs - Dozen",
    farmerName: "Green Valley Produce",
    price: 5.25,
    deliveryFrequency: "Bi-Weekly",
    nextDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Active",
    startDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    imageUrl: "https://images.unsplash.com/photo-1587486913049-52fc082a934b?q=80&w=2894&auto=format&fit=crop",
    totalDeliveries: 2
  }
};

export const initialDisputes = {
  "dispute-001": {
    id: "dispute-001",
    orderId: "order-123",
    productName: "Organic Heirloom Tomatoes",
    farmerName: "Rodriguez Farms",
    reason: "Quality Issue",
    comments: "The tomatoes were not ripe and had several soft spots. They appeared to be overripe rather than fresh as advertised.",
    status: "OPEN",
    priority: "MEDIUM",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@example.com"
  },
  "dispute-002": {
    id: "dispute-002",
    orderId: "order-456",
    productName: "Free-Range Eggs - Dozen",
    farmerName: "Green Valley Produce",
    reason: "Missing Item",
    comments: "I only received 10 eggs instead of the full dozen. The carton was damaged during pickup.",
    status: "UNDER_REVIEW",
    priority: "LOW",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    customerName: "Mike Chen",
    customerEmail: "mike.chen@example.com"
  }
};

export const initialNotifications = [];