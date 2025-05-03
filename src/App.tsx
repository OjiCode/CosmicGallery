import { Routes, Route, Navigate } from 'react-router-dom';
import { GalleryPage } from './pages/GalleryPage';
import './App.css';

// TODO: Replace placeholder components with actual components.
const DetailPage = () => <div>Detail Page Placeholder</div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/gallery" replace />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/apod/:date" element={<DetailPage />} />
      {/* Could flesh this out, depends if I have time. */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;
