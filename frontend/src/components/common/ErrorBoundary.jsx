import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark p-4">
          <AlertTriangle size={64} className="text-red-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h1>
          <p className="text-center mb-4">We're sorry for the inconvenience. Please refresh the page or try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="gradient-primary text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
