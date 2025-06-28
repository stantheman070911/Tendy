import React, { createContext, useContext, useState, useEffect } from "react";

// Import placeholder users from JSON
const placeholderUsers = [
  {
    userId: "user001",
    role: "customer",
    name: "Alex Smith",
    email: "alex.smith@example.com",
    joinDate: "2024-08-15",
    avatar: "https://i.pravatar.cc/80?img=1",
    isHost: false
  },
  {
    userId: "host01",
    role: "host",
    name: "Charles Green",
    email: "charles.green@example.com",
    joinDate: "2024-07-20",
    verificationStatus: "Completed",
    groupsManaged: ["group01"],
    avatar: "https://i.pravatar.cc/80?img=10",
    successfulGroups: 15,
    totalMembersServed: 127,
    hostRating: 4.9,
    isHost: true
  },
  {
    userId: "farmer01",
    role: "farmer",
    name: "Diana Prince",
    email: "diana@sunriseorganics.com",
    farmName: "Sunrise Organics",
    verificationTier: "Level 1: Tendy Sprout",
    businessLicenseVerified: true,
    products: ["prod01", "prod02"],
    avatar: "https://i.pravatar.cc/80?img=3"
  }
];

// Define the User type
interface User {
  userId: string;
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
          (u) => u.role === "customer" && !u.isHost
        );
        break;
      case "host":
        userToLogin = placeholderUsers.find((u) => u.isHost);
        break;
      case "farmer":
        userToLogin = placeholderUsers.find((u) => u.role === "farmer");
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