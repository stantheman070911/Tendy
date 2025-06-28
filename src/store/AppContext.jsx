// src/store/AppContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  initialUsers, 
  initialProducts, 
  initialGroups, 
  initialSubscriptions,
  initialDisputes,
  initialNotifications
} from '../data/demoData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Core data stores
  const [users, setUsers] = useState(initialUsers);
  const [products, setProducts] = useState(initialProducts);
  const [groups, setGroups] = useState(initialGroups);
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [disputes, setDisputes] = useState(initialDisputes);
  const [notifications, setNotifications] = useState(initialNotifications);
  
  // App state
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- AUTHENTICATION FUNCTIONS ---
  
  const login = (email) => {
    const user = Object.values(users).find(u => u.email === email);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      addNotification(`Welcome back, ${user.name}! You're logged in as a ${user.role}.`, 'success');
      console.log(`🔐 DEMO LOGIN: ${user.name} (${user.role})`);
    } else {
      addNotification("User not found. Please try a different email.", 'error');
    }
  };

  const logout = () => {
    if (currentUser) {
      addNotification(`Goodbye, ${currentUser.name}! You've been logged out.`, 'info');
    }
    setCurrentUser(null);
    setIsLoggedIn(false);
    console.log('🔐 DEMO LOGOUT: User logged out');
  };

  // --- NOTIFICATION SYSTEM ---
  
  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: Date.now()
    };
    
    setNotifications(prev => [notification, ...prev]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // --- GROUP BUY FUNCTIONS ---
  
  const joinGroup = (groupId) => {
    if (!currentUser) {
      addNotification("Please log in to join a group!", 'warning');
      return false;
    }

    const group = groups[groupId];
    if (!group) {
      addNotification("Group not found.", 'error');
      return false;
    }

    // Check if already a member
    if (group.members.includes(currentUser.id)) {
      addNotification("You're already a member of this group!", 'warning');
      return false;
    }

    // Check if group is full
    if (group.currentOrders >= group.moq) {
      addNotification("Sorry! This group is already full.", 'error');
      return false;
    }

    // Join the group
    setGroups(prevGroups => {
      const updatedGroup = { ...prevGroups[groupId] };
      updatedGroup.currentOrders += 1;
      updatedGroup.members.push(currentUser.id);

      // Check if MOQ is met
      if (updatedGroup.currentOrders >= updatedGroup.moq) {
        updatedGroup.status = "Successful";
        addNotification(`🎉 Group buy successful! Your payment has been charged for ${products[updatedGroup.productId].title}`, 'success');
        console.log(`💰 PAYMENT CHARGED: Group ${groupId} reached MOQ`);
      } else {
        addNotification(`✅ Successfully joined! Payment authorized for ${products[updatedGroup.productId].title}`, 'success');
        console.log(`💳 PAYMENT AUTHORIZED: User joined group ${groupId}`);
      }

      return { ...prevGroups, [groupId]: updatedGroup };
    });

    return true;
  };

  const simulateRaceCondition = (groupId) => {
    const group = groups[groupId];
    if (!group) return;

    // Fill the group to capacity
    setGroups(prevGroups => {
      const updatedGroup = { ...prevGroups[groupId] };
      updatedGroup.currentOrders = updatedGroup.moq;
      updatedGroup.status = "Full";
      return { ...prevGroups, [groupId]: updatedGroup };
    });

    addNotification("⚡ Race condition! Another user just took the last spot.", 'warning');
    console.log(`🏃‍♂️ RACE CONDITION: Group ${groupId} filled by another user`);
  };

  const cancelGroupByFarmer = (groupId) => {
    const group = groups[groupId];
    if (!group) return;

    setGroups(prevGroups => {
      const updatedGroup = { ...prevGroups[groupId] };
      updatedGroup.status = "Canceled";
      updatedGroup.currentOrders = 0;
      updatedGroup.members = [];
      return { ...prevGroups, [groupId]: updatedGroup };
    });

    addNotification("🚨 Group canceled by farmer. All payments have been refunded.", 'error');
    console.log(`❌ FARMER CANCELLATION: Group ${groupId} canceled, refunds processed`);
  };

  // --- TIME CHANGE FUNCTIONS ---
  
  const proposeTimeChange = (groupId, newTime, hostId) => {
    if (!currentUser || currentUser.id !== hostId) {
      addNotification("Only the host can propose time changes.", 'warning');
      return;
    }

    setGroups(prevGroups => {
      const updatedGroup = { ...prevGroups[groupId] };
      updatedGroup.proposedTime = newTime;
      updatedGroup.memberResponses = [];
      return { ...prevGroups, [groupId]: updatedGroup };
    });

    addNotification(`⏰ Time change proposed! Members will be notified about: ${newTime}`, 'info');
    console.log(`🕒 TIME CHANGE PROPOSED: ${newTime} for group ${groupId}`);
  };

  const respondToTimeChange = (groupId, memberId, response) => {
    setGroups(prevGroups => {
      const updatedGroup = { ...prevGroups[groupId] };
      if (!updatedGroup.memberResponses) {
        updatedGroup.memberResponses = [];
      }
      
      // Remove existing response from this member
      updatedGroup.memberResponses = updatedGroup.memberResponses.filter(r => r.memberId !== memberId);
      
      // Add new response
      updatedGroup.memberResponses.push({ memberId, response });
      
      return { ...prevGroups, [groupId]: updatedGroup };
    });

    const responseText = response === 'accept' ? 'accepted' : 'declined';
    addNotification(`✅ You ${responseText} the time change proposal.`, 'success');
    console.log(`👥 MEMBER RESPONSE: ${memberId} ${responseText} time change for group ${groupId}`);
  };

  const finalizeTimeChange = (groupId) => {
    setGroups(prevGroups => {
      const updatedGroup = { ...prevGroups[groupId] };
      if (updatedGroup.proposedTime) {
        updatedGroup.pickupTime = updatedGroup.proposedTime;
        updatedGroup.proposedTime = null;
        updatedGroup.memberResponses = [];
      }
      return { ...prevGroups, [groupId]: updatedGroup };
    });

    addNotification("🎉 Time change finalized! New pickup time confirmed.", 'success');
    console.log(`✅ TIME CHANGE FINALIZED: Group ${groupId}`);
  };

  // --- SUBSCRIPTION FUNCTIONS ---
  
  const addSubscription = (subscription) => {
    // Check for duplicates
    const existingSubscription = Object.values(subscriptions).find(s => 
      s.userId === currentUser?.id && 
      s.productId === subscription.productId && 
      s.status === 'Active'
    );

    if (existingSubscription) {
      addNotification('You already have an active subscription for this product.', 'warning');
      return { success: false, message: 'Duplicate subscription' };
    }

    const newSubscription = {
      ...subscription,
      id: `sub-${Date.now()}`,
      userId: currentUser?.id,
      status: 'Active',
      startDate: new Date().toISOString(),
      totalDeliveries: 0
    };

    setSubscriptions(prev => ({
      ...prev,
      [newSubscription.id]: newSubscription
    }));

    console.log(`🔄 SUBSCRIPTION CREATED: ${subscription.productName} (${subscription.deliveryFrequency})`);
    return { success: true, subscription: newSubscription };
  };

  const updateSubscription = (subscriptionId, updates) => {
    setSubscriptions(prev => ({
      ...prev,
      [subscriptionId]: { ...prev[subscriptionId], ...updates }
    }));
    
    console.log(`🔄 SUBSCRIPTION UPDATED: ${subscriptionId}`, updates);
  };

  // --- DISPUTE FUNCTIONS ---
  
  const fileDispute = (disputeData) => {
    const newDispute = {
      ...disputeData,
      id: `dispute-${Date.now()}`,
      status: 'OPEN',
      priority: 'MEDIUM',
      createdAt: new Date().toISOString()
    };

    setDisputes(prev => ({
      ...prev,
      [newDispute.id]: newDispute
    }));

    console.log(`🚨 DISPUTE FILED: ${disputeData.reason} for ${disputeData.productName}`);
    return newDispute.id;
  };

  const updateDisputeStatus = (disputeId, status, resolutionNotes) => {
    setDisputes(prev => ({
      ...prev,
      [disputeId]: {
        ...prev[disputeId],
        status,
        resolutionNotes,
        resolvedAt: status === 'RESOLVED' ? new Date().toISOString() : prev[disputeId].resolvedAt
      }
    }));

    console.log(`📝 DISPUTE STATUS UPDATED: ${disputeId} → ${status}`);
  };

  // --- PRODUCT FUNCTIONS ---
  
  const createProduct = (productData, farmerId) => {
    const newProduct = {
      ...productData,
      id: `prod-${Date.now()}`,
      farmerId,
      status: 'active',
      spotsTotal: productData.spotsTotal || 10,
      daysLeft: productData.daysActive || 7
    };

    setProducts(prev => ({
      ...prev,
      [newProduct.id]: newProduct
    }));

    // Create corresponding group
    const newGroup = {
      id: `group-${Date.now()}`,
      productId: newProduct.id,
      hostId: currentUser?.role === 'host' ? currentUser.id : null,
      moq: newProduct.spotsTotal,
      currentOrders: 0,
      members: [],
      status: 'Active',
      pickupTime: 'TBD',
      proposedTime: null,
      memberResponses: []
    };

    setGroups(prev => ({
      ...prev,
      [newGroup.id]: newGroup
    }));

    console.log(`📦 PRODUCT CREATED: ${newProduct.title} by ${users[farmerId]?.name}`);
    return newProduct;
  };

  // --- COMPUTED VALUES ---
  
  const getProductsWithGroupData = () => {
    return Object.values(products).map(product => {
      const group = Object.values(groups).find(g => g.productId === product.id);
      const farmer = users[product.farmerId];
      const host = group?.hostId ? users[group.hostId] : null;
      
      return {
        ...product,
        farmer: farmer ? {
          name: farmer.farmName || farmer.name,
          avatar: farmer.avatar,
          id: farmer.id,
          email: farmer.email,
          role: farmer.role,
          bio: farmer.verificationTier,
          quote: `"Quality produce from ${farmer.farmName || farmer.name}"`,
          practices: farmer.verificationTier,
          isVerified: farmer.businessLicenseVerified
        } : null,
        host: host ? {
          name: host.name,
          avatar: host.avatar
        } : null,
        progress: group ? (group.currentOrders / group.moq) * 100 : 0,
        spotsLeft: group ? Math.max(0, group.moq - group.currentOrders) : product.spotsTotal,
        spotsTotal: group?.moq || product.spotsTotal,
        members: group?.members?.map(memberId => ({
          id: memberId,
          avatar: users[memberId]?.avatar || 'https://i.pravatar.cc/48?img=1',
          name: users[memberId]?.name || 'Member'
        })) || [],
        status: group?.status || 'active'
      };
    });
  };

  const getUserSubscriptions = (userId) => {
    return Object.values(subscriptions).filter(sub => sub.userId === userId);
  };

  const getUserDisputes = (userId) => {
    return Object.values(disputes).filter(dispute => 
      dispute.customerEmail === users[userId]?.email
    );
  };

  // --- CONTEXT VALUE ---
  
  const value = {
    // Data
    users,
    products,
    groups,
    subscriptions,
    disputes,
    notifications,
    
    // Auth state
    currentUser,
    isLoggedIn,
    
    // Auth functions
    login,
    logout,
    
    // Notification functions
    addNotification,
    removeNotification,
    
    // Group functions
    joinGroup,
    simulateRaceCondition,
    cancelGroupByFarmer,
    proposeTimeChange,
    respondToTimeChange,
    finalizeTimeChange,
    
    // Subscription functions
    addSubscription,
    updateSubscription,
    
    // Dispute functions
    fileDispute,
    updateDisputeStatus,
    
    // Product functions
    createProduct,
    
    // Computed values
    getProductsWithGroupData,
    getUserSubscriptions,
    getUserDisputes
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};