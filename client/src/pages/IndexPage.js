import CustomizableLocationCard from "../CustomizableLocationCard";
import Header from "../Header";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DateRangePicker } from "../DateRangePicker";
import 'react-datepicker/dist/react-datepicker.css';
import {format, setDate} from 'date-fns'

export default function IndexPage(){

  const navigate = useNavigate();
  const [county, setCounty] = useState('');
  const [eventType, setEventType] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateFormatted, setStartDateFormatted] = useState(null);
  const [endDateFormatted, setEndDateFormatted] = useState(null);

  const handleCountySelect = (selectedCounty) => {
    setCounty(selectedCounty);
  };

  const handleEventTypeSelect = (selectedEventType) => {
    setEventType(selectedEventType);
  };

  const handleStartDateChange = (date) => {
    let c1 = format(date, 'dd-MM-yyyy');
    setStartDateFormatted(c1);

    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    let c2 = format(date, 'dd-MM-yyyy');
    setEndDateFormatted(c2);

    setEndDate(date);
  };

  const handleSearch = () => {
    // Redirect to locations page with parameters
    navigate(`/locations?county=${county}&eventType=${eventType}&startDate=${startDateFormatted}&endDate=${endDateFormatted}`);
  };


    return(
      <div className="bg-gray-100 min-h-screen">
      
      <header className="bg-primary text-white text-center pt-5 pb-10">
        <div className="container mx-auto">
          
            <h2 className="text-4xl font-bold mb-4"> 
            <a href="#" className="hover:text-gray-300">Găsește locul ideal pentru ocazia ta.</a>
            </h2>
            <p className="text-lg">
            <a href="#" className="hover:text-gray-300">
            Descoperă locații inedite pentru evenimentele tale.</a>
            </p>
        </div>
      </header>
      <section className="container mx-auto py-10">
      <h2 className="text-4xl font-bold mb-4 flex justify-center text-primary"> Găsește locații minunate în orice județ din România</h2>
        <div className="">
          <div className="select-section">
            <h2>Select your county:</h2>
            <div className="county-bubbles">
              <button onClick={() => handleCountySelect('Bucharest')}>Bucharest</button>
              <button onClick={() => handleCountySelect('Cluj')}>Cluj</button>
              <button onClick={() => handleCountySelect('Brasov')}>Brasov</button>
              <button onClick={() => handleCountySelect('Constanta')}>Constanta</button>
              <button onClick={() => handleCountySelect('Prahova')}>Prahova</button>
              {/* Add more county buttons as needed */}
            </div>
          </div>

          <div className="select-section">
            <h2>Select your event type:</h2>
            <div className="event-type-bubbles">
              <button onClick={() => handleEventTypeSelect('Wedding')}>Wedding</button>
              <button onClick={() => handleEventTypeSelect('Corporate')}>Corporate</button>
              {/* Add more event type buttons as needed */}
            </div>
          </div>

          <div className="select-section">
            <h2>Select your date range:</h2>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              handleStartDateChange={handleStartDateChange}
              handleEndDateChange={handleEndDateChange}
            />
          </div>

          <button onClick={handleSearch}>Look them up!</button>

          <div className="additional-options">
            <p>Need more accuracy? Use our detailed search!</p>
            <button onClick={() => navigate('/locations')}>Go to detailed search</button>
          </div>
        </div>

      </section>
    </div>
    );
}