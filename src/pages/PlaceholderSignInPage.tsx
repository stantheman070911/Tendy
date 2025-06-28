import React from "react";
import { useNavigate } from "react-router-dom";
import { usePlaceholderAuth } from "../context/PlaceholderAuthContext";

export const PlaceholderSignInPage: React.FC = () => {
  const { loginAsPlaceholder } = usePlaceholderAuth();
  const navigate = useNavigate();

  const handleLogin = (role: "customer" | "host" | "farmer") => {
    loginAsPlaceholder(role);
    // Redirect to the main dashboard after login
    navigate("/dashboard");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-parchment">
      <div className="w-full max-w-md rounded-lg border border-stone/30 bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="font-lora text-3xl font-bold text-evergreen">
            Welcome to Tendy
          </h1>
          <p className="mt-2 text-charcoal">
            Select a role to experience the platform.
          </p>
          <div className="mt-2 text-xs text-stone">
            🎯 Placeholder Authentication Demo
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleLogin("customer")}
            className="w-full h-14 flex items-center justify-center bg-harvest-gold text-evergreen font-bold text-lg rounded-lg hover:bg-harvest-gold/90 transition-colors"
          >
            <i className="ph-bold ph-shopping-cart mr-2"></i>
            Login as Customer
          </button>
          
          <button
            onClick={() => handleLogin("host")}
            className="w-full h-14 flex items-center justify-center bg-harvest-gold text-evergreen font-bold text-lg rounded-lg hover:bg-harvest-gold/90 transition-colors"
          >
            <i className="ph-bold ph-house-line mr-2"></i>
            Login as Host
          </button>
          
          <button
            onClick={() => handleLogin("farmer")}
            className="w-full h-14 flex items-center justify-center bg-harvest-gold text-evergreen font-bold text-lg rounded-lg hover:bg-harvest-gold/90 transition-colors"
          >
            <i className="ph-bold ph-plant mr-2"></i>
            Login as Farmer
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-stone">
            This demo uses placeholder data stored in localStorage
          </p>
        </div>
      </div>
    </main>
  );
};