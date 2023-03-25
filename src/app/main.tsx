import fundebug from "fundebug-javascript"
import "fundebug-revideo"
import React from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { createRoot } from 'react-dom/client'
import './base.scss'
import { router } from './router'

fundebug.init({
  apikey: "c3685a3f2510e80a4ab65432e12f26e51b764af9cf0e8f7538785fd5a4ff95ef"
})

class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error: any, info: any) {
    this.setState({ hasError: true });
    // 将component中的报错发送到Fundebug
    fundebug.notifyError(error, {
      metaData: { info }
    })
  }

  render() {
    if (this.state.hasError) {
      return null;
      // Note: 也可以在出错的component处展示出错信息，返回自定义的结果。
    }
    return this.props.children;
  }
}

// const script = document.createElement('script');
// script.async = true;
// script.defer = true;
// script.src = 'https://chatgpt-demo.up.railway.app/chatgpt.js';
// script.setAttribute('data-website-id', 'd4de1ebc-48ce-4ef0-b66b-1a7050d6a1d9');
// document.body.appendChild(script);

const container = document.getElementById('app')!
const root = createRoot(container)
root.render(
  <ErrorBoundary>
    <RouterProvider router={router} />
  </ErrorBoundary>
)
