import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          <a href="/" className="flex flex-col items-center text-gray-600">
            <span className="text-sm">广场</span>
          </a>
          <a href="/create" className="flex flex-col items-center text-pink-500">
            <span className="text-sm">创建</span>
          </a>
          <a href="/my-capsules" className="flex flex-col items-center text-gray-600">
            <span className="text-sm">我的</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

const CapsuleSquare = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pb-20">
      <div className="max-w-md mx-auto px-4 pt-8">
        <h1 className="text-2xl font-bold text-center mb-8">校园时光胶囊</h1>
        <p className="text-center text-gray-600">记录美好，珍藏回忆 ✨</p>
        <div className="mt-8 space-y-4">
          <div className="bg-white rounded-xl p-6 shadow">
            <p className="text-gray-600">欢迎来到校园时光胶囊！</p>
            <a href="/create" className="inline-block mt-4 px-6 py-2 bg-pink-400 text-white rounded-full">
              创建第一个胶囊
            </a>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

const CreateCapsule = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pb-20">
      <div className="max-w-md mx-auto px-4 pt-8">
        <h1 className="text-2xl font-bold mb-8">创建时光胶囊</h1>
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-gray-600">创建胶囊页面</p>
          <a href="/" className="inline-block mt-4 px-6 py-2 bg-gray-200 rounded-full">
            返回广场
          </a>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

const MyCapsules = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 pb-20">
      <div className="max-w-md mx-auto px-4 pt-8">
        <h1 className="text-2xl font-bold mb-8">我的胶囊</h1>
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-gray-600">我的胶囊页面</p>
          <a href="/" className="inline-block mt-4 px-6 py-2 bg-gray-200 rounded-full">
            返回广场
          </a>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

const CapsuleDetail = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-md mx-auto px-4 pt-8">
        <h1 className="text-2xl font-bold mb-8">胶囊详情</h1>
        <div className="bg-white rounded-xl p-6 shadow">
          <p className="text-gray-600">胶囊详情页面</p>
          <a href="/" className="inline-block mt-4 px-6 py-2 bg-gray-200 rounded-full">
            返回广场
          </a>
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith('/capsule/');

  return (
    <div>
      <Routes>
        <Route path="/" element={<CapsuleSquare />} />
        <Route path="/create" element={<CreateCapsule />} />
        <Route path="/my-capsules" element={<MyCapsules />} />
        <Route path="/capsule/:id" element={<CapsuleDetail />} />
      </Routes>
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
