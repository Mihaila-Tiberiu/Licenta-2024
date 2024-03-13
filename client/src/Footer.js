import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function Footer(){
    return(
        <footer className="bg-primary text-white text-center py-6 mt-40">
        <div className="container mx-auto">
          <p>&copy; 2024 OccasioNest. Toate drepturile rezervate.</p>
        </div>
      </footer>

    );
}
