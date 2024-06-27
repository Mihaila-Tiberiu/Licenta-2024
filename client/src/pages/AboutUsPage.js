import { Link, Navigate } from 'react-router-dom';
import React, { useContext, useEffect, useState, useRef} from "react";
import axios from 'axios';
import { UserContext } from '../UserContext';


export default function AboutUsPage() {
    const alineat = {
        textIndent: '-2em',
        paddingLeft: '2em'
      };
    return (
        <div className='min-h-screen'>
            <header className="bg-primary text-white text-center pt-5 pb-10">
                <div className="container mx-auto">            
                    <h2 className="text-4xl font-bold mb-4"> 
                        Despre noi
                    </h2> 
                </div>
            </header>
            <div className="mt-10 w-2/4 mx-auto items-center justify-center">
                <p className="text-lg">
                    <span style={alineat}>OccasioNest a fost concepută pentru a simplifica procesul de găsire și închiriere a locațiilor destinate diferitelor evenimente, a „cuiburilor” pentru ocazii speciale, aducând împreună beneficiile atât pentru cei care oferă spații, cât și pentru cei care caută să închirieze astfel de locații.</span> 
                    <br /><br />
                    <span style={alineat}>OccasioNest își propune să elimine barierele și dificultățile întâmpinate de cele două categorii de utilizatori implicați în procesul de închiriere a locațiilor pentru evenimente. OccasioNest servește două categorii de utilizatori: gazdele și oaspeții - deși fiecare utilizator al aplicației este liber să facă atât rezervări, cât și să posteze anunțuri.</span>
                </p>
                <h2 className='text-center pt-5 pb-10 text-4xl font-bold mb-2 mt-4'>
                    Întrebări și răspunsuri
                </h2>
                <div className='text-lg'>
                    <h2 className='font-bold'>Cât costă publicarea unui anunț?</h2>
                    <span style={alineat}>Publicarea anunțurilor prin intermediul platformei noastre este în totalitate gratuită! Orice cont de utilizator poate fi folosit gratuit atât pentru publicarea anunțurilor, cât și pentru realizarea de rezervări. Cu toate acestea, OccasioNest reține o taxă de 10% pentru orice rezervare îndeplinită cu succes.</span>
                    <br />
                    <br />

                    <h2 className='font-bold'>Cât costă o ședere?</h2>
                    <span style={alineat}>Prețul pentru fiecare ședere e afișat la efectuarea unei rezervări.</span>
                    <br />
                    <br />

                    <h2 className='font-bold'>De ce nu pot face rezervări în săptămâna curentă?</h2>
                    <span style={alineat}>Toate rezervările se fac cu cel puțin o săptămână înainte.</span>
                    <br />
                    <br />

                    <h2 className='font-bold'>De ce aplicația mă obligă să rezerv o zi înainte și una după datele dorite?</h2>
                    <span style={alineat}>Amenajarea spațiilor pentru evenimente este un proces consumator de timp; din acest motiv, gazdele au la dispoziție 2 zile pentru amenajarea locației: o zi pentru amenajarea pentru dumneavoastră și o zi pentru curățenie.</span>
                    <br />
                    <br />

                    <h2 className='font-bold'>Cât timp am pentru a-mi anula rezervarea?</h2>
                    <span style={alineat}>Atât gazda, cât și oaspetele, au timp 48 ore pentru a anula rezervarea, cu restituirea integrală a sumei plătite.</span>
                    <br />
                    <br />

                    <h2 className='font-bold'>Pot plăti cash?</h2>
                    <span style={alineat}>Nu, platforma noastră acceptă numai plăți folosind un card bancar.</span>
                    <br />
                    <br />

                    <h2 className='font-bold'>Au trecut primele 48 ore, dar vreau să anulez o rezervare.</h2>
                    <span style={alineat}>Vă rugăm să ne <a className="text-primary underline font-semibold hover:text-green-900" href="/contact">scrieți un mesaj</a>. Vom încerca să vă ajutăm cât mai rapid cu putință.</span>
                    <br />
                    <br />

                    <h2 className='font-bold'>Pot să modific o rezervare?</h2>
                    <span style={alineat}>Nu, rezervările nu mai pot fi modificate după efectuarea plății. Cu toate acestea, în primele 48 ore de la rezervare, aveți posibilitatea să anulați rezervarea și să creați alta. </span>
                    <br />
                    <br />

                    <h2 className='font-bold'>De ce nu pot lăsa o recenzie unei locații?</h2>
                    <span style={alineat}>Numai utilizatorii care au avut în trecut un sejur îndeplinit la respectiva locație pot lăsa recenzii. De asemenea, un utilizator poate lăsa o singură recenzie pe sejur.</span>
                    <br />
                    <br />

                    <h2 className='font-bold'>Sunt recenziile anonime?</h2>
                    <span style={alineat}>Da, toate recenziile sunt anonime.</span>
                    <br />
                    <br />

                    <h2 className='font-bold'>Aveți alte întrebări?</h2>
                    <span style={alineat}><a className="text-primary underline font-semibold hover:text-green-900" href="/contact">Scrieți-ne un mesaj!</a></span>
                    <br />
                    <br />
                </div>
            </div>
        </div>
    );
}
