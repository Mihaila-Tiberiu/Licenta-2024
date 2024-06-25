import React, { useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import axios from 'axios';
import StripeContainer from '../StripeContainer';

const BookingPage = () => {
    const [showItem, setShowItem] = useState(false);
    return (
        <div>
            <h1>Pagina de rezervare</h1>
            {showItem ? <StripeContainer/> : <><h3>5.00 RON</h3>
            <button onClick={() => setShowItem(true)}> Efectueaza rezervarea</button></>}
        </div>
    );
};

export default BookingPage;
