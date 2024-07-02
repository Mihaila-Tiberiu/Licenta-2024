import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import { CitySelect, StateSelect } from 'react-country-state-city';

export default function PlacesPage(){
    const {action} = useParams();
    const [denumire, setDenumire]= useState('');
    const [descriere, setDescriere] = useState('');
    const [judet, setJudet] = useState('');
    const [oras, setOras] = useState('');
    const [alte, setAlte] = useState('');
    const [capacitate, setCapacitate] = useState('');
    const [ppzi, setPpzi] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [facilitati, setFacilitati] = useState([]);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [redirect, setRedirect] = useState('');
    
    const countryid = 181;
    const [stateId, setStateId] = useState(0);

    const { user } = useContext(UserContext);

    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchUserLocations = async () => {
          try {
            const response = await axios.get(`/api/userLocations?userId=${user.IdUtilizator}`);
            setLocations(response.data.locations);
          } catch (error) {
            console.error('Error fetching user locations:', error);
          }
        };
        fetchUserLocations();
      }, [user.IdUtilizator]);

    useEffect(()=> {
        
        if (!isNaN(parseInt(action))) {
            axios.get('/places/'+action).then(response => {

                const {data} = response;
                
                setDenumire(data.Nume);
                setDescriere(data.Descriere);
                setJudet(data.Judet);
                setOras(data.Oras);
                setAlte(data.Adresa);
                setCapacitate(data.Capacitate);
                setPpzi(data.PretPeZi);
                setCheckIn(data.CheckIn);
                setCheckOut(data.CheckOut);
                const facilitiesSplit = (data.Facilitati).split(", ");
                setFacilitati(facilitiesSplit);

                const fetchImageUrls = async () => {
                    try {
                        const response = await axios.get('/getImageUrls/' + action); // Replace placeId with the actual location ID
                        setAddedPhotos(response.data);
                    } catch (error) {
                        console.error('Error fetching image URLs:', error);
                    }
                };
        
                fetchImageUrls();

            });
        }
        else {
            setDenumire('');
            setDescriere('');
            setJudet('');
            setOras('');
            setAlte('');
            setCapacitate('');
            setPpzi('');
            setCheckIn('');
            setCheckOut('');
            
            setAddedPhotos([]);
            setFacilitati([]);
        }

    }, [action]);

    const [canDelete, setCanDelete] = useState({});

    useEffect(() => {
        const checkReservations = async () => {
            const resPromises = locations.map(async (location) => {
                const response = await axios.get(`/api/checkReservations/${location.IdLocatie}`);
                return { id: location.IdLocatie, canDelete: response.data.canDelete };
            });
            const results = await Promise.all(resPromises);
            setCanDelete(results.reduce((acc, curr) => ({ ...acc, [curr.id]: curr.canDelete }), {}));
        };
        checkReservations();
    }, [locations]);

    function uploadPhoto(ev) {
        console.log(addedPhotos);//
        const files = ev.target.files;
        const data = new FormData();
        for (let i = 0; i < files.length; i++){
            data.append('photos', files[i]);
        }
        axios.post('/upload', data, {
            headers: {'Content-Type': 'multipart/form-data'}
        }).then(response => {
            const {data:filenames} = response;
            setAddedPhotos(prev => {
                return [...prev, ...filenames];
            })
        })
    }

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

    async function addNewPlace(ev){
        ev.preventDefault();

        const facilitatiString = facilitati.join(', ');

        const placeData = 
        {
            utilizatorIdUtilizator: user.IdUtilizator,
            denumire,
            descriere,
            judet,
            oras,
            alte,
            capacitate,
            ppzi,
            addedPhotos,
            facilitati: facilitatiString,
            checkIn,
            checkOut
        }
        try {
            await axios.post('/addNewLocation', placeData);
            setRedirect('/account/places');
        } catch (error) {
            console.error('Nu a putut fi adaugata o noua locatie:', error);
        }
    }

    async function editPlace(ev){
        ev.preventDefault();

        const facilitatiString = facilitati.join(', ');

        const placeData = 
        {
            locationId: action,
            utilizatorIdUtilizator: user.IdUtilizator,
            denumire,
            descriere,
            judet,
            oras,
            alte,
            capacitate,
            ppzi,
            addedPhotos,
            facilitati: facilitatiString,
            checkIn,
            checkOut
        }

        try {
            await axios.post('/editLocation', placeData);
            setRedirect('/account/places');
        } catch (error) {
            console.error('Nu a putut fi editata locatia:', error);
        }
    }

    if (redirect){
        return (
            <>
                <Navigate to={redirect} />
                {window.location.reload()}
            </>
        );
    }

    // Move photo to the front of the array
    const movePhotoToFront = (index) => {
        const updatedPhotos = [...addedPhotos];
        const photoToMove = updatedPhotos.splice(index, 1);
        updatedPhotos.unshift(photoToMove[0]);
        setAddedPhotos(updatedPhotos);
    }


    // Delete photo from the array and from the uploads folder
    const deletePhoto = (index) => {
        const photoToDelete = addedPhotos[index];
        // Call your backend API to delete the photo from the uploads folder

        // Update the state to remove the photo from the array
        const updatedPhotos = addedPhotos.filter((photo, i) => i !== index);
        setAddedPhotos(updatedPhotos);
    }

    async function handleDeleteLocation(locationId) {
        try {
            await axios.delete(`/deleteLocation/${locationId}`);
            setRedirect('/account/places');
        } catch (error) {
            console.error('Nu a putut fi stearsa locatia:', error);
            console.log(locationId);
        }
    };

    return (
        <div className="min-h-screen">
            {(action !== 'new' && isNaN(parseInt(action)) ) && (
                <div>

                    <div className="text-center mt-4">
                        <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded hover:bg-green-900" to={'/account/places/new'}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                            Adaugă o nouă locație
                        </Link>
                    </div>

                    <div className="w-2/4 mx-auto">
                        <h2 className="text-center text-xl mt-4  mb-4 font-bold">Locațiile tale</h2>
                        {locations.length > 0 && locations.map(location => (
                            <div>
                                <Link to={'/account/places/'+location.IdLocatie} key={location.IdLocatie} className="bg-gray-200 p-4 rounded-2xl flex gap-4 mt-4 cursor-pointer border-2 border-gray-300 shadow-lg relative" title="Apasă pentru a edita">
                                    <div className="bg-gray-300 w-48 h-48 rounded-2xl border overflow-hidden relative">
                                        {location.images.length > 0 && (
                                            <img className="w-full h-full object-cover object-center" src={`http://localhost:4000/uploads/${location.images[0].URLimagine}`} alt="" />
                                        )}
                                        
                                    </div>
                                    <div className="flex flex-col justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold">{location.Nume}</h2>
                                            {/* <p className="text-sm mt-2">{location.Descriere}</p> */}
                                        
                                            {/* <p>Adresa: {location.Adresa}</p> */}
                                            <p>{location.Oras}, {location.Judet}</p>
                                            <p>{location.Rating !== 0 ? location.Rating + '⭐' : 'Nu exista recenzii'}</p>
                                            <p>Cap. {location.Capacitate} persoane</p>
                                            <p>Preț pe zi: {location.PretPeZi} RON</p>
                                            <p>Facilități: {location.Facilitati}</p>
                                            
                                        </div>
                                    </div>
                                    {canDelete[location.IdLocatie] && (
                                    <button className="absolute top-2 right-2 bg-transparent border-none">
                                        <div title="Șterge locația">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 cursor-pointer bg-gray-200 rounded p-1 tooltip hover:text-white hover:bg-red-700" onClick={() => handleDeleteLocation(location.IdLocatie)} title="Delete photo">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
                                        </div>
                                    </button>
                                    )}
                                </Link>
                                
                            </div> 
                        ))}
                    </div>
                    
                </div>
            )}
            {action === 'new' && (
                <div className="w-3/4 flex justify-center mx-auto">
                <form onSubmit={addNewPlace}>
                    <h2 className="text-xl mt-4 ">Denumirea locației</h2>
                    <input type="text" value={denumire} onChange={ev=>setDenumire(ev.target.value)} placeholder="Grădină luminoasă spectaculoasă"/>
                    <h2 className="text-xl mt-4 ">Descrierea locației</h2>
                    <textarea value={descriere} onChange={ev=>setDescriere(ev.target.value)} className="w-full border my-1 py-2 px-3 rounded-2xl" placeholder="Situată la câțiva pași de plajă, această grădină..."/>
                    <div>
                        <h2 className="text-xl mt-4 ">Județul locației</h2>
                        <StateSelect
                            className="!w-full !border !my-2 !py-2 !px-3 !rounded"
                            countryid={countryid}
                            onChange={(e) => {
                                setStateId(e.id);
                                setJudet(e.name);
                            }}
                            placeHolder="Călărași"
                        />
                        <h2 className="text-xl mt-4 ">Orașul locației</h2>
                        <CitySelect
                            countryid={countryid}
                            stateid={stateId}
                            onChange={(e) => {
                                setOras(e.name);
                            }}
                            placeHolder="Oltenița"
                        />
                    </div>
                    <h2 className="text-xl mt-4 ">Stradă, număr, alte detalii etc.</h2>
                    <input type="text" value={alte} onChange={ev=>setAlte(ev.target.value)} placeholder="Bd. Republicii, Nr 109 (vis-a-vis de florăria Floriana)"/>
                    <h2 className="text-xl mt-4 ">Capacitate</h2>
                    <input type="number" value={capacitate} onChange={ev=>setCapacitate(ev.target.value)} placeholder="Numărul maxim de persoane"/>
                    <h2 className="text-xl mt-4 ">Prețul pe zi</h2>
                    <input type="text" value={ppzi} onChange={ev=>setPpzi(ev.target.value)} placeholder="Exprimat în RON"/>
                    
                    <h2 className="text-xl mt-4 ">Fotografii</h2>
                    <div className="mt-2 flex flex-wrap gap-3 justify-center">
                    {addedPhotos.length > 0 && addedPhotos.map((link, index) => (
                        <div className="relative w-48 h-48 overflow-hidden rounded-xl" key={link}>
                            <img className="w-full h-full object-cover" src={'http://localhost:4000/uploads/' + link} alt='' />
                            <div className="absolute top-2 right-2 flex space-x-2">
                                <div title={index === 0 ? "Aceasta este miniatura locației" : "Alege ca miniatură"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-6 h-6 cursor-pointer bg-gray-200 hover:text-white hover:bg-yellow-500 rounded p-1 tooltip ${index === 0 ? 'text-amber-600' : ''}`} onClick={() => movePhotoToFront(index)} title="Choose cover photo">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                </div>
                                <div title="Șterge imaginea">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 cursor-pointer bg-gray-200 rounded p-1 tooltip hover:text-white hover:bg-red-700" onClick={() => deletePhoto(index)} title="Delete photo">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                    <label className="relative w-48 h-48 overflow-hidden rounded-xl cursor-pointer border bg-transparent p-8 text-2xl text-gray-600 justify-center">
                        <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                    </label>
                </div>
                    
                    <h2 className="text-xl mt-4 ">Facilități</h2>
                    <p className=" text-gray-500 text-l">Selectați toate facilitățile locației</p>
                    <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
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
                    <h2 className="text-xl mt-4 ">Check-in și check-out</h2>
                    <div className="grid gap-2 sm:grid-cols-3">
                        <div>
                            <h3 className="mt-4  -mb-1">Oră check-in</h3>
                            <input type="text" value={checkIn} onChange={ev=>setCheckIn(ev.target.value)} placeholder="08:00" />
                        </div>
                        <div>
                            <h3 className="mt-4  -mb-1">Oră check-out</h3>
                            <input type="text" value={checkOut} onChange={ev=>setCheckOut(ev.target.value)} placeholder="10:00" />
                        </div>
                    </div>
                    <div>
                    <button className="w-2/4 py-2 px-6 mt-5 bg-primary text-white rounded mx-auto justify-center flex hover:bg-green-900">Salvați locația</button>
                    </div>
                </form>
                </div>
            )}
            {!isNaN(parseInt(action)) && (
                <div className="w-3/4 flex justify-center mx-auto">
                <form onSubmit={editPlace}>
                    <h2 className="text-xl mt-4 ">Denumirea locației</h2>
                    <input type="text" value={denumire} onChange={ev=>setDenumire(ev.target.value)} placeholder="Grădină luminoasă spectaculoasă"/>
                    <h2 className="text-xl mt-4 ">Descrierea locației</h2>
                    <textarea value={descriere} onChange={ev=>setDescriere(ev.target.value)} className="w-full border my-1 py-2 px-3 rounded-2xl" placeholder="Situată la câțiva pași de plajă, această grădină..."/>
                    <div>
                        <h2 className="text-xl mt-4 ">Județul locației</h2>
                        <StateSelect
                            className="!w-full !border !my-2 !py-2 !px-3 !rounded"
                            countryid={countryid}
                            onChange={(e) => {
                                setStateId(e.id);
                                setJudet(e.name);
                            }}
                            placeHolder="Călărași"
                        />
                        <h2 className="text-xl mt-4 ">Orașul locației</h2>
                        <CitySelect
                            countryid={countryid}
                            stateid={stateId}
                            onChange={(e) => {
                                setOras(e.name);
                            }}
                            placeHolder="Oltenița"
                        />
                    </div>
                    <h2 className="text-xl mt-4 ">Stradă, număr, alte detalii etc.</h2>
                    <input type="text" value={alte} onChange={ev=>setAlte(ev.target.value)} placeholder="Bd. Republicii, Nr 109 (vis-a-vis de florăria Floriana)"/>
                    <h2 className="text-xl mt-4 ">Capacitate</h2>
                    <input type="number" value={capacitate} onChange={ev=>setCapacitate(ev.target.value)} placeholder="Numărul maxim de persoane"/>
                    <h2 className="text-xl mt-4 ">Prețul pe zi</h2>
                    <input type="text" value={ppzi} onChange={ev=>setPpzi(ev.target.value)} placeholder="Exprimat în RON"/>
                    
                    <h2 className="text-xl mt-4 ">Fotografii</h2>
                    <div className="mt-2 flex flex-wrap gap-3 justify-center">
                    {addedPhotos.length > 0 && addedPhotos.map((link, index) => (
                        <div className="relative w-48 h-48 overflow-hidden rounded-xl" key={link}>
                            <img className="w-full h-full object-cover" src={'http://localhost:4000/uploads/' + link} alt='' />
                            <div className="absolute top-2 right-2 flex space-x-2">
                                <div title={index === 0 ? "Aceasta este miniatura locației" : "Alege ca miniatură"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={`w-6 h-6 cursor-pointer bg-gray-200 hover:text-white hover:bg-yellow-500 rounded p-1 tooltip ${index === 0 ? 'text-amber-600' : ''}`} onClick={() => movePhotoToFront(index)} title="Choose cover photo">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                    </svg>
                                </div>
                                <div title="Șterge imaginea">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 cursor-pointer bg-gray-200 rounded p-1 tooltip hover:text-white hover:bg-red-700" onClick={() => deletePhoto(index)} title="Delete photo">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                    <label className="relative w-48 h-48 overflow-hidden rounded-xl cursor-pointer border bg-transparent p-8 text-2xl text-gray-600 justify-center">
                        <input type="file" multiple className="hidden" onChange={uploadPhoto} />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>
                    </label>
                </div>

                    <h2 className="text-xl mt-4 ">Facilități</h2>
                    <p className=" text-gray-500 text-l">Selectați toate facilitățile locației</p>
                    <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                        <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                            <input type="checkbox" checked={facilitati.includes("Afară")} value="Afară" onChange={handleCbClick}/>
                            <span>Afară 🌳</span>
                        </label>
                        <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                            <input type="checkbox" checked={facilitati.includes("Wi-Fi")} value="Wi-Fi" onChange={handleCbClick}/>
                            <span>Wi-Fi 🛜</span>
                        </label>
                        <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                            <input type="checkbox" checked={facilitati.includes("Animale de companie permise")} value="Animale de companie permise" onChange={handleCbClick}/>
                            <span>Animale de companie permise 🐶</span>
                        </label>
                        <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
                            <input type="checkbox" checked={facilitati.includes('Parcare privată')} value="Parcare privată" onChange={handleCbClick}/>
                            <span>Parcare privată 🅿️</span>
                        </label>
                    </div>
                    <h2 className="text-xl mt-4 ">Check-in și check-out</h2>
                    <div className="grid gap-2 sm:grid-cols-3">
                        <div>
                            <h3 className="mt-4  -mb-1">Oră check-in</h3>
                            <input type="text" value={checkIn} onChange={ev=>setCheckIn(ev.target.value)} placeholder="08:00" />
                        </div>
                        <div>
                            <h3 className="mt-4  -mb-1">Oră check-out</h3>
                            <input type="text" value={checkOut} onChange={ev=>setCheckOut(ev.target.value)} placeholder="10:00" />
                        </div>
                    </div>
                    <div>
                        <button className="w-2/4 py-2 px-6 mt-5 bg-primary text-white rounded mx-auto justify-center flex hover:bg-green-900">Salvați locația</button>
                    </div>
                </form>
                </div>
            )}
        </div>
    )
}