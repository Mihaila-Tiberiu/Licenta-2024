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
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads'));
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

app.post('/places', (req, res) => {
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