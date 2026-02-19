import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', color: 'red', fontFamily: 'monospace', backgroundColor: '#fff', height: '100vh', overflow: 'auto' }}>
                    <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>⚠️ Something went wrong</h1>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ color: '#333' }}>Error Message:</h3>
                        <pre style={{ background: '#ffebee', padding: '15px', borderRadius: '8px', border: '1px solid #ffcdd2' }}>
                            {this.state.error ? this.state.error.toString() : 'Unknown Error (null/undefined)'}
                        </pre>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ color: '#333' }}>Stack Trace:</h3>
                        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', fontSize: '12px', lineHeight: '1.5' }}>
                            {this.state.errorInfo ? this.state.errorInfo.componentStack : 'No component stack available'}
                        </pre>
                        <h3 style={{ color: '#333' }}>Original Stack:</h3>
                        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', fontSize: '12px', lineHeight: '1.5' }}>
                            {this.state.error ? this.state.error.stack : 'No stack trace'}
                        </pre>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
