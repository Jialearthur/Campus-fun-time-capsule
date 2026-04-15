import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import CreateCapsule from './pages/CreateCapsule';
import MyCapsules from './pages/MyCapsules';
import CapsuleDetail from './pages/CapsuleDetail';
import Square from './pages/CapsuleSquare';
import DriftBottle from './pages/DriftBottle';
import Achievements from './pages/Achievements';
import CampusMap from './pages/CampusMap';
import Dashboard from './pages/DataDashboard';
import Navbar from './components/Navbar';
import Header from './components/Header';
import { useTheme } from './hooks/useTheme';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

function App() {
  const { isDark } = useTheme();

  return (
    <Router>
      <div className={cn(
        "min-h-screen transition-colors duration-500",
        isDark ? "bg-dark-bg-primary" : "bg-apple-gray-100"
      )}>
        {/* 桌面端头部 */}
        <Header />
        
        <main className="container mx-auto px-4 pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateCapsule />} />
            <Route path="/my" element={<MyCapsules />} />
            <Route path="/capsule/:id" element={<CapsuleDetail />} />
            <Route path="/square" element={<Square />} />
            <Route path="/drift-bottle" element={<DriftBottle />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/campus-map" element={<CampusMap />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        {/* 移动端导航栏 */}
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
