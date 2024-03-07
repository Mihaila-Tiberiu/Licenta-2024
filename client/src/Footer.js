import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function Footer(){
    const {user} = useContext(UserContext);
    return(
        <footer class="bg-gray-800 text-gray-300 py-8 mt-5 ticky relative inset-x-0 bottom-0 mt-20">
            <div class="container mx-auto flex flex-wrap justify-between items-center">
                <div class="w-full lg:w-1/3 mb-4 lg:mb-0">
                    <h3 class="text-lg font-semibold mb-2">Quick Links</h3>
                    <ul>
                        <li><a href="#" className="block hover:text-white">About Us</a></li>
                        <li><a href="#" className="block hover:text-white">List Your Space</a></li>
                        <li><a href="#" className="block hover:text-white">Help</a></li>
                        <li><a href="#" className="block hover:text-white">Privacy Policy</a></li>
                    </ul>
                </div>
                <div class="w-full lg:w-1/3 mb-4 lg:mb-0">
                    <h3 class="text-lg font-semibold mb-2">Explore</h3>
                    <ul>
                        <li><a href="#" className="block hover:text-white">Venues</a></li>
                        <li><a href="#" className="block hover:text-white">Events</a></li>
                        <li><a href="#" className="block hover:text-white">Spaces</a></li>
                        <li><a href="#" className="block hover:text-white">Cities</a></li>
                    </ul>
                </div>
                <div class="w-full lg:w-1/3 mb-4 lg:mb-0">
                    <h3 class="text-lg font-semibold mb-2">Connect</h3>
                    <ul>
                        <li><a href="#" className="block hover:text-white">Contact Us</a></li>
                        <li><a href="#" className="block hover:text-white">Blog</a></li>
                        <li><a href="#" className="block hover:text-white">Press</a></li>
                        <li><a href="#" className="block hover:text-white">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            <div class="mt-8 border-t border-gray-700 pt-4 text-center">
                <p>&copy; 2024 OccasioNest. Toate drepturile rezervate.</p>
                <div class="mt-4 ">
                    <a href="#" className="text-gray-400 hover:text-white mx-2"><i class="fab fa-facebook"></i></a>
                    <a href="#" className="text-gray-400 hover:text-white mx-2"><i class="fab fa-twitter"></i></a>
                    <a href="#" className="text-gray-400 hover:text-white mx-2"><i class="fab fa-instagram"></i></a>
                </div>
            </div>
        </footer>

    );
}
