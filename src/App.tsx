import React, { FC, useEffect, useState } from 'react'
import './assets/styles/app.css'
import './assets/styles/app.scss'
import Comment from './pages/Comment'

const App: FC = () => {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'auto' }}>
      <Comment />
    </div>
  )
}

export default App
