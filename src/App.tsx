import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chat from './Chat';
import LandingPage from './LandingPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}
