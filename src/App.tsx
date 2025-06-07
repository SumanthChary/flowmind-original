import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard';
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import PaymentPage from './pages/PaymentPage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="payment" element={
            <AuthGuard>
              <PaymentPage />
            </AuthGuard>
          } />
          <Route path="dashboard" element={
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          } />
          <Route path="profile" element={
            <AuthGuard>
              <ProfilePage />
            </AuthGuard>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;