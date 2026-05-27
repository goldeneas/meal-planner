export async function createTables(db) {
    await db.execAsync(`
        PRAGMA foreign_keys = ON;

        CREATE TABLE IF NOT EXISTS RecipeDifficulty(
            id INTEGER PRIMARY KEY,
            description TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS RecipeCategory(
            id INTEGER PRIMARY KEY,
            description TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Recipe(
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            preparationTimeMinutes INTEGER NOT NULL,
            numberOfServings INTEGER NOT NULL,
            description TEXT NOT NULL,
            difficulty INTEGER NOT NULL,
            category INTEGER NOT NULL,
            note TEXT,
            FOREIGN KEY (difficulty) REFERENCES RecipeDifficulty(id) ON DELETE RESTRICT,
            FOREIGN KEY (category) REFERENCES RecipeCategory(id) ON DELETE RESTRICT
        );

        CREATE TABLE IF NOT EXISTS DayOfWeek(
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS TimeSlot(
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Meal(
            id INTEGER PRIMARY KEY,
            recipe INTEGER NOT NULL,
            dayOfWeek INTEGER NOT NULL,
            timeSlot INTEGER NOT NULL,
            FOREIGN KEY (recipe) REFERENCES Recipe(id) ON DELETE CASCADE,
            FOREIGN KEY (dayOfWeek) REFERENCES DayOfWeek(id) ON DELETE RESTRICT,
            FOREIGN KEY (timeSlot) REFERENCES TimeSlot(id) ON DELETE RESTRICT
        );

        CREATE TABLE IF NOT EXISTS UnitOfMeasure(
            id INTEGER PRIMARY KEY,
            symbol TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS FoodCategory(
            id INTEGER PRIMARY KEY,
            description TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Food(
            id INTEGER PRIMARY KEY,
            name TEXT,
            description TEXT,
            category INTEGER NOT NULL,
            FOREIGN KEY (category) REFERENCES FoodCategory(id) ON DELETE RESTRICT
        );

        CREATE TABLE IF NOT EXISTS Ingredient(
            id INTEGER PRIMARY KEY,
            quantity REAL NOT NULL,
            recipe INTEGER NOT NULL,
            unitOfMeasure INTEGER NOT NULL,
            food INTEGER NOT NULL,
            FOREIGN KEY (food) REFERENCES Food(id) ON DELETE RESTRICT,
            FOREIGN KEY (unitOfMeasure) REFERENCES UnitOfMeasure(id) ON DELETE RESTRICT,
            FOREIGN KEY (recipe) REFERENCES Recipe(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS ShoppingItem(
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            quantity REAL NOT NULL,
            food INTEGER NOT NULL,
            purchaseDate TEXT,
            unitOfMeasure INTEGER NOT NULL,
            purchased BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (food) REFERENCES Food(id) ON DELETE RESTRICT,
            FOREIGN KEY (unitOfMeasure) REFERENCES UnitOfMeasure(id) ON DELETE RESTRICT
        );

        CREATE TABLE IF NOT EXISTS PantryProduct(
            id INTEGER PRIMARY KEY,
            expirationDate TEXT,
            quantity REAL NOT NULL,
            warningQuantity REAL,
            unitOfMeasure INTEGER NOT NULL,
            food INTEGER NOT NULL,
            note TEXT,
            FOREIGN KEY (unitOfMeasure) REFERENCES UnitOfMeasure(id) ON DELETE RESTRICT,
            FOREIGN KEY (food) REFERENCES Food(id) ON DELETE RESTRICT
        );
  `);
}

export async function queryAllAsync(db, query) {
    res = null

    try {
        res = await db.queryAllAsync(query)
    } catch (e) {
        console.error("error in queryAllAsync: ", e)
    }

    return res
}

export async function queryFirstAsync(db, query) {
    res = null

    try {
        res = await db.queryFirstAsync(query)
    } catch (e) {
        console.error("error in queryFirstAsync: ", e)
    }

    return res
}

export async function executeAsync(db, query) {
    try {
        await db.runAsync(query)
    } catch (e) {
        console.error("error in executeAsync: ", e)
    }
}
