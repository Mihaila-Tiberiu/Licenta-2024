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
                        checkInParts[0], // Year
                        checkInParts[1] - 1, // Month (zero-index)
                        checkInParts[2] // Day
                    );

                    const endDate = new Date(
                        checkOutParts[0], // Year
                        checkOutParts[1] - 1, // Month (zero-index)
                        checkOutParts[2] // Day
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

            const currentDate = new Date();
            const isPastDate = date < currentDate;


            const next7Days = new Date();
            next7Days.setDate(currentDate.getDate() + 7);
            const isNext7Days = date > currentDate && date <= next7Days;


            const isBooked = isDateBooked(date);

            return isPastDate || isNext7Days || isBooked;
        }
    };

    return (
        <div className="calendar-container">
            <h2 className='font-bold pb-1'>Date valabile:</h2>
            <Calendar
                tileDisabled={tileDisabled}
            />
        </div>
    );
}
