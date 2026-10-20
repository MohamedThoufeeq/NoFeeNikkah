import { Component } from 'react';
import { Alert } from '../components/ui/States';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Replace with your error reporting service when the backend is wired up.
    console.error('Unhandled application error', error, info);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="container page">
        <Alert variant="error" title="Something went wrong">
          The page could not be displayed. Please refresh or try again.
        </Alert>
        <button type="button" className="btn btn--primary mt-4" onClick={this.handleReset}>
          Try again
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
