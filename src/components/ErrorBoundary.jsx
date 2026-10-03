import React from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('FNAK Caught Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 bg-neutral-950 text-white flex flex-col items-center justify-center p-6 font-mono select-none">
          <div className="max-w-md w-full bg-red-950/80 border-2 border-red-600 rounded-xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-900 flex items-center justify-center text-red-300">
              <AlertOctagon size={28} />
            </div>
            <h2 className="text-xl font-bold text-red-400">SURVEILLANCE SUBSYSTEM FAULT</h2>
            <p className="text-xs text-neutral-300 break-words font-mono bg-black/60 p-3 rounded border border-neutral-800">
              {this.state.error?.message || 'An unexpected runtime error occurred.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="w-full py-2.5 bg-red-700 hover:bg-red-600 text-white font-bold rounded text-xs uppercase tracking-wider transition flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} />
              <span>REBOOT SECURITY SYSTEM</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
