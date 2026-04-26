import { HashRouter, Routes, Route } from 'react-router-dom';
import Chat from './Chat';
import LandingPage from './LandingPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </HashRouter>
  );
}
