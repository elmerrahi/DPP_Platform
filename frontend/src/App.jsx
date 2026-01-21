import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/index.jsx';
import Footer from './components/Footer/index.jsx';
import Landing from './pages/index.jsx';
import SignIn from './pages/signin.jsx';
import SignUp from './pages/signup.jsx';
import AuthChoice from './pages/auth-choice.jsx';
import Dashboard from './pages/user-dashboard.jsx';
import CreateDpp from './pages/dpp-create.jsx';
import AuditPage from './pages/audit.jsx';
import ProtectedRoute from './components/ProtectedRoute/index.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/get-started" element={<AuthChoice />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dpp/create"
              element={
                <ProtectedRoute>
                  <CreateDpp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/audit"
              element={
                <ProtectedRoute>
                  <AuditPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
