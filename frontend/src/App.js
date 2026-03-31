import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EducationPage from './pages/EducationPage';
import FirePage from './pages/FirePage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/education" element={<EducationPage />} />
        <Route path="/fire" element={<FirePage />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Routes>
    </Router>
  );
}

export default App;