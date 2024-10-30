// PublicRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { authContext } from '../context/AuthContext'; // Adjust path to your AuthContext

const PublicRoute = ({ children }) => {
    const { user } = useContext(authContext); // Get user authentication state

    if (user) {
        // If the user is authenticated, redirect them based on their role
        const redirectPath = user.role === 'doctor' ? '/doctors/profile/me' : '/users/profile/me';
        return <Navigate to={redirectPath} />;
    }

    // If not authenticated, render the child component (Login/Signup page)
    return children;
};

export default PublicRoute;
