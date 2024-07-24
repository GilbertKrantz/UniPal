import React from 'react'
import './app.css'

import {  Routes, Route } from 'react-router-dom'

import { ChatContent, Home, SignIn } from './Containers'


const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/chat" element={<ChatContent />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </>
  )
}

export default App