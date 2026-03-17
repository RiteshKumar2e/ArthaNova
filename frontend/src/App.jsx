import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import FeedPage from './pages/News/FeedPage';
import BriefingPage from './pages/AI/BriefingPage';
import VideoGeneratorPage from './pages/Studio/VideoGeneratorPage';
import VideoLibraryPage from './pages/Studio/VideoLibraryPage';
import StoryTimelineView from './pages/News/StoryTimelineView';
import EntityMapView from './pages/News/EntityMapView';
import ProfilePage from './pages/Profile/ProfilePage';
import SettingsPage from './pages/Profile/SettingsPage';
import OTPPage from './pages/Auth/OTPPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import TrendingPage from './pages/News/TrendingPage';
import DeepAnalysisPage from './pages/News/DeepAnalysisPage';
import SavedPage from './pages/News/SavedPage';
import VernacularPage from './pages/AI/VernacularPage';
import StoryArcPage from './pages/AI/StoryArcPage';
import VideoPreviewPage from './pages/Studio/VideoPreviewPage';
import CommandPalette from './components/CommandPalette';

function App() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/briefings" element={<BriefingPage />} />
        <Route path="/studio" element={<VideoGeneratorPage />} />
        <Route path="/library" element={<VideoLibraryPage />} />
        <Route path="/analysis/:id" element={<StoryTimelineView />} />
        <Route path="/map" element={<EntityMapView />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/deep-analysis" element={<DeepAnalysisPage />} />
        <Route path="/saved" element={<SavedPage />} />
        <Route path="/vernacular" element={<VernacularPage />} />
        <Route path="/story-arc" element={<StoryArcPage />} />
        <Route path="/studio/preview" element={<VideoPreviewPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </>
  );
}

export default App;
