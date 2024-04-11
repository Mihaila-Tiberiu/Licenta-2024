import { Link, Navigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { UserContext } from '../UserContext';


export default function ContactUsPage() {
    return (
        <div className='min-h-screen'>
            <header className="bg-primary text-white text-center pt-5 pb-10">
                <div className="container mx-auto">
                
                    <h2 className="text-4xl font-bold mb-4"> 
                        Date de contact
                    </h2>
                    <div className="w-1/3 text-lg mt-10 text-left mx-auto">
                        Email: mihailatiberiu20@stud.ase.ro
                        <br />
                        Telefon: 07XXXXXXXX
                        <br />
                        <br />
                        {/* Google Maps Location */}
                        <div className="">
                            <iframe
                                title="Faculty of Cybernetics, Statistics and Informatics, Bucharest"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.654834088568!2d26.105641315562475!3d44.43993447910287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40b1ff527c260e8d%3A0xf4ab185194d10eba!2sFaculty%20of%20Cybernetics%2C%20Statistics%20and%20Informatics!5e0!3m2!1sen!2sro!4v1649302789624!5m2!1sen!2sro"
                                width="100%"
                                height="300"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>     
                </div>
            </header>
            <div className="mt-10 w-1/4 mx-auto items-center justify-center">
                <div className="">

                    <h2 className='text-center pt-5 pb-10 text-4xl font-bold mb-2'>
                        Trimite-ne un mesaj!
                    </h2>
                    {/* Contact Form */}
                    <form className="">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium">
                                Numele dvs.
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                placeholder="Introduceți numele dvs."
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                placeholder="Introduceți adresa de email"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-sm font-medium">
                                Telefon
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                placeholder="Introduceți numărul de telefon"
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="message" className="block text-sm font-medium">
                                Mesajul dvs.
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                placeholder="Scrieți mesajul dvs. aici"
                            ></textarea>
                        </div>
                        <div className='w-1/4 mx-auto mb-4'>
                            <button
                                type="submit"
                                className="bg-primary hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
                            >
                                Trimite
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
