import { Navigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import axios from 'axios';

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
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleClick = () => {
        console.log(locationImagesArray);
        console.log(locationReviewsArray);
        console.log(locationInfo);
    };

    return (
        <div className="min-h-screen">
            Hello {userId} world {locationId}!
            <button onClick={handleClick}>about</button>
        </div>
    )
}