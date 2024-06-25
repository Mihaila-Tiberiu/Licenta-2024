import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { DateRangePicker } from "../DateRangePicker";
import 'react-datepicker/dist/react-datepicker.css';
import {format} from 'date-fns'

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
    // Redirect to listings page with parameters
    navigate(`/listings?Judet=${county}`
    +`&MinCapacitate=${eventType}`
    +`&startDate=${(startDateFormatted) ? startDateFormatted : ''}`
    +`&endDate=${(endDateFormatted) ? endDateFormatted : ''}`);
  };


    return(
      <div className="bg-gray-100 min-h-screen">
      
      <header className="bg-primary text-white text-center pt-5 pb-10">
        <div className="container mx-auto">
          
            <h2 className="text-4xl font-bold mb-4"> 
            <a href="/" className="hover:text-gray-300">Găsește locul ideal pentru ocazia ta.</a>
            </h2>
            <p className="text-lg">
            <a href="/listings" className="hover:text-gray-300">
            Descoperă locații inedite pentru evenimentele tale.</a>
            </p>
        </div>
      </header>
      <div className="container mx-auto mt-20">
        <div className="flex flex-wrap justify-center">
          <div className="w-full md:w-1/3 px-4">
            <div className="select-section bg-white rounded-lg shadow-xl p-6 mb-6 border-gray-300 border-2">
              <h2 className="text-lg font-bold mb-4">Cele mai populare județe:</h2>
              <div className="county-bubbles flex flex-wrap mb-4 ">
                <button
                  className={`${lastClickedCounty === 'Bucharest' ? 'bg-gray-400' : 'bg-gray-200'} hover:bg-gray-300 font-semibold py-2 px-4 rounded mr-2 mb-2`}
                  onClick={() => handleCountySelect('Bucharest')}
                >
                  București
                </button>
                <button
                  className={`${lastClickedCounty === 'Cluj County' ? 'bg-gray-400' : 'bg-gray-200'} hover:bg-gray-300 font-semibold py-2 px-4 rounded mr-2 mb-2`}
                  onClick={() => handleCountySelect('Cluj County')}
                >
                  Cluj
                </button>
                <button
                  className={`${lastClickedCounty === 'Brașov County' ? 'bg-gray-400' : 'bg-gray-200'} hover:bg-gray-300 font-semibold py-2 px-4 rounded mr-2 mb-2`}
                  onClick={() => handleCountySelect('Brașov County')}
                >
                  Brașov
                </button>
                <button
                  className={`${lastClickedCounty === 'Constanța County' ? 'bg-gray-400' : 'bg-gray-200'} hover:bg-gray-300 font-semibold py-2 px-4 rounded mr-2 mb-2`}
                  onClick={() => handleCountySelect('Constanța County')}
                >
                  Constanța
                </button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/3 px-4">
            <div className="select-section bg-white rounded-lg shadow-xl p-6 mb-6 border-gray-300 border-2">
              <h2 className="text-lg font-bold mb-4">Capacitatea locatiei:</h2>
                <div className="event-type-bubbles mb-4">
                  <button
                    className={`${lastClickedEventType === '50' ? 'bg-gray-400' : 'bg-gray-200'} hover:bg-gray-300 font-semibold py-2 px-4 rounded mr-2 mb-2`}
                    onClick={() => handleEventTypeSelect('50')}
                  >
                    50 pers.
                  </button>
                  <button
                    className={`${lastClickedEventType === '100' ? 'bg-gray-400' : 'bg-gray-200'} hover:bg-gray-300 font-semibold py-2 px-4 rounded mr-2 mb-2`}
                    onClick={() => handleEventTypeSelect('100')}
                  >
                    100 pers.
                  </button>
                  <button
                    className={`${lastClickedEventType === '200' ? 'bg-gray-400' : 'bg-gray-200'} hover:bg-gray-300 font-semibold py-2 px-4 rounded mr-2 mb-2`}
                    onClick={() => handleEventTypeSelect('200')}
                  >
                    200 pers.
                  </button>

                </div>
            </div>
          </div>

          <div className="w-full md:w-1/3 px-4">
            <div className="select-section bg-white rounded-lg shadow-xl p-6 mb-6 border-gray-300 border-2">
              <h2 className="text-lg font-bold mb-4 pl-5">Selectează datele evenimentului:</h2>
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
          <p className="text-gray-700">Vrei să realizezi o căutare mai detaliată? Folosește <a className="text-primary underline font-semibold hover:text-green-900" href="/listings">căutarea detaliată!</a></p>
        </div>
      </div>
    </div>
    );
}