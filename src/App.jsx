import './app.css'

import RequireAuth from '@auth-kit/react-router/RequireAuth'

import {  Routes, Route } from 'react-router-dom'

import { ChatContent, Home, SignIn, Register, ChangePassword } from './Containers'


const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/chat" element={
          <RequireAuth fallbackPath='/signin'>
            <ChatContent />
          </RequireAuth>
        } />
        <Route path="/signin" element={<SignIn />} />
        <Route path='/register' element={<Register />}/>
        <Route path='/change-password' element={<ChangePassword />}/>
      </Routes>
    </>
  )
}

export default App