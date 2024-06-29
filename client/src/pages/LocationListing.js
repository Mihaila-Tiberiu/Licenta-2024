import { Navigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import ImageCarousel from '../ImageCarousel';
import React from "react";
import LocationCalendar from '../LocationCalendar';
import Alert from "../Alert";


export default function LocationListing() {
    const { user } = useContext(UserContext);
    const userId = user ? user.IdUtilizator : null;

    const {locationId} = useParams();

    const [locationInfo, setLocationInfo] = useState('');
    const [locationImagesArray, setLocationImagesArray] = useState([]);
    const [locationReviewsArray, setLocationReviewsArray] = useState([]);

    const [bookingCount, setBookingCount] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [displayReviewForm, setDisplayReviewForm] = useState(false);

    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');


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

                if (userId) {
                    try {
                        const response4 = await axios.get(`/userBookingReviewCount/${userId}/${locationId}`);
                        const { bookingCount, reviewCount } = response4.data;
                        setBookingCount(bookingCount);
                        setReviewCount(reviewCount);
                        setDisplayReviewForm(bookingCount > reviewCount);
                    } catch (error) {
                        console.error('Error fetching booking and review counts:', error);
                    }
                }
                

            } catch (error) {
                navigate('/listings');
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [locationId, userId]);

    const handleOnClick = () => {
        if (!userId) {
            Alert.showAlert("Trebuie să fiți autentificat pentru a face o rezervare!");
            return;
        }
    
        console.log('Location Info:', locationInfo);
        console.log('Location Images Array:', locationImagesArray);
        console.log('Location Reviews Array:', locationReviewsArray);
        console.log('UserId:', userId);
        console.log(bookingCount, reviewCount, comment, rating);
    
        window.location.href = `/reservation?locationId=${locationId}`;
    };

    const handleSubmitReview = async (e, rating, comment) => {
        try {
            e.preventDefault();
            const response = await axios.post('/submitReview', {
                userId,
                locationId,
                rating,
                comment
            });
            // Handle success or update state accordingly
            window.location.reload();
        } catch (error) {
            console.error('Error submitting review:', error);
            console.log({
                userId,
                locationId,
                rating,
                comment
            });
        }
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
            <div className="bg-gray-100 px-8 pt-8">
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
                        <h3 className="text-l font-bold mb-8">Oră check-out: {locationInfo.CheckOut}</h3>
                        <div>
                            <LocationCalendar locationId={locationId} />
                            
                            <button onClick={handleOnClick} className="mt-2 w-1/2 bg-primary hover:bg-green-900 text-white font-bold py-2 px-4 rounded">
                                Fă o rezervare!
                            </button>
                        </div>
                    </div>
                    
                    <div className="md:w-1/2 ">
                        <div className="flex flex-col justify-center items-center h-full">
                            {/* Image carousel component */}
                            <ImageCarousel locationImagesArray={locationImagesArray} />
                        </div>
                    </div>
                    
                </div>
            </div>
            <div className="mt-8 w-1/2 mx-auto bg-white rounded-lg shadow-xl p-6 mb-6 border-gray-300 border-2">
                <h2 className="text-xl font-bold mb-4">Recenzii ale utilizatorilor:</h2>
                {displayReviewForm && (
                    <form onSubmit={(e) => handleSubmitReview(e, rating, comment)} className="mb-8 bg-white rounded-lg shadow-xl p-6 border-gray-300 border-2">
                        <label className="block  text-sm font-bold mb-2">
                            Rating:
                        </label>
                        <input
                            required
                            type="range"
                            min={1}
                            max={5}
                            step={0.5}
                            value={rating}
                            onChange={(e) => setRating(parseFloat(e.target.value))}
                            className="slider appearance-none w-full h-3 bg-gray-200 rounded-full outline-none mb-4"
                        />
                        <span>{rating} ⭐</span>
                        <div className="mb-4 mt-8 ">
                            <label className="block text-sm font-bold mb-2" htmlFor="comment">
                                Comentariu:
                            </label>
                            <textarea
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="comment"
                                name="comment"
                                rows="4"
                                required
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-green-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Trimite recenzia
                        </button>
                    </form>
                )}
                {locationReviewsArray.length > 0 ? (
                    locationReviewsArray.map((review) => (
                        <div key={review.IdRecenzie} className="bg-white rounded-lg shadow-xl p-6 mb-6 border-gray-300 border-2">
                            <div className="flex items-center mb-3">
                                <h2 className="text-xl font-bold">{review.Rating} ⭐</h2>
                            </div>
                            <p className="text-gray-700">{review.Comentariu}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center">Nu există încă recenzii pentru această locație!</p>
                )}
            </div>
            
        </div>
    )
}