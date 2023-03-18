import { RouterProvider } from '@tanstack/react-router'
import { createRoot } from 'react-dom/client'
import './base.scss'
import { router } from './router'

// const script = document.createElement('script');
// script.async = true;
// script.defer = true;
// script.src = 'https://chatgpt-demo.up.railway.app/chatgpt.js';
// script.setAttribute('data-website-id', 'd4de1ebc-48ce-4ef0-b66b-1a7050d6a1d9');
// document.body.appendChild(script);

const container = document.getElementById('app')!
const root = createRoot(container)
root.render(<RouterProvider router={router} />)
