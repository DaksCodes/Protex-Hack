import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EducationPage from './pages/EducationPage';
import FirePage from './pages/FirePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/education" element={<EducationPage />} />
        <Route path="/fire" element={<FirePage />} />
      </Routes>
    </Router>
  );
}

export default App;