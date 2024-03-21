import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function Header(){
    const {user} = useContext(UserContext);
    return(
    <div className="">
      <nav className="bg-primary text-white p-4">
        <div className="container mx-auto flex">
          <div className='w-1/4 text-2xl font-bold flex items-center hover:text-gray-300'><h1 className=""><a href='/'>OccasioNest</a></h1></div>
          <ul className="flex space-x-4 mx-auto">
            <div className="flex rounded items-center text-lg">
                <li><a href="/" className="hover:text-gray-300 border-r-2 pr-2">Acasă</a></li>
                <li><a href="/listings" className="hover:text-gray-300 border-r-2 ml-2 pr-2">Caută locații</a></li>
                <li><a href="#" className="hover:text-gray-300 border-r-2 ml-2 pr-2">Despre noi</a></li>
                <li><a href="#" className="hover:text-gray-300 ml-2">Contact</a></li>
            </div>
            </ul>
            <div className='w-1/4 text-right text-lg'>
                <div className='flex justify-end '>
                    <Link to={user ? '/account' : '/login'} className='flex items-center gap-2 rounded p-2 hover:text-gray-300'>
                    {user && (
                      <div className='flex'>
                        <div className='p-1'>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                          </svg>
                        </div>
                        <div className='mr-2'>
                          {user.Username}
                        </div>
                        <div className='rounded-full border-2 border-gray-300 p-1'>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                          </svg>
                        </div>
                    </div>
                        
                    )}
                    {!user && (
                      <div className='rounded-full p-1 hover:text-gray-300 hover:border-gray-300'>
                          Autentifică-te
                      </div>
                    )} 
                    </Link>
                </div>
                </div>
        </div>
        
      </nav>
            
    </div>
    );
}
