import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // Redirects to the home page
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-[40px] font-bold text-primaryColor mb-4">
                Page Not Found
            </h1>
            <p className="text-[18px] text-gray-600 mb-6 text-center">
                The page you are looking for does not exist, or you do not have the privilege to access it.
            </p>
            <button
                onClick={handleGoHome}
                className="btn"
            >
                Go to Home Page
            </button>
        </div>
    );
};

export default NotFound;
