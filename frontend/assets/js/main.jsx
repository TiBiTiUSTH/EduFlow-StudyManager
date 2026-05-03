import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../css/index.css'

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '20px', background: '#f8d7da', color: '#721c24', minHeight: '100vh', fontFamily: 'monospace' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Something went wrong.</h1>
                    <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
                        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Click for error details</summary>
                        <br />
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }
        return this.props.children;
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>,
)
