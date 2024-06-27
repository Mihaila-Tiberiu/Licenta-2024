// ErrorPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
    return (
        <div>
            <h1>Reservation Failed</h1>
            <p>There was an issue with your reservation. Please try again.</p>
            <Link to="/">Go to Home</Link>
        </div>
    );
};

export default ErrorPage;
