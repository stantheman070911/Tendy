import React, { Suspense, lazy } from 'react';
import { Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/DashboardLayout';
import { LoadingFallback } from './components/LoadingFallback';
import { ScrollToTop } from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import { DemoApp } from './components/App';
import { productLoader } from './loaders/productLoader';
import { farmerLoader } from './loaders/farmerLoader';

// Lazily import page components
const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(module => ({ default: module.AuthPage })));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage').then(module => ({ default: module.ProductDetailsPage })));
const DashboardMainPage = lazy(() => import('./pages/DashboardMainPage').then(module => ({ default: module.DashboardMainPage })));
const FarmerProfilePage = lazy(() => import('./pages/FarmerProfilePage').then(module => ({ default: module.FarmerProfilePage })));
const ApplyToHostPage = lazy(() => import('./pages/ApplyToHostPage').then(module => ({ default: module.ApplyToHostPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

// Error fallback components
const ProductErrorFallback = () => (
  <div className="container mx-auto max-w-screen-xl px-md md:px-lg py-xl text-center">
    <h1 className="text-4xl font-lora text-error">Failed to load product</h1>
    <p className="mt-4">We couldn't load the product details. Please try again.</p>
    <button 
      onClick={() => window.location.reload()}
      className="mt-8 h-14 px-8 bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
    >
      Try Again
    </button>
  </div>
);

const FarmerErrorFallback = () => (
  <div className="container mx-auto max-w-screen-xl px-md md:px-lg py-xl text-center">
    <h1 className="text-4xl font-lora text-error">Failed to load farmer profile</h1>
    <p className="mt-4">We couldn't load the farmer's information. Please try again.</p>
    <button 
      onClick={() => window.location.reload()}
      className="mt-8 h-14 px-8 bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
    >
      Try Again
    </button>
  </div>
);

// Create router with data loading
export const router = createBrowserRouter([
  {
    path: "/demo",
    element: <DemoApp />,
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthPage />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        path: "dashboard",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <DashboardLayout />
          </Suspense>
        ),
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoadingFallback />}>
                <DashboardMainPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "apply-to-host",
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <ApplyToHostPage />
          </Suspense>
        ),
      },
      {
        path: "product/:productId",
        element: (
          <ErrorBoundary fallback={<ProductErrorFallback />}>
            <Suspense fallback={<LoadingFallback />}>
              <ProductDetailsPage />
            </Suspense>
          </ErrorBoundary>
        ),
        loader: productLoader,
      },
      {
        path: "farmer/:farmerId",
        element: (
          <ErrorBoundary fallback={<FarmerErrorFallback />}>
            <Suspense fallback={<LoadingFallback />}>
              <FarmerProfilePage />
            </Suspense>
          </ErrorBoundary>
        ),
        loader: farmerLoader,
      },
    ],
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
]);

function App() {
  return <ScrollToTop />;
}

export default App;