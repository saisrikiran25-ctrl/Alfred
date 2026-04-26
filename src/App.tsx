import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chat from './Chat';
import LandingPage from './LandingPage';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}
