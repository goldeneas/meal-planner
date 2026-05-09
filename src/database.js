export async function createTables(db) {
    await db.executeSql("CREATE TABLE Difficolta(\
        id INTEGER PRIMARY KEY,\
        descrizione TEXT NOT NULL\
    )");

    await db.executeSql("CREATE TABLE CategoriaRicetta(\
        id INTEGER PRIMARY KEY,\
        descrizione TEXT NOT NULL\
    )");

    await db.executeSql("CREATE TABLE Ricetta(\
        id INTEGER PRIMARY KEY,\
        nome TEXT NOT NULL,\
        tempoPreparazioneMinuti INTEGER NOT NULL,\
        numeroPorzioni INTEGER NOT NULL,\
        descrizione TEXT NOT NULL,\
        difficolta INTEGER NOT NULL,\
        categoria INTEGER NOT NULL,\
        \
        FOREIGN KEY (difficolta) REFERENCES Difficolta(id) ON DELETE RESTRICT,\
        FOREIGN KEY (categoria) REFERENCES CategoriaRicetta(id) ON DELETE RESTRICT\
    )");

    await db.executeSql("CREATE TABLE GiornoSettimana(\
        id INTEGER PRIMARY KEY,\
        nome TEXT NOT NULL\
    )");

    await db.executeSql("CREATE TABLE FasciaOraria(\
        id INTEGER PRIMARY KEY,\
        nome TEXT NOT NULL\
    )");

    await db.executeSql("CREATE TABLE Pasto(\
        id INTEGER PRIMARY KEY,\
        ricetta INTEGER NOT NULL,\
        giornoSettimana INTEGER NOT NULL,\
        fasciaOraria INTEGER NOT NULL,\
        \
        FOREIGN KEY (ricetta) REFERENCES Ricetta(id) ON DELETE CASCADE,\
        FOREIGN KEY (giornoSettimana) REFERENCES GiornoSettimana(id) ON DELETE RESTRICT\
        FOREIGN KEY (fasciaOraria) REFERENCES FasciaOraria(id) ON DELETE RESTRICT\
    )");

    await db.executeSql("CREATE TABLE UnitaMisura(\
        id INTEGER PRIMARY KEY,\
        simbolo TEXT NOT NULL\
    )");

    await db.executeSql("CREATE TABLE CategoriaAlimento(\
        id INTEGER PRIMARY KEY,\
        descrizione TEXT NOT NULL\
    )");

    await db.executeSql("CREATE TABLE Alimento(\
        id INTEGER PRIMARY KEY,\
        descrizione TEXT,\
        categoria INTEGER NOT NULL,\
        \
        FOREIGN KEY (categoria) REFERENCES CategoriaAlimento(id) ON DELETE RESTRICT\
    )");

    await db.executeSql("CREATE TABLE Ingrediente(\
        id INTEGER PRIMARY KEY,\
        quantita REAL NOT NULL,\
        ricetta INTEGER NOT NULL,\
        unitaMisura INTEGER NOT NULL,\
        alimento INTEGER NOT NULL,\
        \
        FOREIGN KEY (alimento) REFERENCES Alimento(id) ON DELETE RESTRICT,\
        FOREIGN KEY (unitaMisura) REFERENCES UnitaMisura(id) ON DELETE RESTRICT,\
        FOREIGN KEY (ricetta) REFERENCES Ricetta(id) ON DELETE CASCADE\
    )");

    await db.executeSql("CREATE TABLE ElementoSpesa(\
        id INTEGER PRIMARY KEY,\
        nome TEXT NOT NULL,\
        quantita REAL NOT NULL,\
        alimento INTEGER NOT NULL,\
        dataAcquisto TEXT,\
        unitaMisura INTEGER NOT NULL,\
        \
        FOREIGN KEY (alimento) REFERENCES Alimento(id) ON DELETE RESTRICT,\
        FOREIGN KEY (unitaMisura) REFERENCES UnitaMisura(id) ON DELETE RESTRICT\
    )");

    await db.executeSql("CREATE TABLE ProdottoDispensa(\
        id INTEGER PRIMARY KEY,\
        dataScadenza TEXT,\
        quantita REAL NOT NULL,\
        unitaMisura INTEGER NOT NULL,\
        alimento INTEGER NOT NULL,\
        \
        FOREIGN KEY (unitaMisura) REFERENCES UnitaMisura(id) ON DELETE RESTRICT,\
        FOREIGN KEY (alimento) REFERENCES Alimento(id) ON DELETE RESTRICT\
    )");

    await db.executeSql("CREATE TABLE Nota(\
        id INTEGER PRIMARY KEY,\
        descrizione TEXT NOT NULL,\
        prodottoDispensa INTEGER NOT NULL,\
        \
        FOREIGN KEY (prodottoDispensa) REFERENCES ProdottoDispensa(id) ON DELETE CASCADE\
    )");
}
