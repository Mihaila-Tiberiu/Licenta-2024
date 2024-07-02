const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const { SERVICE_ID_EMAILJS, TEMPLATE_ID_EMAILJS, PUBLIC_KEY_EMAILJS} = require('./config.js');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite3', sqlite3.OPEN_READWRITE, (err)=> {
    if (err) return console.error(err.message);
})

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'eqwueqwo21ui3o1321';

const app = express();
app.use(express.json());
app.use(express.static('uploads'));
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(express.static('images'));
app.use('/images', express.static(__dirname+'/images'));

app.use(cors({
    credentials: true,
    origin: "http://localhost:3000"
}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/test', (req, res) => {
    res.status(200);
    res.json('test ok!');
});

// Inserare utilizator nou in DB
app.post('/register', (req, res) => {
    const { username, email, password, phone } = req.body;
    
    // Verificam daca utilizatorul exista deja
    db.get(`SELECT * FROM Utilizatori WHERE Username = ?`, [username], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        // Daca se gaseste un rand cu utilizatorul, se returneaza un mesaj corespunzator
        if (row) {
            return res.status(409).json({ error: 'Nume de utilizator deja existent' });
        } else {
            // Daca nu se gaseste utilizatorul, se continua procesul de inregistrare
            const encryptedPassword = bcrypt.hashSync(password, bcryptSalt);
            const query = `INSERT INTO Utilizatori(Username, Email, Password, Phone) VALUES (?,?,?,?)`;
            db.run(query, [username, email, encryptedPassword, phone], (err) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.status(201).json({ message: 'Utilizator creat cu succes! Acum vă puteți autentifica' });
            });
        }
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // verificam daca utilizatorul exista in BD
    db.get('SELECT * FROM Utilizatori WHERE Username = ?', [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }

        // verificam daca parola corespunde
        const passwordsMatch = bcrypt.compareSync(password, row.Password);
        if (!passwordsMatch) {
            return res.status(401).json({ error: 'Parola incorecta' });
        }
        else{
            jwt.sign({
                IdUtilizator: row.IdUtilizator,
                Username: row.Username, 
                Email:row.Email}, jwtSecret, {}, (err, token)=>{
                if (err) throw err;
                else res.cookie('token', token, {sameSite:'none', secure: true}).json(row);
            });
        }
    });
});

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    if (token){
        jwt.verify(token, jwtSecret, {}, (err, userData)=> {
            if (err) throw err;
            
            res.json(userData);
        });
    } else {
        res.json(null);
    }
});

app.post('/logout', (req, res)=> {
    res.cookie('token', '').json(true);
});

