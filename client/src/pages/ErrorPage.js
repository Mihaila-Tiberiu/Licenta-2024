import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const ErrorPage = () => {
    const location = useLocation();
    const { tipEroare } = location.state || {};

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-xl">
                <h1 className="text-2xl font-semibold text-red-600 mb-2">Rezervarea nu a putut fi efectuată</h1>
                {tipEroare ? (
                    <p className="text-gray-700 mb-4 text-center">Tipul de eroare: {tipEroare}</p>
                ) : (
                    <p className="text-gray-700 mb-4 text-center">Vă rugăm reîncercați.</p>
                )}
                <div className="flex justify-center">
                    <Link to="/" className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        Reveniți pe pagina de start
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
