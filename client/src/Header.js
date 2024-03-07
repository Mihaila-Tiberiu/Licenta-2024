import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function Header(){
    const {user} = useContext(UserContext);
    return(
        <header className="flex justify-between">
            <div className="p-2 border-4 border-blue-500 rounded-full font-bold text-blue-500 shadow-md shadow-gray-500 flex items-center">
            <a href="/" className="flex items-center">
            <span>OccasioNest</span>
            </a>
            </div>
            <div className="gap-2 flex border-4 border-blue-500 rounded-full p-2 shadow-md shadow-gray-500">
            <div className="flex items-center text-gray-600">Ce plănuiești?</div>
            <div className="border border-l border-gray-300"></div>
            <div className="flex items-center text-gray-600">Unde?</div>
            <div className="border border-l border-gray-300"></div>
            <div className="flex items-center text-gray-600">Când?</div>
            {/* <div className="border border-l border-gray-300"></div>
            <div className="flex items-center">Categorie</div> */}
            <button className='bg-primary border rounded-full flex justify-center items-center text-white p-1'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </button>
            </div>
            <Link to={user?'/account': '/login'} className='flex items-center gap-2 flex border-4 border-blue-500 rounded-full p-2 shadow-md shadow-gray-500'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <div className='bg-primary border rounded-full p-1 text-white'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
            </div>
            {!!user && (
                <div>
                    {user.Username}
                </div>
            )}
            </Link>
      </header>
    );
}
