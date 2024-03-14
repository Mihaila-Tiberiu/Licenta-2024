import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you're using axios for HTTP requests

const LocationCard = ({ location }) => (
  <div className="location-card">
    <div className="flex bg-gray-300 w-48 h-48 rounded-2xl border overflow-hidden">
      {location.imageURL ? (
          <img
              className="w-full h-full object-cover object-center"
              src={`http://localhost:4000/uploads/${location.imageURL}`}
              alt={location.name}
          />
      ) : (
          <div className="w-full h-full bg-gray-300"></div>
      )}
    </div>
    <div className="location-details">
      <h2>{location.Nume}</h2>
      <p>{location.Descriere}</p>
      <p>{location.Oras}, {location.Judet}</p>
      <p>Pret: {location.PretPeZi} RON pe zi</p>
      <p>Capacitate: {location.Capacitate}</p>
      <p>Rating: {location.Rating === 0 ? 'Neevaluat' : `${location.Rating} ⭐`}</p>
    </div>
  </div>
);

const CustomizableLocationCard = ({ city }) => {
  const [locations, setLocations] = useState([]);
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Fetch locations data from your server (assuming it's hosted locally)
        const response = await axios.get(`http://localhost:4000/locationsByCity?city=${city}`);
        setLocations(response.data);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    // Fetch locations initially
    fetchLocations();
  }, [city]);

//   return (
//     <div className="peer-space-clone">
//       {locations.map(location => (
//         <LocationCard key={location.id} location={location} />
//       ))}
//     </div>
//   );

  // Shuffle function to randomize array
function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
  const numberOfLocationsToShow = 1;
  return (
      <div className="peer-space-clone">
        {shuffle(locations).slice(0, numberOfLocationsToShow).map(location => (
          <LocationCard key={location.id} location={location} />
        ))}
      </div>
  );
  
};

export default CustomizableLocationCard;
