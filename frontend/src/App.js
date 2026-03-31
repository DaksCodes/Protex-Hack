import React, { useState, useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import Home from './pages/Home'; 
import EducationPage from './pages/EducationPage';
import FirePage from './pages/FirePage';
import Dashboard from './pages/Dashboard';

import Spinner from './components/Spinner';
import Header from './components/Header';

function AppContent() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  return loading ? <Spinner /> : (
    <>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/fire" element={<FirePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default function App() {
  return <AppContent />;
}