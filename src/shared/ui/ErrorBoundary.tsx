import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Icon } from './Icon';
interface Props {
  children: ReactNode;
  onError: (error: Error, info: ErrorInfo) => void;
}
export default class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError(error, info);
  }
  render() {
    return this.state.failed ? (
      <div className="error-screen" role="alert">
        <Icon name="error" size={40} />
        <h1>Arena perlu dimuat ulang.</h1>
        <p>Terjadi masalah pada aplikasi. Progres yang tersimpan tetap tersedia.</p>
        <button className="button primary" onClick={() => location.reload()}>
          Muat ulang
        </button>
        <a href="https://portfolio.smtmtc.com/">Kembali ke portfolio</a>
      </div>
    ) : (
      this.props.children
    );
  }
}
