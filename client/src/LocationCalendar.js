import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function LocationCalendar({ locationId }) {
    const [bookedDates, setBookedDates] = useState([]);

    useEffect(() => {
        const fetchBookedDates = async () => {
            try {
                const response = await axios.get(`/getLocationBookings/${locationId}`);
                const dates = response.data.map((booking) => {
                    const checkInParts = booking.CheckInDate.split('-');
                    const checkOutParts = booking.CheckOutDate.split('-');

                    const startDate = new Date(
                        checkInParts[2], // Year
                        checkInParts[1] - 1, // Month (zero-indexed)
                        checkInParts[0] // Day
                    );

                    const endDate = new Date(
                        checkOutParts[2], // Year
                        checkOutParts[1] - 1, // Month (zero-indexed)
                        checkOutParts[0] // Day
                    );

                    return { startDate, endDate };
                });
                setBookedDates(dates);
            } catch (error) {
                console.error('Error fetching booked dates:', error);
            }
        };

        fetchBookedDates();
    }, [locationId]);

    const isDateBooked = (date) => {
        return bookedDates.some((booking) => isDateWithinRange(date, booking.startDate, booking.endDate));
    };

    const isDateWithinRange = (date, startDate, endDate) => {
        return date >= startDate && date <= endDate;
    };

    const tileDisabled = ({ date, view }) => {
        // Disable past dates
        const currentDate = new Date();
        const isPastDate = date < currentDate;

        // Disable today and the next 7 days
        const next7Days = new Date();
        next7Days.setDate(currentDate.getDate() + 7);
        const isNext7Days = date > currentDate && date <= next7Days;

        // Check if the date is booked
        const isBooked = isDateBooked(date);

        // Disable if it's a past date, today, within the next 7 days, or if it's booked
        return isPastDate || isNext7Days || isBooked;
    };

    return (
        <div className="calendar-container">
            <h2 className='font-bold pb-1'>Date valabile</h2>
            <Calendar
                tileDisabled={tileDisabled}
            />
        </div>
    );
}
