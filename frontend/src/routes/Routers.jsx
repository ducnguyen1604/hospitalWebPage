import React from 'react';
import Home from '../pages/Home';
import Services from '../pages/Services';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Contact from '../pages/Contact';
import Doctors from '../pages/Doctors/Doctors';
import DoctorDetails from '../pages/Doctors/DoctorDetails';
import MyAccount from '../Dashboard/user-account/MyAccount';
import Dashboard from '../Dashboard/doctor-account/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute'; // Import the PublicRoute wrapper
import { Routes, Route, Navigate } from 'react-router-dom';
import NotFound from '../pages/NotFound';

const Routers = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:doctorId" element={<DoctorDetails />} />

            {/* Public Routes for Login and Signup */}
            <Route 
                path="/login" 
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                } 
            />
            <Route 
                path="/signup" 
                element={
                    <PublicRoute>
                        <Signup />
                    </PublicRoute>
                } 
            />

            {/* Protected Routes for Patients and Doctors */}
            <Route 
                path="/users/profile/me" 
                element={
                    <ProtectedRoute allowedRoles={['patient']}>
                        <MyAccount />
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/doctors/profile/me" 
                element={
                    <ProtectedRoute allowedRoles={['doctor']}>
                        <Dashboard />
                    </ProtectedRoute>
                } 
            />

            {/* Not Found Route */}
            <Route path="/notfound" element={<NotFound />} />

            {/* Catch-all Route */}
            <Route path="*" element={<Navigate to="/notfound" />} />
        </Routes>
    );
};

export default Routers;
