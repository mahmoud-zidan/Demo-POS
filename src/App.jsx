import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import POS from './pages/POS';
import Kitchen from './pages/Kitchen';
import { Analytics } from "@vercel/analytics/react";
import { AppProvider } from "./context/AppContext";
function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/kitchen" element={<Kitchen />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </AppProvider>
  );
}

export default App;
