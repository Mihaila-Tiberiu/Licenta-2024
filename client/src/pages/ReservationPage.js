import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import Alert from '../Alert';
import {SERVICE_ID_EMAILJS, PUBLIC_KEY_EMAILJS, TEMPLATE_ID_EMAILJS_ALL} from '../config.js';
import emailjs from '@emailjs/browser';

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
            setPrice((locationInfo.PretPeZi * (days-1)).toFixed(2));
        } else {
            setPrice(0);
        }
    }, [selectedDates, locationInfo]);

    const isDateBooked = (date) => {
        return bookedDates.some((booking) => {
            const dayBeforeStart = new Date(booking.startDate);
            dayBeforeStart.setDate(dayBeforeStart.getDate() - 1);

            const dayAfterEnd = new Date(booking.endDate);
            dayAfterEnd.setDate(dayAfterEnd.getDate() + 1);

            return isDateWithinRange(date, dayBeforeStart, dayAfterEnd);
        });
    };

    const isDateWithinRange = (date, startDate, endDate) => {
        return date >= startDate && date <= endDate;
    };

    const tileDisabled = ({ date, view }) => {
        if (view === 'month') {
            // Disable past dates
            const currentDate = new Date();
            const isPastDate = date < currentDate;

            // Disable today and the next 7 days
            const next7Days = new Date();
            next7Days.setDate(currentDate.getDate() + 7);
            const isNext7Days = date > currentDate && date <= next7Days;

            // Check if the date is booked
            const isBooked = isDateBooked(date);

            return isPastDate || isNext7Days || isBooked;
        }
    };

    const handleDateChange = (dates) => {
        if (dates.length === 2) {
            const [start, end] = dates;
            let date = new Date(start);
            let adjacentToDisabled = false;
            let dayBeforeStart = new Date(start);
            dayBeforeStart.setDate(dayBeforeStart.getDate() - 1);
            let dayAfterEnd = new Date(end);
            dayAfterEnd.setDate(dayAfterEnd.getDate() + 1);
    
            // Check if start or end is adjacent to disabled dates
            if (tileDisabled({ date: dayBeforeStart, view: 'month' }) || tileDisabled({ date: dayAfterEnd, view: 'month' })) {
                adjacentToDisabled = true;
            }
    
            if (adjacentToDisabled) {
                Alert.showAlert("Nu puteți selecta datele imediat după sau înainte de date rezervate. Vă rugăm alocați timp pentru amenajare și curățenie.");
                setSelectedDates([]); // Reset selection
                return;
            }
    
            let allValid = true;
            while (date <= end) {
                if (tileDisabled({ date, view: 'month' })) {
                    allValid = false;
                    break;
                }
                date.setDate(date.getDate() + 1);
            }
    
            if (allValid) {
                setSelectedDates([start.toISOString().split('T')[0], end.toISOString().split('T')[0]]);
            } else {
                Alert.showAlert("Intervalul selectat contine date rezervate. Vă rugăm selectați alt interval.");
                setSelectedDates([]); // Reset selection
            }
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

    const sendReservationEmails = async (guestId, hostId, locationId, adjustedCheckInDate, checkOutDate) => {
        try {
            // Fetch guest info
            const guestResponse = await axios.get(`/api/user-info/${guestId}`);
            const guestInfo = guestResponse.data;
    
            // Fetch host info
            const hostResponse = await axios.get(`/api/user-info/${hostId}`);
            const hostInfo = hostResponse.data;
    
            // Fetch location info
            const locationResponse = await axios.get(`/api/LocationInfo/${locationId}`);
            const locationInfo = locationResponse.data.locations[0];
    
            // Calculate amenajare (preparation) and curatenie (cleaning) days
            const dayBeforeCheckIn = new Date(adjustedCheckInDate);
            dayBeforeCheckIn.setDate(dayBeforeCheckIn.getDate() - 1);
    
            const dayAfterCheckOut = new Date(checkOutDate);
            dayAfterCheckOut.setDate(dayAfterCheckOut.getDate() + 1);
    
            const formattedDayBeforeCheckIn = dayBeforeCheckIn.toISOString().split('T')[0];
            const formattedDayAfterCheckOut = dayAfterCheckOut.toISOString().split('T')[0];
    
            // Prepare email data
            const emailHostData = {
                to_email: hostInfo.Email,
                subiect: 'Aveti o noua rezervare la locatia dvs.',
                mesaj: `Locatia dvs ${locationInfo.Nume} are o noua rezervare de pe ${adjustedCheckInDate} pana pe ${checkOutDate}. Aveti ziua de ${formattedDayBeforeCheckIn} pentru amenajare si ziua de ${formattedDayAfterCheckOut} pentru curatenie. Informatiile de contact ale clientului: Email: ${guestInfo.Email}, Telefon: ${guestInfo.Phone}. Aveti 48 ore pentru a anula rezervarea daca doriti acest lucru. `,
            };
    
            const emailGuestData = {
                to_email: guestInfo.Email,
                subiect: 'Rezervarea dvs a fost realizata cu succes',
                mesaj: `Rezervarea dvs la ${locationInfo.Nume} de pe ${adjustedCheckInDate} pana pe ${checkOutDate} a fost confirmata. Informatiile de contact ale gazdei: Email: ${hostInfo.Email}, Telefon: ${hostInfo.Phone}. Aveti 48 ore pentru a anula rezervarea daca doriti acest lucru.`,
            };
    
            // Send emails
            await emailjs.send(SERVICE_ID_EMAILJS, TEMPLATE_ID_EMAILJS_ALL, emailHostData, PUBLIC_KEY_EMAILJS);
            await emailjs.send(SERVICE_ID_EMAILJS, TEMPLATE_ID_EMAILJS_ALL, emailGuestData, PUBLIC_KEY_EMAILJS);
    
            console.log('Emails sent successfully');
        } catch (error) {
            console.error('Error sending reservation emails:', error);
        }
    };

    const handleReservationSubmit = async () => {
        try {
            if (!userId) {
                throw new Error('User not logged in');
            }
    
            if (selectedDates.length !== 2) {
                throw new Error('Please select both check-in and check-out dates');
            }

            if (cardNumber !== "1111 1111 1111 1111") {
                if (cardNumber === "2222 2222 2222 2222") {
                    navigate('/error', { state: { tipEroare: "Fonduri insuficiente" } });
                } else if (cardNumber === "3333 3333 3333 3333") {
                    navigate('/error', { state: { tipEroare: "Card expirat" } });
                } else {
                    navigate('/error', { state: { tipEroare: "Eroare necunoscută" } });
                }
            }
            else {
                const [originalCheckInDate, checkOutDate] = selectedDates;
                const totalPrice = calculatePrice(originalCheckInDate, checkOutDate);
        
                // Increment the check-in date by one day
                let adjustedCheckInDate = new Date(originalCheckInDate);
                adjustedCheckInDate.setDate(adjustedCheckInDate.getDate() + 1);
        
                // Format the dates
                adjustedCheckInDate = adjustedCheckInDate.toISOString().split('T')[0];
        
                console.log('Submitting reservation with data:', {
                    userId: userId,
                    locationId,
                    hostId: hostId,
                    checkInDate: adjustedCheckInDate,
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
                    checkInDate: adjustedCheckInDate,
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

                // TEST // await sendReservationEmails(userId, hostId, locationId, adjustedCheckInDate, checkOutDate);
        
                navigate('/success');
            }
        } catch (error) {
            console.error('Error creating reservation:', error);
            console.log(error.response?.data); // Log the error response from the server
            navigate('/error');
        }
        
    };
    

    const calculatePrice = (checkInDate, checkOutDate) => {
        if (!locationInfo) return 0;
        const days = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
        return (locationInfo.PretPeZi * (days-1)).toFixed(2);
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
        <div className="reservation-container mt-4 p-4 max-w-xl mx-auto bg-white shadow-lg border-gray-300 border-2 rounded-md">
            <h2 className="text-xl font-bold mb-4">Selectați datele rezervării</h2>
            <Calendar
                selectRange
                tileDisabled={tileDisabled}
                onChange={handleDateChange}
                className="mb-4"
            />
            <h3 className='text-red-600 mb-2'>*Nu puteți selecta datele imediat după sau înainte de date rezervate. Vă rugăm alocați timp pentru amenajare și curățenie!</h3>
            <h2 className="text-xl font-bold mb-4">Detaliile cardului</h2>
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
            <h2 className="text-xl font-bold mb-4">Preț total: {price} RON</h2>
            <button
                onClick={handleReservationSubmit}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!isFormValid()}
            >
                Efectuați rezervarea
            </button>
        </div>
    );
}
