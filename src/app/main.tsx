import fundebug from "fundebug-javascript"
import "fundebug-revideo"
import React, { Component, ErrorInfo, ReactNode } from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { createRoot } from 'react-dom/client'
import './base.scss'
import { router } from './router'

fundebug.init({ apikey: 'c3685a3f2510e80a4ab65432e12f26e51b764af9cf0e8f7538785fd5a4ff95ef'})

interface Props {
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}
interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ hasError: true });
    // 将component中的报错发送到Fundebug
    fundebug.notifyError(error, {
      metaData: { info }
    })
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    return hasError ? <div>出错了，请联系up主</div> : children;
  }
}

const container = document.getElementById('app')!
const root = createRoot(container)
root.render(
  <ErrorBoundary>
    <RouterProvider router={router} />
  </ErrorBoundary>
)
