import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-6 text-center">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full space-y-4">
            <div className="text-4xl">⚠️</div>
            <h2 className="text-lg font-bold text-slate-800">เกิดข้อผิดพลาดในการแสดงผล</h2>
            <p className="text-xs text-slate-500 font-mono bg-slate-50 p-3 rounded-xl border border-slate-100 overflow-auto text-left max-h-32">
              {this.state.error?.message || String(this.state.error)}
            </p>
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-2xl shadow-md transition"
            >
              🔄 รีเฟรชโหลดระบบใหม่
            </button>
          </div>
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
  </React.StrictMode>
);
