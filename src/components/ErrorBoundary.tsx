'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] w-full flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border-2 border-dashed border-surface-dim">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-primary mb-2">Something went wrong</h2>
          <p className="text-foreground/60 max-w-md mb-8">
            We encountered an unexpected error. Don't worry, your data is safe. Please try refreshing the page.
          </p>
          <Button 
            variant="primary" 
            onClick={() => this.setState({ hasError: false }, () => window.location.reload())}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
