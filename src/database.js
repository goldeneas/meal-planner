export async function createTables(db) {
    await db.executeSql("CREATE TABLE Difficolta(\
        id INTEGER PRIMARY KEY,\
        descrizione TEXT\
    )");

    await db.executeSql("CREATE TABLE CategoriaRicetta(\
        id INTEGER PRIMARY KEY,\
        descrizione TEXT\
    )");

    await db.executeSql("CREATE TABLE Ricetta(\
        id INTEGER PRIMARY KEY,\
        nome TEXT,\
        tempoPreparazioneMinuti INTEGER,\
        numeroPorzioni INTEGER,\
        descrizione TEXT,\
        difficolta INTEGER,\
        categoria INTEGER,\
        \
        FOREIGN KEY (difficolta) REFERENCES Difficolta(id)\
        FOREIGN KEY (categoria) REFERENCES CategoriaRicetta(id)\
    )");

    await db.executeSql("CREATE TABLE GiornoSettimana(\
        id INTEGER PRIMARY KEY,\
        nome TEXT\
    )");

    await db.executeSql("CREATE TABLE FasciaOraria(\
        id INTEGER PRIMARY KEY,\
        nome TEXT\
    )");

    await db.executeSql("CREATE TABLE Pasto(\
        id INTEGER PRIMARY KEY,\
        ricetta INTEGER,\
        giornoSettimana INTEGER,\
        fasciaOraria INTEGER,\
        \
        FOREIGN KEY (ricetta) REFERENCES Ricetta(id),\
        FOREIGN KEY (giornoSettimana) REFERENCES GiornoSettimana(id)\
        FOREIGN KEY (fasciaOraria) REFERENCES FasciaOraria(id)\
    )");

    await db.executeSql("CREATE TABLE UnitaMisura(\
        id INTEGER PRIMARY KEY,\
        simbolo TEXT\
    )");

    await db.executeSql("CREATE TABLE CategoriaAlimento(\
        id INTEGER PRIMARY KEY,\
        descrizione TEXT\
    )");

    await db.executeSql("CREATE TABLE Alimento(\
        id INTEGER PRIMARY KEY,\
        descrizione TEXT,\
        categoria INTEGER,\
        \
        FOREIGN KEY categoria REFERENCES CategoriaAlimento(id)\
    )");

    await db.executeSql("CREATE TABLE Ingrediente(\
        id INTEGER PRIMARY KEY,\
        quantita REAL,\
        ricetta INTEGER,\
        unitaMisura INTEGER,\
        alimento INTEGER,\
        \
        FOREIGN KEY (alimento) REFERENCES Alimento(id)\
        FOREIGN KEY (unitaMisura) REFERENCES UnitaMisura(id)\
        FOREIGN KEY (ricetta) REFERENCES Ricetta(id)\
    )");

    await db.executeSql("CREATE TABLE ElementoSpesa(\
        id INTEGER PRIMARY KEY,\
        nome TEXT,\
        quantita REAL,\
        alimento INTEGER,\
        dataAcquisto TEXT,\
        unitaMisura INTEGER,\
        \
        FOREIGN KEY (alimento) REFERENCES Alimento(id),\
        FOREIGN KEY (unitaMisura) REFERENCES UnitaMisura(id)\
    )");

    await db.executeSql("CREATE TABLE ProdottoDispensa(\
        id INTEGER PRIMARY KEY,\
        dataScadenza TEXT,\
        quantita REAL,\
        unitaMisura INTEGER,\
        alimento INTEGER,\
        \
        FOREIGN KEY (unitaMisura) REFERENCES UnitaMisura(id),\
        FOREIGN KEY (alimento) REFERENCES Alimento(id)\
    )");

    await db.executeSql("CREATE TABLE Nota(\
        id INTEGER PRIMARY KEY,\
        descrizione TEXT,\
        prodottoDispensa INTEGER,\
        \
        FOREIGN KEY (prodottoDispensa) REFERENCES ProdottoDispensa(id)\
    )");
}
