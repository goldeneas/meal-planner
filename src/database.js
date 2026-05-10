export async function createTables(db) {
    await db.executeSql("CREATE TABLE Difficulty(\
        id INTEGER PRIMARY KEY,\
        description TEXT NOT NULL\
    )");

    await db.executeSql("CREATE TABLE RecipeCategory(\
        id INTEGER PRIMARY KEY,\
        description TEXT NOT NULL\
    )");

    await db.executeSql("CREATE TABLE Recipe(\
        id INTEGER PRIMARY KEY,\
        name TEXT NOT NULL,\
        preparationTimeMinutes INTEGER NOT NULL,\
        numberOfServings INTEGER NOT NULL,\
        description TEXT NOT NULL,\
        difficulty INTEGER NOT NULL,\
        category INTEGER NOT NULL,\
        \
        FOREIGN KEY (difficulty) REFERENCES Difficulty(id) ON DELETE RESTRICT,\
        FOREIGN KEY (category) REFERENCES RecipeCategory(id) ON DELETE RESTRICT\
    )");

    await db.executeSql("CREATE TABLE DayOfWeek(\
        id INTEGER PRIMARY KEY,\
        name TEXT NOT NULL\
    )");

    await db.executeSql("CREATE TABLE TimeSlot(\
        id INTEGER PRIMARY KEY,\
        name TEXT NOT NULL\
    )");

    await db.executeSql("CREATE TABLE Meal(\
        id INTEGER PRIMARY KEY,\
        recipe INTEGER NOT NULL,\
        dayOfWeek INTEGER NOT NULL,\
        timeSlot INTEGER NOT NULL,\
        \
        FOREIGN KEY (recipe) REFERENCES Recipe(id) ON DELETE CASCADE,\
        FOREIGN KEY (dayOfWeek) REFERENCES DayOfWeek(id) ON DELETE RESTRICT,\
        FOREIGN KEY (timeSlot) REFERENCES TimeSlot(id) ON DELETE RESTRICT\
    )");

    await db.executeSql("CREATE TABLE UnitOfMeasure(\
        id INTEGER PRIMARY KEY,\
        symbol TEXT NOT NULL\
    )");

    await db.executeSql("CREATE TABLE FoodCategory(\
        id INTEGER PRIMARY KEY,\
        description TEXT NOT NULL\
    )");

    await db.executeSql("CREATE TABLE Food(\
        id INTEGER PRIMARY KEY,\
        description TEXT,\
        category INTEGER NOT NULL,\
        \
        FOREIGN KEY (category) REFERENCES FoodCategory(id) ON DELETE RESTRICT\
    )");

    await db.executeSql("CREATE TABLE Ingredient(\
        id INTEGER PRIMARY KEY,\
        quantity REAL NOT NULL,\
        recipe INTEGER NOT NULL,\
        unitOfMeasure INTEGER NOT NULL,\
        food INTEGER NOT NULL,\
        \
        FOREIGN KEY (food) REFERENCES Food(id) ON DELETE RESTRICT,\
        FOREIGN KEY (unitOfMeasure) REFERENCES UnitOfMeasure(id) ON DELETE RESTRICT,\
        FOREIGN KEY (recipe) REFERENCES Recipe(id) ON DELETE CASCADE\
    )");

    await db.executeSql("CREATE TABLE ShoppingItem(\
        id INTEGER PRIMARY KEY,\
        name TEXT NOT NULL,\
        quantity REAL NOT NULL,\
        food INTEGER NOT NULL,\
        purchaseDate TEXT,\
        unitOfMeasure INTEGER NOT NULL,\
        \
        FOREIGN KEY (food) REFERENCES Food(id) ON DELETE RESTRICT,\
        FOREIGN KEY (unitOfMeasure) REFERENCES UnitOfMeasure(id) ON DELETE RESTRICT\
    )");

    await db.executeSql("CREATE TABLE PantryProduct(\
        id INTEGER PRIMARY KEY,\
        expirationDate TEXT,\
        quantity REAL NOT NULL,\
        unitOfMeasure INTEGER NOT NULL,\
        food INTEGER NOT NULL,\
        \
        FOREIGN KEY (unitOfMeasure) REFERENCES UnitOfMeasure(id) ON DELETE RESTRICT,\
        FOREIGN KEY (food) REFERENCES Food(id) ON DELETE RESTRICT\
    )");

    await db.executeSql("CREATE TABLE Note(\
        id INTEGER PRIMARY KEY,\
        description TEXT NOT NULL,\
        pantryProduct INTEGER NOT NULL,\
        \
        FOREIGN KEY (pantryProduct) REFERENCES PantryProduct(id) ON DELETE CASCADE\
    )");
}
