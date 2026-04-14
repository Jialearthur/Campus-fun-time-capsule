import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CapsuleSquare from './pages/CapsuleSquare';
import CreateCapsule from './pages/CreateCapsule';
import MyCapsules from './pages/MyCapsules';
import CapsuleDetail from './pages/CapsuleDetail';
import DataDashboard from './pages/DataDashboard';
import JoinGroupCapsule from './pages/JoinGroupCapsule';
import CampusMap from './pages/CampusMap';
import AnniversaryManager from './pages/AnniversaryManager';

const AppContent = () => {
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith('/capsule/') && 
                    location.pathname !== '/create' && 
                    !location.pathname.startsWith('/join/');

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/square" element={<CapsuleSquare />} />
        <Route path="/create" element={<CreateCapsule />} />
        <Route path="/my" element={<MyCapsules />} />
        <Route path="/capsule/:id" element={<CapsuleDetail />} />
        <Route path="/dashboard" element={<DataDashboard />} />
        <Route path="/join/:id" element={<JoinGroupCapsule />} />
        <Route path="/campus-map" element={<CampusMap />} />
        <Route path="/anniversaries" element={<AnniversaryManager />} />
      </Routes>
      {showNavbar && <Navbar />}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
