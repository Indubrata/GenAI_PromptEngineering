import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ResumeProvider } from './context/ResumeContext';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import LandingPage from './components/landing/LandingPage';
import ScorePage from './components/analysis/ScorePage';
import EditorPage from './components/editor/EditorPage';
import ExportPage from './components/export/ExportPage';
import ErrorBox from './components/shared/ErrorBox';


import './css/variables.css';
import './css/global.css';
import './css/animations.css';

function RouteScroll() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <ThemeProvider>
      <ResumeProvider>
        <BrowserRouter>
          <RouteScroll />
          <div className="app-shell">

            <Navbar />
            <main>
              <Routes>
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="/analysis" element={<ScorePage />} />
                <Route path="/editor" element={<EditorPage />} />
                <Route path="/export" element={<ExportPage />} />
              </Routes>
            </main>
            <Footer />
            <ErrorBox />
          </div>
        </BrowserRouter>
      </ResumeProvider>
    </ThemeProvider>
  );
}

export default App;
