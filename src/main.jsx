import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './main.css'

import { HashRouter } from 'react-router-dom'

import createStore from 'react-auth-kit/createStore'
import AuthProvider from 'react-auth-kit'

const store = createStore({
  authName: '_auth',
  authType: 'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: false
})

const root = createRoot(document.getElementById('main'))
root.render(
  <React.StrictMode>
    <AuthProvider store={store}>
      <HashRouter>
        <App />
      </HashRouter>
    </AuthProvider>
  </React.StrictMode>
)
