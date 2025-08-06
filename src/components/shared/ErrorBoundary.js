"use client";
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Check if it's the specific DOM removeChild error
    if (error?.message?.includes('removeChild') || error?.message?.includes('insertBefore')) {
      console.warn('DOM manipulation error caught - likely caused by browser translation or external scripts');
      // Attempt to recover automatically for DOM errors
      setTimeout(() => {
        this.setState({ hasError: false, error: null });
      }, 100);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="error-boundary p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-red-800 font-bold">Something went wrong</h2>
          <p className="text-red-600 text-sm mt-2">
            {this.props.showError && this.state.error?.message}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;