import { Link, Navigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { UserContext } from '../UserContext';
import Alert from '../Alert';

export default function MyBookingsPage() {

    const { user } = useContext(UserContext);
    const [allUserBookings, setAllUserBookings] = useState([]);
    const [next48hrsUserBookings, setNext48hrsUserBookings] = useState([]); 
    

    useEffect(() => {
        const fetchAllUserBookings = async () => {
          try {
            const response = await axios.get(`/getAllUserBookings/${user.IdUtilizator}`);
            setAllUserBookings(response.data);

            const response2 = await axios.get(`/getAllUserBookings48Hours/${user.IdUtilizator}`);
            setNext48hrsUserBookings(response2.data);
          } catch (error) {
            console.error('Error fetching user bookings:', error);
          }
        };
        fetchAllUserBookings();
    }, [user.IdUtilizator]);

    async function handleDeleteBooking(IdRezervare) {
        try {
            alert("Doing my best :(");
            // await axios.delete(`/deleteLocation/${locationId}`);
        } catch (error) {
            console.error('Nu a putut fi stearsa rezervarea:', error);
            console.log(IdRezervare);
        }
    };

   return (
      <div className="min-h-screen">
            <div className="w-2/4 mx-auto">
                <h2 className="text-center text-xl mt-4  mb-4 font-bold">Rezervările tale</h2>
                {allUserBookings.length > 0 && allUserBookings.map(booking => (
                    <div key={booking.IdRezervare} className="bg-gray-200 p-4 rounded-2xl flex gap-4 mt-4 border-2 border-gray-300 shadow-lg relative">
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-bold">Rezervare</h2>
                                <p>{booking.IdRezervare}</p>
                                <p>{booking.LocatiiIdLocatie2}</p>
                                <p>Check In Date {booking.CheckInDate}</p>
                                <p>Check Out Date {booking.CheckOutDate}</p>
                                <p>Pret {booking.Pret}</p>
                                <p>Status {booking.Status}</p>
                                <p>Timestamp {booking.BookingTimestamp}</p>
                            </div>
                        </div>
                        {next48hrsUserBookings.find(item => item.IdRezervare === booking.IdRezervare) && (
                            <button className="absolute top-2 right-2 bg-transparent border-none">
                                <div title="Șterge locația">
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
