const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');

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
    origin: 'http://localhost:3000'
}));

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});

app.get('/test', (req, res) => {
    res.status(200);
    res.json('test ok!');
});

// Inserare utilizator nou in DB
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    
    // Verificam daca utilizatorul exista deja
    db.get(`SELECT * FROM Utilizatori WHERE Username = ?`, [username], (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        
        // Daca se gaseste un rand cu utilizatorul, se returneaza randul
        if (row) {
            return res.status(422).json({ error: 'Nume de utilizator deja existent' });
        } else {
            // Daca nu se gaseste utilizatorul, se continua procesul de inregistrare
            const encryptedPassword = bcrypt.hashSync(password, bcryptSalt);
            const query = `INSERT INTO Utilizatori(Username, Email, Password) VALUES (?,?,?)`;
            db.run(query, [username, email, encryptedPassword], (err) => {
                if (err) {
                    console.error(err.message);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                res.status(201).json({ message: 'Utilizator creat cu succes' });
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
    const day1 = parseInt(parts1[0], 10);
    const month1 = parseInt(parts1[1], 10) - 1; // Subtract 1 because months are zero-based
    const year1 = parseInt(parts1[2], 10)
    const reservationStartDate = new Date(year1, month1, day1);

    const parts2 = reservation.CheckOutDate.split('-');
    const day2 = parseInt(parts2[0], 10);
    const month2 = parseInt(parts2[1], 10) - 1; // Subtract 1 because months are zero-based
    const year2 = parseInt(parts2[2], 10);
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

    return (
        filterStartDate <= reservationEndDate && filterEndDate >= reservationStartDate ||
        filterStartDate >= reservationStartDate && filterEndDate >= reservationEndDate ||
        filterStartDate <= reservationStartDate && filterEndDate >= reservationEndDate ||
        filterStartDate >= reservationStartDate && filterEndDate <= reservationEndDate
    );
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