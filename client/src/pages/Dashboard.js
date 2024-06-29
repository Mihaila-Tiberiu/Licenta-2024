import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Alert from '../Alert';

function Dashboard() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [paymentStats, setPaymentStats] = useState([]);
  const [reservationStats, setReservationStats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    if (password === 'admin') {
      setAuthenticated(true);
    } else {
      Alert.showAlert("Parola incorecta!")
    }
  };

  useEffect(() => {
    if (authenticated) {
      const fetchData = async () => {
        try {
          const paymentResponse = await axios.get('/api/payments/stats');
          const reservationResponse = await axios.get('/api/reservations/stats');
          setPaymentStats(paymentResponse.data);
          setReservationStats(reservationResponse.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
  }, [authenticated]);

  useEffect(() => {
 
    axios.get(`/api/total-price-admin`)
        .then(response => {
            const price = response.data.totalPrice * 0.1;
            const roundedPrice = Math.floor(price * 100) / 100;
            setTotalPrice(roundedPrice);
            })
        .catch(error => {
            console.error("There was an error fetching the total price!", error);
        });

}, []);

async function updateStatuses() {

    try {
        const response = await axios.post(`/api/update-statuses-admin`);
        Alert.showAlert('Fonduri extrase cu succes!');
        setTotalPrice(0);
    } catch (error) {
        console.error("There was an error updating the statuses!", error);
        Alert.showAlert('A aparut o eroare la extragerea fondurilor!');
    }
    
}

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form onSubmit={handlePasswordSubmit} className="p-6 bg-white rounded-lg shadow-xl border-2 border-gray-300">
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Scrieți parola"
            className="block w-full px-4 py-2 mb-4 text-lg border rounded focus:outline-none focus:border-blue-500"
          />
          <button className="bg-primary w-full border my-2 py-2 px-3 rounded text-white font-medium">
            Autentifică-te
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="text-center">
        <div className="mt-6 mx-auto p-6 bg-white rounded-lg shadow-xl border-2 border-gray-300" style={{ maxWidth: '800px' }}>
          <h2 className="text-xl font-semibold text-left">Fonduri în contul OccasioNest</h2>
          <p className="text-lg text-left">{totalPrice} RON <br /></p>
          <button onClick={updateStatuses} className="py-2 px-6 mt-2 bg-blue-700 text-white rounded hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50">
          Extrage fondurile!
        </button>
        </div>
        <div className="mt-6 mx-auto p-6 bg-white rounded-lg shadow-xl border-2 border-gray-300" style={{ maxWidth: '800px' }}>
          <h2 className="text-xl font-semibold text-left">Statistici plati</h2>
          {paymentStats.map(stat => (
            <p key={stat.Status} className="text-lg text-left">{`${stat.Status}: ${stat.count}`}</p>
          ))}
        </div>
        <div className="mt-6 mx-auto p-6 bg-white rounded-lg shadow-xl border-2 border-gray-300" style={{ maxWidth: '800px' }}>
          <h2 className="text-xl font-semibold text-left">Statistici rezervari</h2>
          {reservationStats.map(stat => (
            <p key={stat.Status} className="text-lg text-left">{`${stat.Status}: ${stat.count}`}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
