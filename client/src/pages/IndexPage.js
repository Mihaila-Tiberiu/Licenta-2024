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
  const [lastClickedCounty, setLastClickedCounty] = useState(null);
  const [lastClickedEventType, setLastClickedEventType] = useState(null);

  const handleCountySelect = (selectedCounty) => {
    setCounty(selectedCounty);
    setLastClickedCounty(selectedCounty);
  };

  const handleEventTypeSelect = (selectedEventType) => {
    setEventType(selectedEventType);
    setLastClickedEventType(selectedEventType);
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
    navigate(`/locations?fromLTU=True?county=${county === '' ? null : county}&eventType=${eventType === '' ? null : eventType}&startDate=${startDateFormatted}&endDate=${endDateFormatted}`);
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
      <div className="container mx-auto mt-20">
        <div className="flex flex-wrap justify-center">
          <div className="w-full md:w-1/3 px-4">
            <div className="select-section bg-white rounded-lg shadow-xl p-6 mb-6 border-gray-300 border-2">
              <h2 className="text-lg font-bold mb-4">Selectează județul:</h2>
              <div className="county-bubbles flex flex-wrap mb-4 ">
                <button
                  className={`${lastClickedCounty === 'Bucharest' ? 'bg-gray-400' : 'bg-gray-200'} hover:bg-gray-300 font-semibold py-2 px-4 rounded mr-2 mb-2`}
                  onClick={() => handleCountySelect('Bucharest')}
                >
                  Bucharest
                </button>
                <button
                  className={`${lastClickedCounty === 'Cluj' ? 'bg-gray-400' : 'bg-gray-200'} hover:bg-gray-300 font-semibold py-2 px-4 rounded mr-2 mb-2`}
                  onClick={() => handleCountySelect('Cluj')}
                >
                  Cluj
                </button>
                <button
                  className={`${lastClickedCounty === 'Brasov' ? 'bg-gray-400' : 'bg-gray-200'} hover:bg-gray-300 font-semibold py-2 px-4 rounded mr-2 mb-2`}
                  onClick={() => handleCountySelect('Brasov')}
                >
                  Brasov
                </button>
                <button
                  className={`${lastClickedCounty === 'Constanta' ? 'bg-gray-400' : 'bg-gray-200'} hover:bg-gray-300 font-semibold py-2 px-4 rounded mr-2 mb-2`}
                  onClick={() => handleCountySelect('Constanta')}
                >
                  Constanta
                </button>
                <button
                  className={`${lastClickedCounty === 'Prahova' ? 'bg-gray-400' : 'bg-gray-200'} hover:bg-gray-300 font-semibold py-2 px-4 rounded mr-2 mb-2`}
                  onClick={() => handleCountySelect('Prahova')}
                >
                  Prahova
                </button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/3 px-4">
            <div className="select-section bg-white rounded-lg shadow-xl p-6 mb-6 border-gray-300 border-2">
              <h2 className="text-lg font-bold mb-4">Selectează tipul de eveniment:</h2>
                <div className="event-type-bubbles mb-4">
                  <button
                    className={`${lastClickedEventType === 'Wedding' ? 'bg-gray-400' : 'bg-gray-200'} hover:bg-gray-300 font-semibold py-2 px-4 rounded mr-2 mb-2`}
                    onClick={() => handleEventTypeSelect('Wedding')}
                  >
                    Wedding
                  </button>
                  <button
                    className={`${lastClickedEventType === 'Corporate' ? 'bg-gray-400' : 'bg-gray-200'} hover:bg-gray-300 font-semibold py-2 px-4 rounded mr-2 mb-2`}
                    onClick={() => handleEventTypeSelect('Corporate')}
                  >
                    Corporate
                  </button>
                </div>
            </div>
          </div>

          <div className="w-full md:w-1/3 px-4">
            <div className="select-section bg-white rounded-lg shadow-xl p-6 mb-6 border-gray-300 border-2">
              <h2 className="text-lg font-bold mb-4 pl-5">Selectează datele:</h2>
              <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    handleStartDateChange={handleStartDateChange}
                    handleEndDateChange={handleEndDateChange}
                  />
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <button className="bg-primary hover:bg-green-900 text-white font-bold py-2 px-4 rounded" onClick={handleSearch}>Efectuează căutarea!</button>
        </div>

        <div className="text-center mt-24">
          <p className="text-gray-700">Vrei să realizezi o căutare mai detaliată? Folosește <a className="text-primary underline font-semibold hover:text-green-900" href="/locations">căutarea detaliată!</a></p>
        </div>
      </div>
    </div>
    );
}