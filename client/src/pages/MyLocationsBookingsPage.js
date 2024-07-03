import { Link } from 'react-router-dom';
import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { UserContext } from '../UserContext';
import Alert from '../Alert';
import { useNavigate, Navigate } from "react-router-dom";
import {SERVICE_ID_EMAILJS, PUBLIC_KEY_EMAILJS, TEMPLATE_ID_EMAILJS_ALL} from '../config.js';
import emailjs from '@emailjs/browser';

export default function MyBookingsPage() {

    const { user } = useContext(UserContext);
    const [allUserBookings, setAllUserBookings] = useState([]);
    const [next48hrsUserBookings, setNext48hrsUserBookings] = useState([]); 
    const [locationDetails, setLocationDetails] = useState({});

    useEffect(() => {
        const fetchAllUserBookings = async () => {
          try {
            const response = await axios.get(`/getAllUserBookingsHOST/${user.IdUtilizator}`);
            setAllUserBookings(response.data);

            const response2 = await axios.get(`/getAllUserBookings48HoursHOST/${user.IdUtilizator}`);
            setNext48hrsUserBookings(response2.data);
            
            // Fetch location details for each booking
            const locationsPromises = response.data.map(booking => 
                axios.get(`/api/LocationInfo/${booking.LocatiiIdLocatie2}`)
            );
            const locationsData = await Promise.all(locationsPromises);
            const locationsDetailsMap = {};
            locationsData.forEach((response, index) => {
                const locationId = response.data.locations[0].IdLocatie;
                locationsDetailsMap[locationId] = response.data.locations[0];
            });
            setLocationDetails(locationsDetailsMap);
          } catch (error) {
            console.error('Error fetching user`s location bookings:', error);
          }
        };
        fetchAllUserBookings();
    }, [user.IdUtilizator, locationDetails]);

    async function handleDeleteBooking(IdRezervare) {
        try {
            await axios.put(`/cancelBookingByHost/${IdRezervare}`);

            const userEmailResponse = await axios.get(`/getGuestEmailByBookingId/${IdRezervare}`);
            const bookingDetailsResponse = await axios.get(`/getBookingDetails/${IdRezervare}`);
    
            const emailParams = {
                subiect: 'Rezervare anulată de către gazdă',
                mesaj: `Rezervarea cu data de check-in ${bookingDetailsResponse.data.CheckInDate} și data de check-out ${bookingDetailsResponse.data.CheckOutDate} a fost anulată de către gazdă.`,
                to_email: userEmailResponse.data.email
            };
    
            await emailjs.send(SERVICE_ID_EMAILJS, TEMPLATE_ID_EMAILJS_ALL, emailParams, PUBLIC_KEY_EMAILJS);
            Alert.showAlert('Rezervarea a fost anulată și oaspetele a fost notificat.');
        } catch (error) {
            console.error('Failed to delete booking or send email:', error);
            Alert.showAlert('Eroare la anularea rezervării.');
        }
    };

    const navigate = useNavigate(); // Initialize useNavigate hook

    // Define handleRedirect function
    const handleRedirect = (url) => {
        navigate(url); // Navigate to the specified URL
    };

   return (
      <div className="min-h-screen">
            <div className="w-2/4 mx-auto">
                <h2 className="text-center text-xl mt-4  mb-4 font-bold">Rezervările la locațiile tale</h2>
                {allUserBookings.length > 0 && allUserBookings.map(booking => (
                    <div key={booking.LocatiiIdLocatie2} className="bg-gray-200 p-4 rounded-2xl flex gap-4 mt-4 cursor-pointer border-2 border-gray-300 shadow-lg relative" title="Apasă pentru a vizualiza locația">
                    <div onClick={() => handleRedirect('/listings/' + booking.LocatiiIdLocatie2)} className="bg-gray-300 w-48 h-48 rounded-2xl border overflow-hidden relative">
                        {locationDetails[booking.LocatiiIdLocatie2] && locationDetails[booking.LocatiiIdLocatie2].images.length > 0 && (
                            <img className="w-full h-full object-cover object-center" src={`http://localhost:4000/uploads/${locationDetails[booking.LocatiiIdLocatie2].images[0].URLimagine}`} alt="" />
                        )}
                    </div>
                    <div className="flex flex-col justify-between" onClick={() => handleRedirect('/listings/' + booking.LocatiiIdLocatie2)} >
                        <div>
                            <h2 className="text-xl font-bold">{locationDetails[booking.LocatiiIdLocatie2]?.Nume}</h2>
                            <p>{locationDetails[booking.LocatiiIdLocatie2]?.Oras}, {locationDetails[booking.LocatiiIdLocatie2]?.Judet}</p>
                            <p>Date rezervate: {booking.CheckInDate} - {booking.CheckOutDate}</p>
                            <p>Pret total: {booking.Pret} RON</p>
                            <p>Data și ora rezervării: {booking.BookingTimestamp}</p>
                            <p>Status: {booking.Status}</p>
                        </div>
                    </div>
                        {next48hrsUserBookings.find(item => item.IdRezervare === booking.IdRezervare) && (
                            <button className="absolute top-2 right-2 bg-transparent border-none">
                                <div title="Anulează rezervarea">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 cursor-pointer bg-gray-200 rounded p-1 tooltip hover:text-white hover:bg-red-700" onClick={() => handleDeleteBooking(booking.IdRezervare)} title="Delete photo">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </div>
                            </button>
                        )}
                    </div> 
                ))}
            </div>
      </div>
   );
}
