CREATE TABLE Utilizatori (
    IdUtilizator INTEGER PRIMARY KEY AUTOINCREMENT,
    Username TEXT,
    Email TEXT,
    Password TEXT
);

CREATE TABLE Locatii (
    IdLocatie INTEGER PRIMARY KEY AUTOINCREMENT,
    UtilizatorIdUtilizator INTEGER NOT NULL,
    RezervareIdRezervare INTEGER NOT NULL,
    Descriere TEXT,
    Adresa TEXT,
    Nume TEXT,
    Rating REAL NOT NULL,
    Capacitate INTEGER NOT NULL,
    PretPeNoapte REAL NOT NULL,
    FOREIGN KEY(UtilizatorIdUtilizator) REFERENCES Utilizator(IdUtilizator),
    FOREIGN KEY(RezervareIdRezervare) REFERENCES Rezervare(IdRezervare)
);

CREATE TABLE Rezervari (
    IdRezervare INTEGER PRIMARY KEY AUTOINCREMENT,
    UtilizatorIdUtilizator2 INTEGER NOT NULL,
    UtilizatorIdUtilizator INTEGER NOT NULL,
    CheckInDate TEXT,
    CheckOutDate TEXT,
    Pret REAL NOT NULL,
    Status TEXT,
    FOREIGN KEY(UtilizatorIdUtilizator) REFERENCES Utilizator(IdUtilizator),
    FOREIGN KEY(UtilizatorIdUtilizator2) REFERENCES Utilizator(IdUtilizator)
);

CREATE TABLE Recenzii (
    IdRecenzie INTEGER PRIMARY KEY AUTOINCREMENT,
    UtilizatorIdUtilizator INTEGER NOT NULL,
    LocatieIdLocatie INTEGER NOT NULL,
    IdUtilizator INTEGER NOT NULL,
    IdLocatie INTEGER NOT NULL,
    Rating REAL NOT NULL,
    Comentariu TEXT,
    FOREIGN KEY(UtilizatorIdUtilizator) REFERENCES Utilizator(IdUtilizator),
    FOREIGN KEY(LocatieIdLocatie) REFERENCES Locatie(IdLocatie)
);

CREATE TABLE Categorii (
    IdCategorie INTEGER PRIMARY KEY AUTOINCREMENT,
    Nume TEXT,
    Descriere TEXT
);

CREATE TABLE Plati (
    IdPlata INTEGER PRIMARY KEY AUTOINCREMENT,
    RezervareIdRezervare INTEGER NOT NULL,
    ModalitatePlata TEXT,
    Status TEXT,
    FOREIGN KEY(RezervareIdRezervare) REFERENCES Rezervare(IdRezervare)
);

CREATE TABLE Categorie_Locatie (
    CategorieIdCategorie INTEGER NOT NULL,
    LocatieIdLocatie INTEGER NOT NULL,
    PRIMARY KEY (CategorieIdCategorie, LocatieIdLocatie),
    FOREIGN KEY (CategorieIdCategorie) REFERENCES Categorie(IdCategorie),
    FOREIGN KEY (LocatieIdLocatie) REFERENCES Locatie(IdLocatie)
);
