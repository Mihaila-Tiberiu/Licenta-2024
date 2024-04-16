import { Navigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ImageCarousel from '../ImageCarousel';
import React from "react";

export default function LocationListing() {
    const { user } = useContext(UserContext);
    const userId = user ? user.IdUtilizator : null; // TODO: va fi folosit pentru 2 lucruri:
    // daca locatia e a utilizatorului, va exista un buton care sa il duca la pagina de editare a locatiei
    // daca are o rezervare facuta in viitor, sa o poata edita
    // daca are o rezervare facuta in trecut, sa poata lasa recenzii 

    const {locationId} = useParams();

    const [locationInfo, setLocationInfo] = useState('');
    const [locationImagesArray, setLocationImagesArray] = useState('');
    const [locationReviewsArray, setLocationReviewsArray] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response1 = await axios.get(`/places/${locationId}`);
                setLocationInfo(response1.data);

                const response2 = await axios.get(`/getImageUrls/${locationId}`);
                setLocationImagesArray(response2.data);

                const response3 = await axios.get(`/getLocationReviews/${locationId}`);
                setLocationReviewsArray(response3.data);

            } catch (error) {
                navigate('/listings');
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleOnClick = () => {
        console.log('Location Info:', locationInfo);
        console.log('Location Images Array:', locationImagesArray);
        console.log('Location Reviews Array:', locationReviewsArray);
      };

    return (
        <div className="min-h-screen">
            <header className="bg-primary text-white text-center pt-5 pb-10">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold mb-4"> 
                        {locationInfo.Nume}
                    </h2>
                    <a className="hover:text-gray-300" target="_blank" rel="noreferrer" href={'https:/maps.google.com/?q='
                        +locationInfo.Adresa+", "+
                        locationInfo.Oras+", "+
                        locationInfo.Judet}>
                        {locationInfo.Adresa+", "+
                        locationInfo.Oras+", "+
                        locationInfo.Judet}
                    </a>
                </div>
            </header>
            <div className="bg-gray-100 px-8 py-8">
                <div className="container mx-auto flex flex-col md:flex-row">
                    <div className="md:w-1/2 pr-8">
                        {/* Info content goes here */}
                        {/* Example content */}
                        <h2 className="text-xl font-bold mb-1">{locationInfo.Rating} ⭐ </h2>
                        <h2 className="text-xl font-bold mb-12">{locationInfo.PretPeZi} RON / Zi</h2>
                        <p className="text-gray-700 mb-4">{locationInfo.Descriere}</p>
                        <h3 className="text-l font-bold mb-1">Facilități:</h3>
                        <p className="text-gray-700 mb-8">{locationInfo.Facilitati}</p>
                        <h3 className="text-l font-bold mb-4">Capacitate: {locationInfo.Capacitate} persoane</h3>
                        <h3 className="text-l font-bold mb-1">Oră check-in: {locationInfo.CheckIn}</h3>
                        <h3 className="text-l font-bold mb-1">Oră check-out: {locationInfo.CheckOut}</h3>
                    </div>
                    <div className="md:w-1/2">
                        {/* Image carousel component */}
                        <ImageCarousel locationImagesArray={locationImagesArray} />
                    </div>
                    
                </div>
            </div>
            <button onClick={handleOnClick}>
                consola
            </button>
        </div>
    )
}