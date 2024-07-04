import { Link, Navigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { UserContext } from '../UserContext';
import Alert from '../Alert';

export default function LoginPage(){

   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [redirect, setRedirect] = useState(false);
   const {setUser} = useContext(UserContext);

   async function handleLoginSubmit(ev){
      ev.preventDefault();
      
      try{
         const response = await axios.post('/login', {username, password});
         setUser(response.data);
         Alert.showAlert('Autentificare cu succes!');
         setRedirect(true);
      }
      catch (err){
         Alert.showAlert('Autentificare eșuată!');
      }
   }

   if (redirect) {
      return <Navigate to={'/'} />
   }

   return (
      <div className="mt-4 grow flex items-center justify-around min-h-screen">
         <div className="mb-64">
         <h1 className="text-4xl text-center mb-4">Autentificare</h1>
         <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
            <input type="text" placeholder="nume utilizator" required onKeyPress={(evt) => {
               
               if (evt.key === ' ') {
                  evt.preventDefault();
               }
            }}
            pattern="^[a-zA-Z0-9]*$"
             value= {username} onChange={ev => setUsername(ev.target.value)}/>
            <input type="password" placeholder="parola" required onKeyPress={(evt) => {
               
               if (evt.key === ' ') {
                  evt.preventDefault();
               }
            }}
            pattern="^[a-zA-Z0-9]*$"
             value= {password} onChange={ev => setPassword(ev.target.value)}/>
            <button className="bg-primary w-full border my-2 py-2 px-3 rounded text-white font-medium">Autentifică-te</button>
            <div className='text-center py-2 text-gray-500'>
               Nu ai cont? <Link className='text-center py-2 text-black underline' to={'/register'}>Înregistrează-te</Link>
            </div>
         </form>
         </div>
      </div>
   );
}