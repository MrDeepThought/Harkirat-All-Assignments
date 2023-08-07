import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

let ele = document.getElementById('root');
if (ele !== null)
ReactDOM.createRoot(ele).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