const photosMiddleware = multer({dest:'uploads/'});
app.post('/upload',photosMiddleware.array('photos', 100), (req, res) => {
    
    const uploadedFiles = [];
    for (let i=0; i< req.files.length; i++) {
        const {path, originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length-1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads/', ''));
    }
    
    res.json(uploadedFiles);
});

app.post('/addNewLocation', (req, res) => {
    const placeData = req.body;

    db.run(`INSERT INTO Locatii (UtilizatorIdUtilizator, Descriere, Adresa, Nume, Oras, Judet, Rating, Capacitate, PretPeZi, CheckIn, CheckOut, Facilitati)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [placeData.utilizatorIdUtilizator, placeData.descriere, placeData.alte, placeData.denumire, placeData.oras, placeData.judet, 0, placeData.capacitate, placeData.ppzi, placeData.checkIn, placeData.checkOut, placeData.facilitati],
            function(err) {
                if (err) {
                    console.error(err.message);
                    res.status(500).send("Error creating location entry");
                    return;
                }
                const locationId = this.lastID;

                placeData.addedPhotos.forEach(photoURL => {
                    db.run(`INSERT INTO Imagini (IdLocatie, URLimagine) VALUES (?, ?)`, [locationId, photoURL], function(err) {
                        if (err) {
                            console.error(err.message);
                            res.status(500).send("Error creating image entry");
                            return;
                        }
                    });
                });

                res.status(200).send("Entries created successfully");
            });
});

app.get('/api/userLocations', (req, res) => {
    const userId = req.query.userId;
  
    const sql = `
        SELECT L.IdLocatie AS LocatiiLocatieId, I.IdLocatie AS ImaginiLocatieId, L.*, I.*
        FROM Locatii L
        LEFT JOIN Imagini I ON L.IdLocatie = I.IdLocatie
        WHERE L.UtilizatorIdUtilizator = ?
    `;
  
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error('Error retrieving locations:', err.message);
            res.status(500).json({ error: 'Failed to retrieve locations' });
            return;
        }
  
        const locations = {};
  
        rows.forEach(row => {
            const locationId = row.LocatiiLocatieId;
            if (!locations[locationId]) {
                locations[locationId] = {
                    IdLocatie: row.LocatiiLocatieId,
                    UtilizatorIdUtilizator: row.UtilizatorIdUtilizator,
                    Descriere: row.Descriere,
                    Adresa: row.Adresa,
                    Nume: row.Nume,
                    Oras: row.Oras,
                    Judet: row.Judet,
                    Rating: row.Rating,
                    Capacitate: row.Capacitate,
                    PretPeZi: row.PretPeZi,
                    Facilitati: row.Facilitati,
                    images: []
                };
            }
  
            // Assuming you have an array `locations` and you are pushing images into it
            if (row.IdImagine) {
                locations[locationId].images.push({
                    IdImagine: row.IdImagine,
                    IdLocatie: row.ImaginiLocatieId,
                    URLimagine: row.URLimagine
                });

                // Sort the images array by IdImagine in ascending order
                locations[locationId].images.sort((a, b) => a.IdImagine - b.IdImagine);
            }   

        });
  
        const locationsArray = Object.values(locations);
  
        res.json({ locations: locationsArray });
    });
});

app.get('/places/:placeId', (req, res) => {
    const {placeId} = req.params;
    db.get('SELECT * FROM Locatii WHERE IdLocatie = ?', [placeId], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (row) {
                res.json(row);
            } else {
                res.status(404).json({ error: 'Locatie not found' });
            }
        }
    });
});

app.get('/getImageUrls/:placeId', (req, res) => {
    const action = req.params.placeId;

    // Execute the SQL query to select URLs
    db.all('SELECT URLimagine FROM Imagini WHERE IdLocatie = ?', [action], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            const urls = rows.map(row => row.URLimagine);
            res.json(urls);
        }
    });
});

app.post('/editLocation', (req, res) => {
    const placeData = req.body;

    db.run(`UPDATE Locatii SET 
                UtilizatorIdUtilizator = ?,
                Descriere = ?,
                Adresa = ?,
                Nume = ?,
                Oras = ?,
                Judet = ?,
                Capacitate = ?,
                PretPeZi = ?,
                CheckIn = ?,
                CheckOut = ?,
                Facilitati = ?
            WHERE IdLocatie = ?`,
            [
                placeData.utilizatorIdUtilizator,
                placeData.descriere,
                placeData.alte,
                placeData.denumire,
                placeData.oras,
                placeData.judet,
                placeData.capacitate,
                placeData.ppzi,
                placeData.checkIn,
                placeData.checkOut,
                placeData.facilitati,
                placeData.locationId
            ],
            function(err) {
                if (err) {
                    console.error(err.message);
                    res.status(500).send("Error updating location entry");
                    return;
                }

                // Delete existing photos associated with the location
                db.run(`DELETE FROM Imagini WHERE IdLocatie = ?`, [placeData.locationId], function(err) {
                    if (err) {
                        console.error(err.message);
                        res.status(500).send("Error deleting existing images");
                        return;
                    }

                    // Insert new photos for the location
                    placeData.addedPhotos.forEach(photoURL => {
                        db.run(`INSERT INTO Imagini (IdLocatie, URLimagine) VALUES (?, ?)`, [placeData.locationId, photoURL], function(err) {
                            if (err) {
                                console.error(err.message);
                                res.status(500).send("Error creating image entry");
                                return;
                            }
                        });
                    });

                    res.status(200).send("Entry updated successfully");
                });
            });
});

async function filterLocations(req, res) {
    try {
        const { Judet, MinCapacitate, MinRating, MaxPretPeZi, Oras, WordsInDescription, WordsInFacilities, startDate, endDate } = req.query;

        let sql = `SELECT * FROM Locatii WHERE 1=1`;
        const params = [];

        if (Judet) {
            sql += ` AND Judet LIKE ?`;
            params.push(Judet);
        }
        if (MinCapacitate) {
            sql += ` AND Capacitate >= ?`;
            params.push(parseInt(MinCapacitate));
        }
        if (MinRating) {
            sql += ` AND Rating >= ?`;
            params.push(parseFloat(MinRating));
        }
        if (MaxPretPeZi) {
            sql += ` AND PretPeZi <= ?`;
            params.push(parseFloat(MaxPretPeZi));
        }
        if (Oras) {
            sql += ` AND Oras LIKE ?`;
            params.push(Oras);
        }
        if (WordsInDescription) {
            sql += ` AND (${WordsInDescription.split(',').map(() => "Descriere LIKE ?").join(' OR ')})`;
            WordsInDescription.split(',').forEach(word => {
                params.push(`%${word}%`);
            });
        }
        if (WordsInFacilities) {
            sql += ` AND (${WordsInFacilities.split(',').map(() => "Facilitati LIKE ?").join(' OR ')})`;
            WordsInFacilities.split(',').forEach(word => {
                params.push(`%${word}%`);
            });
        }

        const rows = await getAllLocations(sql, params);

        if (startDate || endDate) {
            const filteredLocations = await filterLocationsByDate(rows, startDate, endDate);
            res.json(filteredLocations);
        } else {
            res.json(rows);
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function getAllLocations(sql, params) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function filterLocationsByDate(locations, startDate, endDate) {
    const filteredLocations = [];

    for (const location of locations) {
        const reservations = await getReservationsForLocation(location.IdLocatie);
        const overlaps = reservations.some(reservation => checkOverlap(reservation, startDate, endDate));

        if (!overlaps) {
            filteredLocations.push(location);
        }
    }

    return filteredLocations;
}

async function getReservationsForLocation(locationId) {
    const reservationsQuery = `SELECT * FROM Rezervari WHERE LocatiiIdLocatie2 = ?`;

    return new Promise((resolve, reject) => {
        db.all(reservationsQuery, [locationId], (err, reservations) => {
            if (err) {
                reject(err);
            } else {
                resolve(reservations);
            }
        });
    });
}

function checkOverlap(reservation, startDate, endDate) {
    if (!startDate || !endDate) {
        return false;
    }

    const parts1 = reservation.CheckInDate.split('-');
    const year1 = parseInt(parts1[0], 10);
    const month1 = parseInt(parts1[1], 10) - 1; // Subtract 1 because months are zero-based
    const day1 = parseInt(parts1[2], 10)
    const reservationStartDate = new Date(year1, month1, day1);

    const parts2 = reservation.CheckOutDate.split('-');
    const year2 = parseInt(parts2[0], 10);
    const month2 = parseInt(parts2[1], 10) - 1; // Subtract 1 because months are zero-based
    const day2 = parseInt(parts2[2], 10);
    const reservationEndDate = new Date(year2, month2, day2);

    const parts3 = startDate.split('-');
    const day3 = parseInt(parts3[0], 10);
    const month3 = parseInt(parts3[1], 10) - 1; // Subtract 1 because months are zero-based
    const year3 = parseInt(parts3[2], 10);
    const filterStartDate = new Date(year3, month3, day3);

    // Parse endDate into its components
    const parts4 = endDate.split('-');
    const day4 = parseInt(parts4[0], 10);
    const month4 = parseInt(parts4[1], 10) - 1; // Subtract 1 because months are zero-based
    const year4 = parseInt(parts4[2], 10);
    const filterEndDate = new Date(year4, month4, day4);

    if (reservationEndDate < filterStartDate || reservationStartDate > filterEndDate) {
        return false; // "No collision"
    } else if (reservationStartDate <= filterStartDate && reservationEndDate >= filterEndDate) {
        return true; // "Complete overlap"
    } else if (reservationStartDate >= filterStartDate && reservationEndDate <= filterEndDate) {
        return true; // "Complete overlap"
    } else if (reservationStartDate >= filterStartDate && reservationStartDate <= filterEndDate) {
        return true; // "Partial overlap"
    } else if (reservationEndDate >= filterStartDate && reservationEndDate <= filterEndDate) {
        return true; // "Partial overlap"
    } else {
        return false; // "No collision"
    }
}

app.get('/filterLocations', filterLocations);

// Delete location endpoint
app.delete('/deleteLocation/:locationId', (req, res) => {
    const locationId = req.params.locationId;

    const sql = `DELETE FROM Locatii WHERE IdLocatie = ?`;

    db.run(sql, [locationId], (err, result) => {
        if (err) {
            console.error('Error deleting location: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        console.log('Location deleted successfully');
        res.sendStatus(200);
    });
});

// Get all the reviews of a location
app.get('/getLocationReviews/:placeId', (req, res) => {
    const placeId = req.params.placeId;

    db.all('SELECT * FROM Recenzii WHERE LocatieIdLocatie = ? ORDER BY IdRecenzie DESC', [placeId], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(rows);
        }
    });
});

// Get all the reviews of a location
app.get('/getLocationReviews/:placeId', (req, res) => {
    const placeId = req.params.placeId;

    db.all('SELECT * FROM Recenzii WHERE LocatieIdLocatie = ?', [placeId], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(rows);
        }
    });
});

// Get all the bookings of a location
app.get('/getLocationBookings/:placeId', (req, res) => {
    const placeId = req.params.placeId;

    db.all(`SELECT * FROM Rezervari WHERE LocatiiIdLocatie2 = ? AND (Status = 'Completa' OR Status = 'In asteptare' OR Status = 'Rezervata')
    `, [placeId], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(rows);
        }
    });
});

// Get all user bookings (AS CLIENT)
app.get('/getAllUserBookings/:userId', (req, res) => {
    const userId = req.params.userId;

    db.all(`SELECT * FROM Rezervari WHERE UtilizatorIdUtilizator = ? ORDER BY IdRezervare DESC
    `, [userId], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(rows);
        }
    });
});

// Get all user bookings (AS HOST)
app.get('/getAllUserBookingsHOST/:userId', (req, res) => {
    const userId = req.params.userId;

    db.all(`SELECT * FROM Rezervari WHERE UtilizatorIdUtilizator2 = ? ORDER BY IdRezervare DESC
    `, [userId], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(rows);
        }
    });
});

// Get all user bookings within the last 48 hours (AS CLIENT)
app.get('/getAllUserBookings48Hours/:userId', (req, res) => {
    const userId = req.params.userId;

    // Query to select user bookings within the last 48 hours excluding cancelled bookings
    const sql = `
        SELECT *
        FROM Rezervari
        WHERE UtilizatorIdUtilizator = ? 
        AND BookingTimestamp >= strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime', '-2 days')
        AND Status NOT IN ('Anulata de oaspete', 'Anulata de gazda', 'Completa', 'Rezervata') ORDER BY IdRezervare DESC
    `;//, 'In asteptare')

    // Execute the query with parameters
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(rows);
        }
    });
});

// Get all user bookings within the last 48 hours (AS HOST)
app.get('/getAllUserBookings48HoursHOST/:userId', (req, res) => {
    const userId = req.params.userId;

    // Query to select user bookings within the last 48 hours excluding cancelled bookings
    const sql = `
        SELECT *
        FROM Rezervari
        WHERE UtilizatorIdUtilizator2 = ? 
        AND BookingTimestamp >= strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime', '-2 days')
        AND Status NOT IN ('Anulata de oaspete', 'Anulata de gazda', 'Completa', 'Rezervata') ORDER BY IdRezervare DESC
    `;//, 'In asteptare')

    // Execute the query with parameters
    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json(rows);
        }
    });
});


// Endpoint to get counts of user bookings and reviews for a location
app.get('/userBookingReviewCount/:userId/:locationId', (req, res) => {
    const { userId, locationId } = req.params;

    // Count bookings
    db.get(
        `SELECT COUNT(*) AS bookingCount FROM Rezervari WHERE UtilizatorIdUtilizator = ? AND LocatiiIdLocatie2 = ? AND Status = 'Completa' AND CheckOutDate < date('now', 'localtime')`,
        [userId, locationId],
        (err, bookingRow) => {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            const bookingCount = bookingRow ? bookingRow.bookingCount : 0;

            // Count reviews
            db.get(
                `SELECT COUNT(*) AS reviewCount FROM Recenzii WHERE UtilizatorIdUtilizator = ? AND LocatieIdLocatie = ?`,
                [userId, locationId],
                (err, reviewRow) => {
                    if (err) {
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }

                    const reviewCount = reviewRow ? reviewRow.reviewCount : 0;

                    res.json({ bookingCount, reviewCount });
                }
            );
        }
    );
});

// Define route for submitting a review
app.post('/submitReview', async (req, res) => {
    const { userId, locationId, rating, comment } = req.body;

    try {
        // Insert review into the Recenzii table
        const insertQuery = `
            INSERT INTO Recenzii (UtilizatorIdUtilizator, LocatieIdLocatie, Rating, Comentariu)
            VALUES (?, ?, ?, ?)
        `;
        await runQuery(insertQuery, [userId, locationId, rating, comment]);

        // Calculate new location rating
        const calculateRatingQuery = `
            SELECT AVG(Rating) AS AvgRating
            FROM Recenzii
            WHERE LocatieIdLocatie = ?
        `;
        const result = await getSingleResult(calculateRatingQuery, [locationId]);
        const newRating = result.AvgRating || 0;
        const roundedRating = parseFloat(newRating.toFixed(2));

        // Update location rating
        const updateQuery = `
            UPDATE Locatii
            SET Rating = ?
            WHERE IdLocatie = ?
        `;
        await runQuery(updateQuery, [roundedRating, locationId]);

        res.status(200).json({ message: 'Review submitted successfully.' });
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).json({ error: 'Failed to submit review.' });
    }
});

// Helper function to run a SQL query and return a promise
function runQuery(query, params) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this);
            }
        });
    });
}

// Helper function to execute a query that returns a single result
function getSingleResult(query, params) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

// Define a GET endpoint to retrieve the current local time
app.get('/localTime', (req, res) => {
    db.get("SELECT datetime('now', 'localtime') AS current_time", (err, row) => {
        if (err) {
            console.error("Error retrieving local time:", err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.json({ localTime: row.current_time });
        }
    });
});

app.get('/api/LocationInfo/:IdLocatie', (req, res) => {
    const IdLocatie = req.params.IdLocatie;
  
    const sql = `
        SELECT L.IdLocatie AS LocatiiLocatieId, I.IdLocatie AS ImaginiLocatieId, L.*, I.*
        FROM Locatii L
        LEFT JOIN Imagini I ON L.IdLocatie = I.IdLocatie
        WHERE L.IdLocatie = ?
    `;
  
    db.all(sql, [IdLocatie], (err, rows) => {
        if (err) {
            console.error('Error retrieving locations:', err.message);
            res.status(500).json({ error: 'Failed to retrieve locations' });
            return;
        }
  
        const locations = {};
  
        rows.forEach(row => {
            const locationId = row.LocatiiLocatieId;
            if (!locations[locationId]) {
                locations[locationId] = {
                    IdLocatie: row.LocatiiLocatieId,
                    UtilizatorIdUtilizator: row.UtilizatorIdUtilizator,
                    Descriere: row.Descriere,
                    Adresa: row.Adresa,
                    Nume: row.Nume,
                    Oras: row.Oras,
                    Judet: row.Judet,
                    Rating: row.Rating,
                    Capacitate: row.Capacitate,
                    PretPeZi: row.PretPeZi,
                    Facilitati: row.Facilitati,
                    images: []
                };
            }
  
            // Assuming you have an array `locations` and you are pushing images into it
            if (row.IdImagine) {
                locations[locationId].images.push({
                    IdImagine: row.IdImagine,
                    IdLocatie: row.ImaginiLocatieId,
                    URLimagine: row.URLimagine
                });

                // Sort the images array by IdImagine in ascending order
                locations[locationId].images.sort((a, b) => a.IdImagine - b.IdImagine);
            }   

        });
  
        const locationsArray = Object.values(locations);
  
        res.json({ locations: locationsArray });
    });
});

///////

// Backend method to cancel booking by host
app.put('/cancelBookingByHost/:bookingId', (req, res) => {
    const bookingId = req.params.bookingId;

    const updateBookingSql = `
        UPDATE Rezervari
        SET Status = 'Anulata de gazda'
        WHERE IdRezervare = ?
    `;

    db.run(updateBookingSql, [bookingId], function(err) {
        if (err) {
            console.error('Error updating booking status:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const updatePaymentSql = `
            UPDATE Plati
            SET Status = 'Fonduri returnate integral oaspetelui'
            WHERE RezervareIdRezervare = ?
        `;

        db.run(updatePaymentSql, [bookingId], function(err) {
            if (err) {
                console.error('Error updating payment status:', err.message);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            console.log(`Booking ${bookingId} and payment cancelled by host successfully.`);
            res.json({ message: `Booking ${bookingId} and payment cancelled by host successfully.` });
        });
    });
});

// Backend method to cancel booking by customer
app.put('/cancelBookingByCustomer/:bookingId', (req, res) => {
    const bookingId = req.params.bookingId;

    const updateBookingSql = `
        UPDATE Rezervari
        SET Status = 'Anulata de oaspete'
        WHERE IdRezervare = ?
    `;

    db.run(updateBookingSql, [bookingId], function(err) {
        if (err) {
            console.error('Error updating booking status:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        const updatePaymentSql = `
            UPDATE Plati
            SET Status = 'Fonduri returnate integral oaspetelui'
            WHERE RezervareIdRezervare = ?
        `;

        db.run(updatePaymentSql, [bookingId], function(err) {
            if (err) {
                console.error('Error updating payment status:', err.message);
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }

            console.log(`Booking ${bookingId} and payment cancelled by customer successfully.`);
            res.json({ message: `Booking ${bookingId} and payment cancelled by customer successfully.` });
        });
    });
});

app.post('/createPayment', (req, res) => {
    const { reservationId, cardNumber, expDate, cvc } = req.body;
    const lastFourDigits = cardNumber.slice(-4);

    const sql = `
        INSERT INTO Plati (RezervareIdRezervare, ModalitatePlata, Status)
        VALUES (?, ?, 'In asteptare')
    `;
    const params = [reservationId, `Card ending in ${lastFourDigits}`];

    db.run(sql, params, function(err) {
        if (err) {
            console.error('Error creating payment:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ id: this.lastID });
    });
});

// Backend code for creating a reservation
app.post('/createReservation', (req, res) => {
    const { userId, locationId, hostId, checkInDate, checkOutDate, price } = req.body;

    if (!userId || !locationId || !checkInDate || !checkOutDate || !price || !hostId) {
        console.error('Missing required fields:', { userId, locationId, hostId, checkInDate, checkOutDate, price });
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    const sql = `
        INSERT INTO Rezervari (UtilizatorIdUtilizator, LocatiiIdLocatie2, UtilizatorIdUtilizator2, CheckInDate, CheckOutDate, Pret, Status, BookingTimestamp)
        VALUES (?, ?, ?, ?, ?, ?, 'In asteptare', datetime('now'))
    `;
    const params = [userId, locationId, hostId, checkInDate, checkOutDate, price];

    db.run(sql, params, function (err) {
        if (err) {
            console.error('Error creating reservation:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        console.log("Reservation created with ID: ", this.lastID);
        res.json({ id: this.lastID });
    });

});


const cron = require('node-cron');
const updateReservationsAndPayments = () => {
    const now = new Date();
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setHours(now.getHours() - 48);  // Set to 48 hours ago

    const formattedTwoDaysAgo = twoDaysAgo.toISOString().slice(0, 19).replace('T', ' '); //

    const updateReservationsSql = `
        UPDATE Rezervari
        SET Status = 'Rezervata'
        WHERE Status = 'In asteptare' AND BookingTimestamp <= ?
    `;

    const updatePaymentsSql = `
        UPDATE Plati
        SET Status = 'Fonduri transferate in conturile Occasionest (10%) si gazdei (90%)'
        WHERE Status = 'In asteptare' AND RezervareIdRezervare IN (
            SELECT IdRezervare FROM Rezervari WHERE Status = 'Rezervata'
        )
    `;

    const updatePastReservationsSql = `
        UPDATE Rezervari
        SET Status = 'Completa'
        WHERE Status = 'Rezervata' AND CheckoutDate <= ?
    `;

    // Update reservations to 'Rezervata'
    db.run(updateReservationsSql, [formattedTwoDaysAgo], function (err) {
        if (err) {
            return console.error('Error updating reservations:', err.message);
        }
        console.log(`Updated ${this.changes} reservations to 'Rezervata'.`);

        // Update payments for reservations now set to 'Rezervata'
        db.run(updatePaymentsSql, function (err) {
            if (err) {
                return console.error('Error updating payments:', err.message);
            }
            console.log(`Updated ${this.changes} payments to 'Fonduri transferate in conturile Occasionest (10%) si gazdei (90%)'.`);

            // Update reservations to 'Completa' where the checkout date is in the past
            db.run(updatePastReservationsSql, [now.toISOString().slice(0, 19).replace('T', ' ')], function (err) {
                if (err) {
                    return console.error('Error updating past reservations:', err.message);
                }
                console.log(`Updated ${this.changes} past due reservations to 'Completa'.`);
            });
        });
    });
};

const updateReservationsAndPaymentsTest = () => {
    const now = new Date();
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setHours(now.getHours() - 0);  // Normally set to 48 hours ago

    const formattedTwoDaysAgo = twoDaysAgo.toISOString().slice(0, 19).replace('T', ' '); //

    const updateReservationsSql = `
        UPDATE Rezervari
        SET Status = 'Rezervata'
        WHERE Status = 'In asteptare' AND BookingTimestamp <= ?
    `;

    const updatePaymentsSql = `
        UPDATE Plati
        SET Status = 'Fonduri transferate in conturile Occasionest (10%) si gazdei (90%)'
        WHERE Status = 'In asteptare' AND RezervareIdRezervare IN (
            SELECT IdRezervare FROM Rezervari WHERE Status = 'Rezervata'
        )
    `;

    const updatePastReservationsSql = `
        UPDATE Rezervari
        SET Status = 'Completa'
        WHERE Status = 'Rezervata' AND CheckoutDate <= ?
    `;

    // Update reservations to 'Rezervata'
    db.run(updateReservationsSql, [formattedTwoDaysAgo], function (err) {
        if (err) {
            return console.error('Error updating reservations:', err.message);
        }
        console.log(`Updated ${this.changes} reservations to 'Rezervata'.`);

        // Update payments for reservations now set to 'Rezervata'
        db.run(updatePaymentsSql, function (err) {
            if (err) {
                return console.error('Error updating payments:', err.message);
            }
            console.log(`Updated ${this.changes} payments to 'Fonduri transferate in conturile Occasionest (10%) si gazdei (90%)'.`);

            // Update reservations to 'Completa' where the checkout date is in the past
            db.run(updatePastReservationsSql, [now.toISOString().slice(0, 19).replace('T', ' ')], function (err) {
                if (err) {
                    return console.error('Error updating past reservations:', err.message);
                }
                console.log(`Updated ${this.changes} past due reservations to 'Completa'.`);
            });
        });
    });
};

app.get('/update-reservations-and-payments-test', (req, res) => {
    updateReservationsAndPaymentsTest();
    res.send('Reservation and payment update process initiated.');
});


// Schedule the cron job to run at 1 AM every day
cron.schedule('0 1 * * *', () => { // 0 1 pt 01:00
    console.log('Running cron job to update reservations and payments...');
    updateReservationsAndPayments();
}, {
    timezone: "Europe/Bucharest"
});

app.post('/createTestReservationIn2023', (req, res) => {
    const { userId, locationId, hostId } = req.body;

    if (!userId || !locationId || !hostId) {
        console.error('Missing required fields:', { userId, locationId, hostId });
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    const sql = `
        INSERT INTO Rezervari (UtilizatorIdUtilizator, LocatiiIdLocatie2, UtilizatorIdUtilizator2, CheckInDate, CheckOutDate, Pret, Status, BookingTimestamp)
        VALUES (?, ?, ?, '2023-01-01', '2023-01-01', 1, 'In asteptare', '2023-01-01 00:00:00')
    `;
    const params = [userId, locationId, hostId];

    db.run(sql, params, function (err) {
        if (err) {
            console.error('Error creating reservation:', err.message);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        console.log("Test reservation created with ID: ", this.lastID);
        res.json({ id: this.lastID });
    });
});

// API endpoint to get payment status by RezervareIdRezervare
app.get('/paymentStatus/:id', (req, res) => {
    const id = req.params.id;
    db.get(`SELECT Status FROM Plati WHERE RezervareIdRezervare = ?`, [id], (err, row) => {
        if (err) {
            res.status(500).send({ error: 'Error querying the database' });
            return;
        }
        if (row) {
            res.status(200).send({ id: id, status: row.Status });
        } else {
            res.status(404).send({ error: 'Payment not found' });
        }
    });
});

app.get('/api/total-price/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = `
        SELECT SUM(R.Pret) as total_price
        FROM Rezervari R
        JOIN Plati P ON R.IdRezervare = P.RezervareIdRezervare
        WHERE R.UtilizatorIdUtilizator2 = ?
          AND P.Status IN ("Fonduri extrase de OccasioNest", "Fonduri transferate in conturile Occasionest (10%) si gazdei (90%)")
    `;

    db.get(query, [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ totalPrice: row.total_price || 0 });
    });
});

app.get('/api/total-price-admin', (req, res) => {
    const userId = req.params.userId;
    const query = `
        SELECT SUM(R.Pret) as total_price
        FROM Rezervari R
        JOIN Plati P ON R.IdRezervare = P.RezervareIdRezervare
        WHERE P.Status IN ("Fonduri extrase de Gazda", "Fonduri transferate in conturile Occasionest (10%) si gazdei (90%)")
    `;

    db.get(query, [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ totalPrice: row.total_price || 0 });
    });
});

// New endpoint to update payment statuses by hosts extraction
app.post('/api/update-statuses/:userId', (req, res) => {
    const userId = req.params.userId;
    const updateQuery = `
        UPDATE Plati
        SET Status = CASE
            WHEN Status = "Fonduri extrase de OccasioNest" THEN "Fonduri extrase de Occasionest si de Gazda"
            WHEN Status = "Fonduri transferate in conturile Occasionest (10%) si gazdei (90%)" THEN "Fonduri extrase de Gazda"
        END
        WHERE RezervareIdRezervare IN (
            SELECT IdRezervare
            FROM Rezervari
            WHERE UtilizatorIdUtilizator2 = ?
        )
        AND Status IN ("Fonduri extrase de OccasioNest", "Fonduri transferate in conturile Occasionest (10%) si gazdei (90%)")
    `;

    db.run(updateQuery, [userId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Statuses updated successfully', changes: this.changes });
    });
});

// New endpoint to update payment statuses by OccasioNest extraction
app.post('/api/update-statuses-admin', (req, res) => {
    const userId = req.params.userId;
    const updateQuery = `
        UPDATE Plati
        SET Status = CASE
            WHEN Status = "Fonduri extrase de Gazda" THEN "Fonduri extrase de Occasionest si de Gazda"
            WHEN Status = "Fonduri transferate in conturile Occasionest (10%) si gazdei (90%)" THEN "Fonduri extrase de OccasioNest"
        END
        WHERE Status IN ("Fonduri extrase de Gazda", "Fonduri transferate in conturile Occasionest (10%) si gazdei (90%)")
    `;

    db.run(updateQuery, [userId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Statuses updated successfully', changes: this.changes });
    });
});

// New endpoint to fetch user info
app.get('/api/user-info/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = `SELECT * FROM Utilizatori WHERE IdUtilizator = ?`;

    db.get(query, [userId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(row);
    });
});

// Function to get payment stats
const getPaymentStats = () => {
    return new Promise((resolve, reject) => {
      const query = "SELECT Status, COUNT(*) AS count FROM Plati GROUP BY Status";
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
  };
  
  // Function to get reservation stats
  const getReservationStats = () => {
    return new Promise((resolve, reject) => {
      const query = "SELECT Status, COUNT(*) AS count FROM Rezervari GROUP BY Status";
      db.all(query, [], (err, rows) => {
        if (err) {
          reject(err);
        }
        resolve(rows);
      });
    });
  };
  
  // Payment stats endpoint
  app.get('/api/payments/stats', async (req, res) => {
    try {
      const stats = await getPaymentStats();
      res.json(stats);
    } catch (error) {
      console.error('Failed to retrieve payment stats:', error);
      res.status(500).send('Error fetching payment stats');
    }
  });
  
  // Reservation stats endpoint
  app.get('/api/reservations/stats', async (req, res) => {
    try {
      const stats = await getReservationStats();
      res.json(stats);
    } catch (error) {
      console.error('Failed to retrieve reservation stats:', error);
      res.status(500).send('Error fetching reservation stats');
    }
  });

  app.get('/api/checkReservations/:location_id', (req, res) => {
    const locationId = req.params.location_id;

    const sql = `
        SELECT Status FROM Rezervari 
        WHERE LocatiiIdLocatie2 = ?
    `;

    db.all(sql, [locationId], (err, rows) => {
        if (err) {
            console.error('Error executing SQL', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        const canDelete = rows.every(row => row.Status !== 'Rezervata' && row.Status !== 'In asteptare');
        res.json({ canDelete });
    });
});

  

// Start the server
app.listen(4000, () => {
    console.log(`Server is running on port 4000`);
});