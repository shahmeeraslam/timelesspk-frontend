import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId='157837424523-jq5shupk3ij1rjatql52t8gasecn6g2d.apps.googleusercontent.com'>
  <BrowserRouter>
  <App />
  </BrowserRouter>
  </GoogleOAuthProvider>
)
