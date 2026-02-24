import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import theme from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import PrivateRoute from './components/common/PrivateRoute';
import Layout from './components/common/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PatientDashboard from './components/patient/PatientDashboard';
import BookAppointment from './components/patient/BookAppointment';
import MyAppointments from './components/patient/MyAppointments';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import ManageAppointments from './components/doctor/ManageAppointments';
import AdminDashboard from './components/admin/AdminDashboard';
import ManageUsers from './components/admin/ManageUsers';
import Settings from './components/admin/Settings';
import Profile from './components/common/Profile';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Navigate to="/patient" />} />
                
                {/* Patient Routes */}
                <Route path="patient">
                  <Route index element={<PatientDashboard />} />
                  <Route path="book-appointment" element={<BookAppointment />} />
                  <Route path="appointments" element={<MyAppointments />} />
                </Route>
                
                {/* Doctor Routes */}
                <Route path="doctor">
                  <Route index element={<DoctorDashboard />} />
                  <Route path="appointments" element={<ManageAppointments />} />
                </Route>
                
{/* Admin Routes */}
                <Route path="admin">
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<ManageUsers />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
                
                {/* Common Routes */}
                <Route path="profile" element={<Profile />} />
              </Route>
            </Routes>
          </Router>
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
