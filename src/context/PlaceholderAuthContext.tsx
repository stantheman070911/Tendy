import React, { createContext, useContext, useState, useEffect } from "react";
import usersData from "../../public/placeholder-users.json";

// The actual array of users is nested under the 'default' key due to Vite's JSON import handling
const placeholderUsers = (usersData as any).default || usersData;

// Define the User type
interface User {
  id: string;
  role: "customer" | "host" | "farmer";
  name: string;
  email: string;
  joinDate: string;
  avatar?: string;
  isHost?: boolean;
  farmName?: string;
  verificationTier?: string;
  successfulGroups?: number;
  totalMembersServed?: number;
  hostRating?: number;
  verificationStatus?: string;
  groupsManaged?: string[];
  businessLicenseVerified?: boolean;
  products?: string[];
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
    let userToLogin: User | undefined;

    switch (role) {
      case "customer":
        userToLogin = placeholderUsers.find(
          (u: User) => u.role === "customer" && !u.isHost
        );
        break;
      case "host":
        userToLogin = placeholderUsers.find((u: User) => u.isHost);
        break;
      case "farmer":
        userToLogin = placeholderUsers.find((u: User) => u.role === "farmer");
        break;
    }

    if (userToLogin) {
      setUser(userToLogin);
      // Persist the user session in localStorage
      localStorage.setItem("tendy_demo_user", JSON.stringify(userToLogin));
      console.log(`🎭 Demo login successful as ${role}:`, userToLogin.name);
    } else {
      console.error(`No placeholder user found for role: ${role}`);
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