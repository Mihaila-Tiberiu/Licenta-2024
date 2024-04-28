import { Link } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import axios from 'axios';
import Alert from '../Alert';

export default function RegisterPage(){

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function registerUser(ev){
        ev.preventDefault();
        axios.post('/register', {
            username,
            email,
            password,
        })
        .then(res => {
            Alert.showAlert(res.data.message);
        })
        .catch(error => {
            // Utilizator deja existent
            if (error.response.status === 422) {
                Alert.showAlert(error.response.data.error); // Afisare mesaj de eroare de la server
            // Erori generice
            } else {
                console.error('Error:', error.message);
                Alert.showAlert('Eroare de server');
            }
        });
    }

   return (
      <div className="mt-4 grow flex items-center justify-around min-h-screen">
         <div className="mb-64">
         <h1 className="text-4xl text-center mb-4">Înregistrare</h1>
         <form className="max-w-md mx-auto" onSubmit={registerUser}>
            <input type="text" placeholder="nume utilizator" 
                value={username} 
                onChange={ev=>setUsername(ev.target.value)} />
            <input type="email" placeholder={"adresa@email.com"}
                value={email} 
                onChange={ev=>setEmail(ev.target.value)}/>
            <input type="password" placeholder="parola"
                value={password}
                onChange={ev=>setPassword(ev.target.value)}/>
            <button className="bg-primary w-full border my-2 py-2 px-3 rounded text-white font-medium">Înregistrează-te</button>
            <div className='text-center py-2 text-gray-500'>
               Ai deja cont? <Link className='text-center py-2 text-black underline' to={'/login'}>Autentifică-te</Link>
            </div>
         </form>
         </div>
      </div>
   );
}