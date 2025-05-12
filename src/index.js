import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import { VideoProvider } from './context/VideoContext';
import { AuthProvider } from './context/AuthContext';

// Import pages
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Login from './pages/Login';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);

root.render(
  <React.StrictMode>
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
  </React.StrictMode>
); 