import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { DateRangePicker } from "../DateRangePicker";
import 'react-datepicker/dist/react-datepicker.css';
import {format, isValid} from 'date-fns'
import { CitySelect, StateSelect } from "react-country-state-city/dist/cjs";
import { Link } from "react-router-dom";

const ListingsPage = () => {

    let locations = [
        {
          "IdLocatie": 10,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "test2",
          "Adresa": "tes5",
          "Nume": "test1",
          "Oras": "Aiudul de Sus",
          "Judet": "Alba",
          "Rating": 1,
          "Capacitate": 111,
          "PretPeZi": 23,
          "Facilitati": "Afară, Animale de companie permise",
          "images": []
        },
        {
          "IdLocatie": 11,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "eqwewqewq",
          "Adresa": "ewqwqeq",
          "Nume": "yeqwygeqwewq",
          "Oras": "eqweqw",
          "Judet": "ewqeqweqw",
          "Rating": 0,
          "Capacitate": 14,
          "PretPeZi": 15,
          "Facilitati": "Afară, Wi-Fi, Animale de companie permise, Parcare privată",
          "images": []
        },
        {
          "IdLocatie": 12,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "eqweqw",
          "Adresa": "ewq",
          "Nume": "qeqw",
          "Oras": "weq",
          "Judet": "ewqe",
          "Rating": 0,
          "Capacitate": 11,
          "PretPeZi": 312,
          "Facilitati": "Afară, Wi-Fi",
          "images": []
        },
        {
          "IdLocatie": 36,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "noe2",
          "Adresa": "noe6",
          "Nume": "noe1",
          "Oras": "noe5",
          "Judet": "noe4",
          "Rating": 0,
          "Capacitate": 31,
          "PretPeZi": 331,
          "Facilitati": "Wi-Fi, Animale de companie permise, Parcare privată, Afară",
          "images": []
        },
        {
          "IdLocatie": 40,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "",
          "Oras": "Bucuresti",
          "Judet": "",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 41,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "",
          "Oras": "București",
          "Judet": "",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 42,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "",
          "Oras": "București",
          "Judet": "",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 43,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "",
          "Oras": "București",
          "Judet": "",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 44,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "",
          "Oras": "București",
          "Judet": "",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 45,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "",
          "Oras": "București",
          "Judet": "",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 46,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "",
          "Oras": "Iași",
          "Judet": "",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 47,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "",
          "Oras": "Iași",
          "Judet": "",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 48,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "",
          "Oras": "Iași",
          "Judet": "",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 49,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "",
          "Oras": "Iași",
          "Judet": "",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 50,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "",
          "Oras": "Constanța",
          "Judet": "",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 51,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "",
          "Oras": "Constanța",
          "Judet": "",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 52,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "",
          "Oras": "Cluj-Napoca",
          "Judet": "",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 53,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "",
          "Oras": "Cluj-Napoca",
          "Judet": "",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 54,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "",
          "Oras": "Timișoara",
          "Judet": "",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 55,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "",
          "Oras": "Timișoara",
          "Judet": "",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 56,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "",
          "Oras": "",
          "Judet": "",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 57,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "bacau test - barlanesti",
          "Oras": "Bârsăneşti",
          "Judet": "Bacău County",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 58,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "",
          "Oras": "",
          "Judet": "Bihor County",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 59,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "",
          "Oras": "",
          "Judet": "Bihor County",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 60,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "",
          "Adresa": "",
          "Nume": "",
          "Oras": "",
          "Judet": "Alba",
          "Rating": 0,
          "Capacitate": "",
          "PretPeZi": "",
          "Facilitati": "",
          "images": []
        },
        {
          "IdLocatie": 61,
          "UtilizatorIdUtilizator": 2,
          "Descriere": "a",
          "Adresa": "a",
          "Nume": "a",
          "Oras": "Aiud",
          "Judet": "Alba",
          "Rating": 0,
          "Capacitate": 110,
          "PretPeZi": 111,
          "Facilitati": "Wi-Fi",
          "images": []
        }
      ]

      

    const navigate = useNavigate();
    const [minRating, setMinRating] = useState(0);
    const [searchTerm, setSearchTerm] = useState(null);
    const [facilitati, setFacilitati] = useState([]);
    const [capacity, setCapacity] = useState(null);
    const [pricePerDay, setPricePerDay] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startDateFormatted, setStartDateFormatted] = useState(null);
    const [endDateFormatted, setEndDateFormatted] = useState(null);

    const [judet, setJudet] = useState(null);
    const [oras, setOras] = useState(null);
    const countryid = 181;
    const [stateId, setStateId] = useState(null);

    const [filteredLocations, setFilteredLocations] = useState([]);

    useEffect(() => {
    // Extracting parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);

    // Define a function to check if a parameter exists and is valid
    const isValidParam = (paramName, locationValue) => {
        const paramValue = urlParams.get(paramName);
        return !paramValue || locationValue === paramValue || paramValue === "null";
    };

    const isValidCapacitate = (paramName, locationValue) => {
        const paramValue = urlParams.get(paramName);
        return !paramValue || parseInt(locationValue) >= parseInt(paramValue) || paramValue === "null";
    }

    // Update the state with filtered locations
    setFilteredLocations(locations.filter(location => {
        return isValidParam("Judet", location.Judet) &&
            isValidCapacitate("Capacitate", location.Capacitate) &&
            isValidParam("Oras", location.Oras);
                // TODO: add all parameters
        }));
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        // You can implement search functionality here
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
        +`&Capacitate=${capacity}`
        +`&startDate=${startDateFormatted}`
        +`&endDate=${endDateFormatted}`
        +`&WordsInDescription=${searchTerm}`
        +`&WordsInFacilities=${facilitati.length ===  0 ? null : facilitati.join(", ")}`
        +`&Rating=${minRating}`
        +`&PretPeZi=${pricePerDay}`
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

        <button 
            className={`font-bold py-2 px-4 rounded mt-5 mb-5 m-auto w-max flex border-2 border-gray-300 hover:bg-gray-300 ${showFilters ? 'bg-gray-400 border-transparent border-2' : 'bg-gray-200'}`} 
            onClick={() => setShowFilters(!showFilters)}
        >
            {showFilters ? "Ascunde Filtre" : "Afișează Filtre"}
        </button>

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
                    step={0.1}
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
                    onChange={handleSearch}
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
                    Capacitate:
                </label>
                <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="input-box"
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
        {filteredLocations.length > 0 && filteredLocations.map(location => (
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
                        <p>Preț pe zi: {location.PretPeZi}</p>
                        <p>Facilități: {location.Facilitati}</p> 
                    </div>
                </div>
            </Link>
        ))}
        </div>
    </div>
  );
};

export default ListingsPage;
