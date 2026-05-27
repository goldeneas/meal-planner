export async function insertDefaultValues(db) {
    try {
        // Funzione helper per inserire solo se la tabella è vuota
        const insertIfEmpty = async (table, values) => {
            const results = await db.executeSql(`SELECT COUNT(*) as count FROM ${table}`);
            if (results[0].rows.item(0).count === 0) {
                for (const sql of values) {
                    await db.executeSql(sql);
                }
                console.log(`[DB] Inseriti valori di default per ${table}`);
            }
        };

        // Unità di Misura
        await insertIfEmpty('UnitOfMeasure', [
            "INSERT INTO UnitOfMeasure (id, symbol) VALUES (1, 'g')",
            "INSERT INTO UnitOfMeasure (id, symbol) VALUES (2, 'ml')",
        ]);

        // Giorni della Settimana
        await insertIfEmpty('DayOfWeek', [
            "INSERT INTO DayOfWeek (id, name) VALUES (1, 'Lunedì')",
            "INSERT INTO DayOfWeek (id, name) VALUES (2, 'Martedì')",
            "INSERT INTO DayOfWeek (id, name) VALUES (3, 'Mercoledì')",
            "INSERT INTO DayOfWeek (id, name) VALUES (4, 'Giovedì')",
            "INSERT INTO DayOfWeek (id, name) VALUES (5, 'Venerdì')",
            "INSERT INTO DayOfWeek (id, name) VALUES (6, 'Sabato')",
            "INSERT INTO DayOfWeek (id, name) VALUES (7, 'Domenica')"
        ]);

        // Fasce Orarie / Pasti
        await insertIfEmpty('TimeSlot', [
            "INSERT INTO TimeSlot (id, name) VALUES (1, 'Colazione')",
            "INSERT INTO TimeSlot (id, name) VALUES (2, 'Merenda')",
            "INSERT INTO TimeSlot (id, name) VALUES (3, 'Pranzo')",
            "INSERT INTO TimeSlot (id, name) VALUES (4, 'Spuntino')",
            "INSERT INTO TimeSlot (id, name) VALUES (5, 'Cena')",
        ]);

        // Difficoltà Ricetta
        await insertIfEmpty('RecipeDifficulty', [
            "INSERT INTO RecipeDifficulty (id, description) VALUES (1, 'Facile')",
            "INSERT INTO RecipeDifficulty (id, description) VALUES (2, 'Media')",
            "INSERT INTO RecipeDifficulty (id, description) VALUES (3, 'Difficile')"
        ]);

        // Categorie Ricetta
        await insertIfEmpty('RecipeCategory', [
            "INSERT INTO RecipeCategory (id, description) VALUES (1, 'Primo Piatto')",
            "INSERT INTO RecipeCategory (id, description) VALUES (2, 'Secondo Piatto')",
            "INSERT INTO RecipeCategory (id, description) VALUES (3, 'Contorno')",
            "INSERT INTO RecipeCategory (id, description) VALUES (4, 'Dolce')",
            "INSERT INTO RecipeCategory (id, description) VALUES (5, 'Antipasto')"
        ]);

        // Categorie Cibo
        await insertIfEmpty('FoodCategory', [
            "INSERT INTO FoodCategory (id, description) VALUES (1, 'Verdura')",
            "INSERT INTO FoodCategory (id, description) VALUES (2, 'Frutta')",
            "INSERT INTO FoodCategory (id, description) VALUES (3, 'Carne')",
            "INSERT INTO FoodCategory (id, description) VALUES (4, 'Pesce')",
            "INSERT INTO FoodCategory (id, description) VALUES (5, 'Latticini')",
            "INSERT INTO FoodCategory (id, description) VALUES (6, 'Cereali')",
            "INSERT INTO FoodCategory (id, description) VALUES (7, 'Spezie')",
            "INSERT INTO FoodCategory (id, description) VALUES (8, 'Altro')"
        ]);

    } catch (error) {
        console.error("[DB] Erore durante l'inserimento dei default:", error);
    }
}
