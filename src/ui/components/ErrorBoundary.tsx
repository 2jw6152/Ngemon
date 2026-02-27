import React from 'react';

export interface ErrorBoundaryProps extends React.PropsWithChildren {
  title?: string;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { error: null };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Keep console output for debugging crashes that otherwise blank the screen.
    console.error('[ErrorBoundary] uncaught render error', error, errorInfo);
  }

  public render() {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }

    return (
      <div className="page" style={{ padding: '3rem', maxWidth: 720, margin: '0 auto' }}>
        <div className="card">
          <h1>{this.props.title ?? '오류가 발생했어요'}</h1>
          <p className="subtitle">빈 화면이 되지 않도록 오류 화면을 표시했어요. 아래 내용을 공유해주면 빠르게 고칠 수 있어요.</p>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              background: 'rgba(0,0,0,0.35)',
              padding: '1rem',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.9)',
              overflow: 'auto',
              maxHeight: 320,
            }}
          >
            {String(error.stack ?? error.message)}
          </pre>
          <div className="button-row">
            <button
              type="button"
              className="primary"
              onClick={() => {
                window.location.reload();
              }}
            >
              새로고침
            </button>
          </div>
        </div>
      </div>
    );
  }
}

