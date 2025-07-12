import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { RecordingPage } from './pages/RecordingPage';
import { ViewerPage } from './pages/ViewerPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/record" element={<RecordingPage />} />
        <Route path="/video/:videoId" element={<ViewerPage />} />
      </Routes>
    </Router>
  );
}

export default App;
