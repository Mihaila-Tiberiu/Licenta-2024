import { Link, Navigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { UserContext } from '../UserContext';
import Alert from '../Alert';

export default function MyLocationsBookings() {

   return (
      <div className="min-h-screen">
            Hello my locations bookings, I want to play a game.
      </div>
   );
}