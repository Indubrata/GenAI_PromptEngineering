import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { ResumeProvider } from './context/ResumeContext';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import LandingPage from './components/landing/LandingPage';
import ScorePage from './components/analysis/ScorePage';
import EditorPage from './components/editor/EditorPage';
import ExportPage from './components/export/ExportPage';
import ErrorBox from './components/shared/ErrorBox';
import MagneticCursor from './components/ui/MagneticCursor';

import './css/variables.css';
import './css/global.css';
import './css/animations.css';

function App() {
  return (
    <ThemeProvider>
      <ResumeProvider>
        <BrowserRouter>
          <div className="app-shell">
            <MagneticCursor />
            <Navbar />
            <main>
              <Routes>
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
