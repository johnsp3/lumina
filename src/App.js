import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { VideoProvider } from './context/VideoContext';

function App() {
  return (
    <AuthProvider>
      <VideoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </VideoProvider>
    </AuthProvider>
  );
}

export default App; 