export async function insertDefaultValues(db) {
    try {
        await db.execAsync(`
            INSERT OR IGNORE INTO UnitOfMeasure (id, symbol) VALUES 
            (1, 'g'), 
            (2, 'ml'),
            (3, 'pz');

            INSERT OR IGNORE INTO DayOfWeek (id, name) VALUES 
            (1, 'Lunedì'),
            (2, 'Martedì'),
            (3, 'Mercoledì'),
            (4, 'Giovedì'),
            (5, 'Venerdì'),
            (6, 'Sabato'),
            (7, 'Domenica');

            INSERT OR IGNORE INTO TimeSlot (id, name) VALUES 
            (1, 'Colazione'),
            (2, 'Merenda'),
            (3, 'Pranzo'),
            (4, 'Spuntino'),
            (5, 'Cena');

            INSERT OR IGNORE INTO RecipeDifficulty (id, description) VALUES 
            (1, 'Facile'),
            (2, 'Media'),
            (3, 'Difficile');

            INSERT OR IGNORE INTO RecipeCategory (id, description) VALUES 
            (1, 'Primo Piatto'),
            (2, 'Secondo Piatto'),
            (3, 'Contorno'),
            (4, 'Dolce'),
            (5, 'Antipasto');

            INSERT OR IGNORE INTO FoodCategory (id, description) VALUES 
            (1, 'Verdura'),
            (2, 'Frutta'),
            (3, 'Carne'),
            (4, 'Pesce'),
            (5, 'Latticini'),
            (6, 'Cereali'),
            (7, 'Spezie'),
            (8, 'Altro');
        `);

        console.log("[DB] default inseriti");
    } catch (error) {
        console.error("[DB] errore default:", error);
    }
}
