import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

export default function ReservationPage() {
    const { user, ready } = useContext(UserContext);
    const userId = user ? user.IdUtilizator : null;
    const query = new URLSearchParams(useLocation().search);
    const locationId = query.get('locationId');
    const navigate = useNavigate();
    const [bookedDates, setBookedDates] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);
    const [cardNumber, setCardNumber] = useState('');
    const [expDate, setExpDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [locationInfo, setLocationInfo] = useState(null);
    const [price, setPrice] = useState(0);
    const [hostId, setHostId] = useState(null);

    useEffect(() => {
        const fetchBookedDates = async () => {
            try {
                const response = await axios.get(`/getLocationBookings/${locationId}`);
                const dates = response.data.map((booking) => {
                    const checkInParts = booking.CheckInDate.split('-');
                    const checkOutParts = booking.CheckOutDate.split('-');

                    const startDate = new Date(
                        checkInParts[0], // Year
                        checkInParts[1] - 1, // Month (zero-indexed)
                        checkInParts[2] // Day
                    );

                    const endDate = new Date(
                        checkOutParts[0], // Year
                        checkOutParts[1] - 1, // Month (zero-indexed)
                        checkOutParts[2] // Day
                    );

                    return { startDate, endDate };
                });
                setBookedDates(dates);
            } catch (error) {
                console.error('Error fetching booked dates:', error);
            }
        };

        const fetchLocationInfo = async () => {
            try {
                const response = await axios.get(`/api/LocationInfo/${locationId}`);
                if (response.data.locations.length > 0) {
                    setLocationInfo(response.data.locations[0]);
                    setHostId(response.data.locations[0].UtilizatorIdUtilizator);
                    console.log('Host ID set to:', response.data.locations[0].UtilizatorIdUtilizator);
                }
            } catch (error) {
                console.error('Error fetching location info:', error);
            }
        };

        fetchBookedDates();
        fetchLocationInfo();
    }, [locationId]);

    useEffect(() => {
        if (selectedDates.length === 2 && locationInfo) {
            const [checkInDate, checkOutDate] = selectedDates;
            const days = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
            setPrice((locationInfo.PretPeZi * days).toFixed(2));
        } else {
            setPrice(0);
        }
    }, [selectedDates, locationInfo]);

    const isDateBooked = (date) => {
        return bookedDates.some((booking) => isDateWithinRange(date, booking.startDate, booking.endDate));
    };

    const isDateWithinRange = (date, startDate, endDate) => {
        return date >= startDate && date <= endDate;
    };

    const tileDisabled = ({ date, view }) => {
        const currentDate = new Date();
        const isPastDate = date < currentDate.setDate(currentDate.getDate() - 1);
        const next7Days = new Date();
        next7Days.setDate(currentDate.getDate() + 7);
        const isNext7Days = date > currentDate && date <= next7Days;
        const isBooked = isDateBooked(date);
        return isPastDate || isNext7Days || isBooked;
    };

    const handleDateChange = (dates) => {
        if (dates && dates.length === 2) {
            const formattedStartDate = formatDate(dates[0].toISOString());
            const formattedEndDate = formatDate(dates[1].toISOString());
            setSelectedDates([formattedStartDate, formattedEndDate]);
        } else {
            setSelectedDates(dates);
        }
    };

    const formatDate = (date) => {
        return date.split('T')[0]; // This will return the date part before 'T'
    };

    const handleCardNumberChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        const formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
        setCardNumber(formattedValue.slice(0, 19));
    };

    const handleExpDateChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        let formattedValue = value.slice(0, 4);
        if (formattedValue.length >= 3) {
            formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`;
        }
        setExpDate(formattedValue);
    };

    const handleCvcChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setCvc(value.slice(0, 3));
    };

    const handleReservationSubmit = async () => {
        try {
            if (!userId) {
                throw new Error('User not logged in');
            }

            if (selectedDates.length !== 2) {
                throw new Error('Please select both check-in and check-out dates');
            }

            const [checkInDate, checkOutDate] = selectedDates;
            const totalPrice = calculatePrice(checkInDate, checkOutDate);

            console.log('Submitting reservation with data:', {
                userId: userId,
                locationId,
                hostId: hostId,
                checkInDate,
                checkOutDate,
                price: totalPrice,
            });

            if (!hostId) {
                throw new Error('Host ID is not set');
            }

            const reservationResponse = await axios.post('/createReservation', {
                userId: userId, // Ensure the user ID is included in the request body
                locationId,
                hostId: hostId,
                checkInDate,
                checkOutDate,
                price: totalPrice,
            });

            const reservationId = reservationResponse.data?.id;
            if (!reservationId) {
                throw new Error('Invalid reservation response');
            }

            console.log('Reservation ID:', reservationId);

            await axios.post('/createPayment', {
                reservationId,
                cardNumber: cardNumber.replace(/\s/g, ''),
                expDate,
                cvc,
            });

            alert('Reservation created successfully');
            navigate('/success');
        } catch (error) {
            console.error('Error creating reservation:', error);
            console.log(error.response?.data); // Log the error response from the server
            navigate('/error');
        }
    };

    const calculatePrice = (checkInDate, checkOutDate) => {
        if (!locationInfo) return 0;
        const days = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
        return (locationInfo.PretPeZi * days).toFixed(2);
    };

    const isFormValid = () => {
        return (
            selectedDates.length === 2 &&
            cardNumber.length === 19 &&
            expDate.length === 5 &&
            cvc.length === 3 &&
            price > 0
        );
    };

    if (!ready) {
        return <div>Loading...</div>;
    }

    return (
        <div className="reservation-container p-4 max-w-xl mx-auto bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">Select Date Range</h2>
            <Calendar
                selectRange
                tileDisabled={tileDisabled}
                onChange={handleDateChange}
                className="mb-4"
            />
            <h2 className="text-xl font-bold mb-4">Card Details</h2>
            <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="Card Number"
                maxLength="19"
                required
                className="w-full px-3 py-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="text"
                value={expDate}
                onChange={handleExpDateChange}
                placeholder="Expiration Date (MM/YY)"
                maxLength="5"
                required
                className="w-full px-3 py-2 mb-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="text"
                value={cvc}
                onChange={handleCvcChange}
                placeholder="CVC"
                maxLength="3"
                required
                className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <h2 className="text-xl font-bold mb-4">Total Price: {price} RON</h2>
            <button
                onClick={handleReservationSubmit}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!isFormValid()}
            >
                Submit Reservation
            </button>
        </div>
    );
}
