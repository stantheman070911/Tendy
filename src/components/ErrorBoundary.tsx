import React, { Component, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // In a real app, you would log this to a service like Sentry
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-parchment flex items-center justify-center">
          <div className="text-center py-2xl max-w-2xl mx-auto px-md">
            <div className="mb-lg">
              <i className="ph-bold ph-warning-circle text-6xl text-error mb-md"></i>
              <h1 className="text-3xl md:text-4xl font-lora text-evergreen mb-md">
                Oops! Something went wrong
              </h1>
            </div>
            
            <p className="text-body mb-xl max-w-lg mx-auto">
              We encountered an unexpected error. Don't worry - your data is safe. 
              Please try refreshing the page or go back to the homepage.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-sm justify-center">
              <button
                onClick={() => window.location.reload()}
                className="h-14 px-lg inline-flex items-center justify-center bg-evergreen text-parchment font-bold text-lg rounded-lg hover:opacity-90 transition-opacity"
              >
                <i className="ph-bold ph-arrow-clockwise mr-2"></i>
                Refresh Page
              </button>
              
              <Link
                to="/"
                className="h-14 px-lg inline-flex items-center justify-center border-2 border-evergreen text-evergreen font-bold text-lg rounded-lg hover:bg-evergreen hover:text-parchment transition-colors"
              >
                <i className="ph-bold ph-house mr-2"></i>
                Go Home
              </Link>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-xl p-md bg-error-light rounded-lg text-left">
                <summary className="cursor-pointer font-semibold text-error mb-sm">
                  Error Details (Development Only)
                </summary>
                <pre className="text-sm text-error overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;