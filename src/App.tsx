import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import CapsuleSquare from './pages/CapsuleSquare';
import CreateCapsule from './pages/CreateCapsule';
import MyCapsules from './pages/MyCapsules';
import CapsuleDetail from './pages/CapsuleDetail';

const AppContent = () => {
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith('/capsule/') && location.pathname !== '/create';

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<CapsuleSquare />} />
        <Route path="/create" element={<CreateCapsule />} />
        <Route path="/my" element={<MyCapsules />} />
        <Route path="/capsule/:id" element={<CapsuleDetail />} />
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
