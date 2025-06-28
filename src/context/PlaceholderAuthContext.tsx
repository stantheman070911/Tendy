import React, { createContext, useContext, useState, useEffect } from "react";
import usersData from "../../public/placeholder-users.json";

// The actual array of users is nested under the 'default' key due to Vite's JSON import handling
const placeholderUsers = (usersData as any).default || usersData;

// Define the User type - updated to match the JSON structure exactly
interface User {
  userId: string;
  role: "Customer" | "Verified Host" | "Farmer";
  name: string;
  email: string;
  joinDate: string;
  avatar?: string;
  farmName?: string;
  verificationTier?: string;
  successfulGroups?: number;
  totalMembersServed?: number;
  hostRating?: number;
  verificationStatus?: string;
  groupsManaged?: string[];
  businessLicenseVerified?: boolean;
  products?: string[];
  manualReviewCompleted?: boolean;
  averageRating?: number;
  virtualTourCompleted?: boolean;
}

// Define the shape of the context
interface PlaceholderAuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loginAsPlaceholder: (role: "customer" | "host" | "farmer") => void;
  logout: () => void;
}

// Create the context
const PlaceholderAuthContext = createContext<PlaceholderAuthContextType | undefined>(undefined);

// Create the provider component
export const PlaceholderAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    // Check localStorage for a saved user session on initial load
    const savedUser = localStorage.getItem("tendy_demo_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // The new function for placeholder login
  const loginAsPlaceholder = (role: "customer" | "host" | "farmer") => {
    console.log("🔍 Looking for user with role:", role);
    console.log("📋 Available users:", placeholderUsers);
    
    let userToLogin: User | undefined;

    switch (role) {
      case "customer":
        // Look for users with role "Customer" (capitalized)
        userToLogin = placeholderUsers.find(
          (u: User) => u.role === "Customer"
        );
        break;
      case "host":
        // Look for users with role "Verified Host"
        userToLogin = placeholderUsers.find((u: User) => u.role === "Verified Host");
        break;
      case "farmer":
        // Look for users with role "Farmer" (capitalized)
        userToLogin = placeholderUsers.find((u: User) => u.role === "Farmer");
        break;
    }

    console.log("🎯 Found user:", userToLogin);

    if (userToLogin) {
      setUser(userToLogin);
      // Persist the user session in localStorage
      localStorage.setItem("tendy_demo_user", JSON.stringify(userToLogin));
      console.log(`🎭 Demo login successful as ${role}:`, userToLogin.name);
    } else {
      console.error(`No placeholder user found for role: ${role}`);
      console.error("Available users:", placeholderUsers.map((u: User) => ({ userId: u.userId, role: u.role, name: u.name })));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("tendy_demo_user");
    console.log("🚪 Demo user logged out");
  };

  const value = {
    user,
    isLoggedIn: !!user,
    loginAsPlaceholder,
    logout
  };

  return (
    <PlaceholderAuthContext.Provider value={value}>
      {children}
    </PlaceholderAuthContext.Provider>
  );
};

// Create a custom hook for easy access
export const usePlaceholderAuth = () => {
  const context = useContext(PlaceholderAuthContext);
  if (context === undefined) {
    throw new Error("usePlaceholderAuth must be used within a PlaceholderAuthProvider");
  }
  return context;
};