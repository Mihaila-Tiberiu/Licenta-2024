import { Link, Navigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { UserContext } from '../UserContext';

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
         alert('Autentificare cu succes');
         setRedirect(true);
      }
      catch (err){
         alert('Autentificare esuata');
      }
   }

   if (redirect) {
      return <Navigate to={'/'} />
   }

   return (
      <div className="mt-4 grow flex items-center justify-around">
         <div className="mb-64">
         <h1 className="text-4xl text-center mb-4">Autentificare</h1>
         <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
            <input type="text" placeholder="nume utilizator" 
             value= {username} onChange={ev => setUsername(ev.target.value)}/>
            <input type="password" placeholder="parola"
             value= {password} onChange={ev => setPassword(ev.target.value)}/>
            <button className="bg-primary w-full border my-2 py-2 px-3 rounded-2xl text-white font-medium">Autentifică-te</button>
            <div className='text-center py-2 text-gray-500'>
               Nu ai cont? <Link className='text-center py-2 text-black underline' to={'/register'}>Înregistrează-te</Link>
            </div>
         </form>
         </div>
      </div>
   );
}