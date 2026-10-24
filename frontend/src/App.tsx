import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Layout from './components/Layout/Layout';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import CreateEventPage from './pages/CreateEventPage';
import SubmissionsPage from './pages/SubmissionsPage';
import MySubmissionsPage from './pages/MySubmissionsPage';
import ReviewsPage from './pages/ReviewsPage';
import EvaluatePage from './pages/EvaluatePage';
import RegistrationsPage from './pages/RegistrationsPage';
import SessionsPage from './pages/SessionsPage';
import WorkshopsPage from './pages/WorkshopsPage';
import CertificatesPage from './pages/CertificatesPage';
import StatisticsPage from './pages/StatisticsPage';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventDetailsPage />} />
                <Route path="/events/create" element={<CreateEventPage />} />
                <Route path="/submissions" element={<SubmissionsPage />} />
                <Route path="/my-submissions" element={<MySubmissionsPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/reviews/:id/evaluate" element={<EvaluatePage />} />
                <Route path="/registrations" element={<RegistrationsPage />} />
                <Route path="/sessions" element={<SessionsPage />} />
                <Route path="/workshops" element={<WorkshopsPage />} />
                <Route path="/certificates" element={<CertificatesPage />} />
                <Route path="/statistics" element={<StatisticsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
              </Route>
            </Route>
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
