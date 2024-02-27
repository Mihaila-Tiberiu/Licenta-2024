import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";

export default function PlacesPage(){
    const {action} = useParams();
    const [denumire, setDenumire]= useState('');
    const [descriere, setDescriere] = useState('');
    const [judet, setJudet] = useState('');
    const [oras, setOras] = useState('');
    const [alte, setAlte] = useState('');
    const [capacitate, setCapacitate] = useState(1);
    const [ppzi, setPpzi] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [facilitati, setFacilitati] = useState([]);
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [redirect, setRedirect] = useState('');

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

    function uploadPhoto(ev) {
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

    if (redirect){
        return (
            <>
                <Navigate to={redirect} />
                {window.location.reload()}
            </>
        );
    }

    return (
        <div>
            {action !== 'new' && (
                <div className="text-center">
                    <div>
                        <h2 className="text-xl mt-4 pl-3 mb-4 font-bold">Locațiile tale</h2>
                        {locations.map(location => (
                            <div key={location.IdLocatie}>
                            <h3 className="font-bold">{location.Nume}</h3>
                            <p>Descriere: {location.Descriere}</p>
                            <p>Adresa: {location.Adresa}</p>
                            <p>Oras: {location.Oras}</p>
                            <p>Judet: {location.Judet}</p>
                            <p>Rating: {location.Rating !== 0 ? location.Rating : 'Nu exista recenzii'}</p>
                            <p>Capacitate: {location.Capacitate}</p>
                            <p>PretPeZi: {location.PretPeZi}</p>
                            <p>Facilitati: {location.Facilitati}</p>
                            {/* Render images for this location */}
                            <div className="flex justify-center gap-4 mt-2 mb-2">
                                {location.images.map(image => (
                                    <div className="max-w-xs rounded-lg overflow-hidden" key={image.IdImagine}>
                                        <img className="w-full rounded-lg h-auto" src={`http://localhost:4000/uploads/${image.URLimagine}`} alt={`Imagini lipsă!`} />
                                    </div>
                                ))}
                            </div>



                            </div>
                        ))}
                        </div>
                    <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                        Adaugă o nouă locație
                    </Link>
                </div>
            )}
            {action === 'new' && (
                <form onSubmit={addNewPlace}>
                    <h2 className="text-xl mt-4 pl-3">Denumirea locației</h2>
                    <input type="text" value={denumire} onChange={ev=>setDenumire(ev.target.value)} placeholder="Grădină luminoasă spectaculoasă"/>
                    <h2 className="text-xl mt-4 pl-3">Descrierea locației</h2>
                    <textarea value={descriere} onChange={ev=>setDescriere(ev.target.value)} className="w-full border my-1 py-2 px-3 rounded-2xl" placeholder="Situată la câțiva pași de plajă, această grădină..."/>
                    <h2 className="text-xl mt-4 pl-3">Județul locației</h2>
                    <input value={judet} onChange={ev=>setJudet(ev.target.value)} type="text" placeholder="Călărași"/>
                    <h2 className="text-xl mt-4 pl-3">Orașul locației</h2>
                    <input value={oras} onChange={ev=>setOras(ev.target.value)} type="text" placeholder="Oltenița"/>
                    <h2 className="text-xl mt-4 pl-3">Stradă, număr, alte detalii etc.</h2>
                    <input type="text" value={alte} onChange={ev=>setAlte(ev.target.value)} placeholder="Bd. Republicii, Nr 109 (vis-a-vis de florăria Floriana)"/>
                    <h2 className="text-xl mt-4 pl-3">Capacitate</h2>
                    <input type="number" value={capacitate} onChange={ev=>setCapacitate(ev.target.value)} placeholder="Numărul maxim de persoane"/>
                    <h2 className="text-xl mt-4 pl-3">Prețul pe zi</h2>
                    <input type="text" value={ppzi} onChange={ev=>setPpzi(ev.target.value)} placeholder="Exprimat în RON"/>
                    
                    <h2 className="text-xl mt-4 pl-3">Fotografii</h2>
                    <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {addedPhotos.length > 0 && addedPhotos.map(link=>(
                            <div className="h-32 flex" key={link}>
                                <img className="rounded-2xl w-full object-cover" src={'http://localhost:4000/uploads/'+link} alt=''/>
                            </div>
                        ))}
                        
                        <label className="flex items-center cursor-pointer flex border bg-transparent rounded-2xl p-8 text-2xl text-gray-600 justify-center">
                            <input type="file" multiple className="hidden" onChange={uploadPhoto}/>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                        </label>
                    </div>
                    
                    <h2 className="text-xl mt-4 pl-3">Facilități</h2>
                    <p className="pl-3 text-gray-500 text-l">Selectați toate facilitățile locației</p>
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
                    <h2 className="text-xl mt-4 pl-3">Check-in și check-out</h2>
                    <div className="grid gap-2 sm:grid-cols-3">
                        <div>
                            <h3 className="mt-4 pl-3 -mb-1">Oră check-in</h3>
                            <input type="text" value={checkIn} onChange={ev=>setCheckIn(ev.target.value)} placeholder="08:00" />
                        </div>
                        <div>
                            <h3 className="mt-4 pl-3 -mb-1">Oră check-out</h3>
                            <input type="text" value={checkOut} onChange={ev=>setCheckOut(ev.target.value)} placeholder="10:00" />
                        </div>
                    </div>
                    <div>
                        <button className="py-2 px-6 mt-2 bg-primary text-white rounded-full w-full">Salvați locația</button>
                    </div>
                </form>
            )}
        </div>
    )
}