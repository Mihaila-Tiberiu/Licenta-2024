import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { DateRangePicker } from "../DateRangePicker";
import 'react-datepicker/dist/react-datepicker.css';
import {format, isValid} from 'date-fns'
import { CitySelect, StateSelect } from "react-country-state-city/dist/cjs";
import { Link } from "react-router-dom";
import axios from 'axios';

const ListingsPage = () => {

    const navigate = useNavigate();
    const [minRating, setMinRating] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [facilitati, setFacilitati] = useState([]);
    const [capacity, setCapacity] = useState('');
    const [pricePerDay, setPricePerDay] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [startDateFormatted, setStartDateFormatted] = useState('');
    const [endDateFormatted, setEndDateFormatted] = useState('');

    const [judet, setJudet] = useState('');
    const [oras, setOras] = useState('');
    const countryid = 181;
    const [stateId, setStateId] = useState('');

    const [filteredFinalLocations, setFilteredFinalLocations] = useState([]);

    const [orderBy, setOrderBy] = useState('');
    const handleOrderChange = (event) => {
        setOrderBy(event.target.value);
    };

    const sortLocations = () => {
        let sortedLocations = [...filteredFinalLocations];
    
        switch (orderBy) {
            case 'ratingDesc':
                sortedLocations.sort((a, b) => b.Rating - a.Rating);
                break;
            case 'capacityDesc':
                sortedLocations.sort((a, b) => b.Capacitate - a.Capacitate);
                break;
            case 'capacityAsc':
                sortedLocations.sort((a, b) => a.Capacitate - b.Capacitate);
                break;
            case 'priceDesc':
                sortedLocations.sort((a, b) => b.PretPeZi - a.PretPeZi);
                break;
            case 'priceAsc':
                sortedLocations.sort((a, b) => a.PretPeZi - b.PretPeZi);
                break;
            default:
                break;
        }
    
        setFilteredFinalLocations(sortedLocations);
    };

    useEffect(() => {
        if (filteredFinalLocations.length > 0) {
            sortLocations();
        }
    }, [filteredFinalLocations, orderBy]);

    useEffect(() => {
        const fetchFilteredLocations = async () => {
            try {
                // Extract parameters from the URL
                const urlParams = new URLSearchParams(window.location.search);
                const Judet = urlParams.get('Judet');
                const MinCapacitate = urlParams.get('MinCapacitate');
                const startDate = urlParams.get('startDate');
                const endDate = urlParams.get('endDate');
                const WordsInDescription = urlParams.get('WordsInDescription');
                const WordsInFacilities = urlParams.get('WordsInFacilities');
                const MinRating = urlParams.get('MinRating');
                const MaxPretPeZi = urlParams.get('MaxPretPeZi');
                const Oras = urlParams.get('Oras');
    
                // Construct params object to pass to Axios GET request
                const params = {
                    Judet,
                    MinCapacitate,
                    startDate,
                    endDate,
                    WordsInDescription,
                    WordsInFacilities,
                    MinRating,
                    MaxPretPeZi,
                    Oras
                };
                console.log(params);
    
                const response = await axios.get('/filterLocations', { params });
                if (!response.data || !Array.isArray(response.data)) {
                    throw new Error('Invalid data format for locations');
                }
                
                const locationsWithImages = await Promise.all(response.data.map(async location => {
                    const imageResponse = await axios.get(`/getImageUrls/${location.IdLocatie}`);
                    if (imageResponse.data && Array.isArray(imageResponse.data)) {
                        location.images = imageResponse.data.map(url => ({ URLimagine: url }));
                    } else {
                        location.images = [];
                    }
                    return location;
                }));
    
                setFilteredFinalLocations(locationsWithImages);
            } catch (error) {
                console.error('Error fetching filtered locations:', error.message);
            }
        };
    
        fetchFilteredLocations();
    }, []);
    

    const handleSearchTerm = (event) => {
        setSearchTerm(event.target.value);
    };

    function handleCbClick(ev) {
        const clickedFacility = ev.target.value;

        setFacilitati(prevFacilitati => {
            if (prevFacilitati.includes(clickedFacility)) {
                return prevFacilitati.filter(facility => facility !== clickedFacility);
            } else {
                return [...prevFacilitati, clickedFacility];
            }
        });    
    }

    const handleSubmit = (event) => {
        navigate(`/listings?Judet=${judet}`
        +`&MinCapacitate=${capacity}`
        +`&startDate=${startDateFormatted}`
        +`&endDate=${endDateFormatted}`
        +`&WordsInDescription=${searchTerm}`
        +`&WordsInFacilities=${facilitati.length ===  0 ? '' : facilitati.join(", ")}`
        +`&MinRating=${minRating}`
        +`&MaxPretPeZi=${pricePerDay}`
        +`&Oras=${oras}`);
        window.location.reload();
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

  return (
    <div className='min-h-screen'>
        <header className="bg-primary text-white text-center pt-5 pb-10">
            <div className="container mx-auto">
            
                <h2 className="text-4xl font-bold mb-4"> 
                    Locații disponibile
                </h2>
            </div>
        </header>
        <div className="flex justify-center items-center mt-5 mb-5 m-auto">
            <button 
                className={`font-bold py-2 px-4 rounded border-2 border-gray-300 hover:bg-gray-300 ${showFilters ? 'bg-gray-400 border-transparent border-2' : 'bg-gray-200'}`} 
                onClick={() => setShowFilters(!showFilters)}
            >
                {showFilters ? "Ascunde Filtre" : "Afișează Filtre"}
            </button>
            <select
                className="cursor-pointer py-2 px-4 font-bold rounded border-2 ml-2 border-gray-300 hover:bg-gray-300"
                value={orderBy}
                onChange={handleOrderChange}
            >
                <option value="">Nu sorta</option>
                <option value="ratingDesc">Cel mai bun rating</option>
                <option value="capacityDesc">Cea mai mare capacitate</option>
                <option value="capacityAsc">Cea mai mică capacitate</option>
                <option value="priceDesc">Cel mai mare preț</option>
                <option value="priceAsc">Cel mai mic preț</option>
            </select>
        </div>

        {showFilters && (
        <div className="w-3/4 flex m-auto">
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                <label className="block  text-sm font-bold mb-2">
                    Rating minim:
                </label>
                <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.5}
                    value={minRating}
                    onChange={(e) => setMinRating(parseFloat(e.target.value))}
                    className="slider appearance-none w-full h-3 bg-gray-200 rounded-full outline-none mb-4"
                />
                <span>{minRating} ⭐</span>
                </div>
                <div className="mb-4">
                <label className="block  text-sm font-bold mb-2">
                    Cuvinte cheie in descriere:
                </label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchTerm}
                    placeholder='Separă cuvintele cheie prin virgulă (ex: însorit, minunat)'
                    className="input-box"
                />
                </div>
                <div className="mb-4">
                <label className="block  text-sm font-bold mb-2">
                    Facilități:
                </label>
                <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                    <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                        <input type="checkbox" value="Afară" onChange={handleCbClick}/>
                        <span>Afară 🌳</span>
                    </label>
                    <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                        <input type="checkbox" value="Wi-Fi" onChange={handleCbClick}/>
                        <span>Wi-Fi 🛜</span>
                    </label>
                    <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                        <input type="checkbox" value="Animale de companie permise" onChange={handleCbClick}/>
                        <span>Animale de companie permise 🐶</span>
                    </label>
                    <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                        <input type="checkbox" value="Parcare privată" onChange={handleCbClick}/>
                        <span>Parcare privată 🅿️</span>
                    </label>
                </div>
                </div>
                <div className="mb-4">
                <label className="block  text-sm font-bold mb-2">
                    Capacitate minimă:
                </label>
                <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="input-box"
                    placeholder='Numarul maxim de persoane'
                />
                </div>
                <div className="mb-4">
                <label className="block  text-sm font-bold mb-2">
                    Preț pe zi maxim:
                </label>
                <input
                    type="number"
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(e.target.value)}
                    className="input-box"
                    placeholder='Pretul maxim pe zi exprimat in RON'
                />
                </div>
                <div>
                    <h2 className="block  text-sm font-bold mb-6">Județul locației:</h2>
                    <StateSelect
                        countryid={countryid}
                        onChange={(e) => {
                            setStateId(e.id);
                            setJudet(e.name);
                        }}
                        placeHolder="Călărași"
                    />
                    <h2 className="block  text-sm font-bold mb-6">Orașul locației</h2>
                    <CitySelect
                        countryid={countryid}
                        stateid={stateId}
                        onChange={(e) => {
                            setOras(e.name);
                        }}
                        placeHolder="Oltenița"
                    />
                </div>
                <label className="block  text-sm font-bold mb-2">
                    Selectează datele:
                </label>
                <div className="w-full px-4">
                    <div className="select-section bg-white rounded-lg p-6 mb-6">
                    <DateRangePicker
                            startDate={startDate}
                            endDate={endDate}
                            handleStartDateChange={handleStartDateChange}
                            handleEndDateChange={handleEndDateChange}
                        />
                    </div>
                </div>
                <div className="mb-4">
                <button onClick={handleSubmit} className="bg-primary hover:bg-green-900 text-white font-bold py-2 px-4 rounded w-auto flex mx-auto">
                    Caută
                </button>
                </div>
            </div>
        </div>
        )}
        <div className="w-2/4 mx-auto">
    {filteredFinalLocations.length > 0 ? (
        filteredFinalLocations.map(location => (
            <Link to={'/listings/'+location.IdLocatie} key={location.IdLocatie} className="bg-gray-200 p-4 rounded-2xl flex gap-4 mt-4 cursor-pointer border-2 border-gray-300 shadow-lg relative">
                <div className="bg-gray-300 w-48 h-48 rounded-2xl border overflow-hidden relative">
                    {location.images.length > 0 && (
                        <img className="w-full h-full object-cover object-center" src={`http://localhost:4000/uploads/${location.images[0].URLimagine}`} alt="" />
                    )}
                </div>
                <div className="flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold">{location.Nume}</h2>
                        <p>{location.Oras}, {location.Judet}</p>
                        <p>{location.Rating !== 0 ? location.Rating + '⭐' : 'Nu exista recenzii'}</p>
                        <p>Cap. {location.Capacitate} persoane</p>
                        <p>Preț pe zi: {location.PretPeZi} RON</p>
                        <p>Facilități: {location.Facilitati}</p> 
                    </div>
                </div>
            </Link>
        ))
    ) : (
        <h1 className="text-center text-xl mt-10">Nu există rezultate pentru căutarea dumneavoastră. Încercați alte filtre.</h1>
    )}
</div>

    </div>
  );
};

export default ListingsPage;
