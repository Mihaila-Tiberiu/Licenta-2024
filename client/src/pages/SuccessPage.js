import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-xl">
                <h1 className="text-2xl font-semibold text-primary mb-2">Rezervare realizată cu succes!</h1>
                <div className="flex justify-center">
                    <Link to="/" className="text-white bg-primary hover:bg-green-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        Reveniți pe pagina de start
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
