import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function DateRangePicker(props) {
  const { startDate, endDate, handleStartDateChange, handleEndDateChange } = props;

  return (
    <div className="date-range-picker flex justify-between items-center">
      <div className="start-date-picker pl-5 pr-5 w-3/4">
        <label>Data de început:</label>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="dd-MM-yyyy"
          placeholderText="Selectează"
          className='border border-gray-300 rounded'
        />
      </div>
      <div className="pl-5 pr-5 end-date-picker w-3/4">
        <label>Data de sfârșit:</label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="dd-MM-yyyy"
          placeholderText="Selectează"
          className='border border-gray-300 rounded'
        />
      </div>
    </div>
  );
}
