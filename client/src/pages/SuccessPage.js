// SuccessPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
    return (
        <div>
            <h1>Reservation Successful!</h1>
            <p>Your reservation has been successfully made.</p>
            <Link to="/">Go to Home</Link>
        </div>
    );
};

export default SuccessPage;
