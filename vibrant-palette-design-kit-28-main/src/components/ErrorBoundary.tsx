import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Recipe component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-12 bg-black/40 rounded-xl border border-white/10">
          <p className="text-center text-white text-lg font-pitter">
            Something went wrong displaying the recipes.
          </p>
          <p className="text-recipe-orange mt-2 font-pitter-script">
            Please try refreshing the page.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
