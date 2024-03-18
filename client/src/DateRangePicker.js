import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function DateRangePicker(props) {
  const { startDate, endDate, handleStartDateChange, handleEndDateChange } = props;

  return (
    <div className="date-range-picker">
      <div className="start-date-picker">
        <label>Start Date:</label>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="dd-MM-yyyy"
          placeholderText="Select Start Date"
        />
      </div>
      <div className="end-date-picker">
        <label>End Date:</label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="dd-MM-yyyy"
          placeholderText="Select End Date"
        />
      </div>
    </div>
  );
}
