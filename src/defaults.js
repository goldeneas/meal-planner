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
            (5, 'Antipasto'),
            (6, 'Piatto Unico');

            INSERT OR IGNORE INTO FoodCategory (id, description) VALUES 
            (1, 'Verdura'),
            (2, 'Frutta'),
            (3, 'Carne'),
            (4, 'Pesce'),
            (5, 'Latticini'),
            (6, 'Cereali'),
            (7, 'Spezie'),
            (8, 'Altro'),
            (9, 'Uova'),
            (10, 'Legumi'),
            (11, 'Bevande');

            INSERT OR IGNORE INTO Food (id, name, description, category) VALUES
            (1, 'Pasta', 'Pasta di semola di grano duro', 6),
            (2, 'Pomodoro', 'Passata di pomodoro', 1),
            (3, 'Olio extravergine d''oliva', 'Olio extravergine d''oliva', 8),
            (4, 'Sale', 'Sale fino', 8),
            (5, 'Cipolla', 'Cipolla dorata', 1),
            (6, 'Aglio', 'Aglio bianco', 1),
            (7, 'Basilico', 'Basilico fresco', 7),
            (8, 'Uova', 'Uova fresche di gallina', 9),
            (9, 'Latte', 'Latte intero', 5),
            (10, 'Farina', 'Farina tipo 00', 6),
            (11, 'Zucchero', 'Zucchero semolato', 8),
            (12, 'Burro', 'Burro vaccino', 5),
            (13, 'Carne Macinata', 'Carne di manzo macinata', 3),
            (14, 'Riso', 'Riso Arborio', 6),
            (15, 'Mela', 'Mela Golden', 2),
            (16, 'Pollo', 'Petto di pollo', 3),
            (17, 'Patate', 'Patate a pasta gialla', 1),
            (18, 'Rosmarino', 'Rosmarino fresco', 7),
            (19, 'Zucchine', 'Zucchine verdi', 1),
            (20, 'Pancetta', 'Pancetta affumicata', 3),
            (21, 'Pecorino Romano', 'Formaggio pecorino grattugiato', 5),
            (22, 'Pepe Nero', 'Pepe nero in grani', 7),
            (23, 'Pane', 'Pane tipo filone', 6),
            (24, 'Tonno', 'Tonno sott''olio', 4),
            (25, 'Fagioli Cannellini', 'Fagioli cannellini in scatola', 10),
            (26, 'Prezzemolo', 'Prezzemolo fresco', 7),
            (27, 'Limone', 'Limone fresco', 2),
            (28, 'Lievito per dolci', 'Lievito in polvere', 8),
            (29, 'Yogurt Bianco', 'Yogurt bianco naturale', 5),
            (30, 'Miele', 'Miele millefiori', 8),
            (31, 'Noci', 'Gherigli di noci', 2),
            (32, 'Maiale', 'Arista di maiale', 3),
            (33, 'Salsiccia', 'Salsiccia di suino', 3),
            (34, 'Merluzzo', 'Filetto di merluzzo', 4),
            (35, 'Salmone', 'Filetto di salmone fresco', 4),
            (36, 'Banana', 'Banane Chiquita', 2),
            (37, 'Fragole', 'Fragole fresche', 2),
            (38, 'Melanzane', 'Melanzane nere', 1),
            (39, 'Peperoni', 'Peperoni gialli e rossi', 1),
            (40, 'Mozzarella', 'Mozzarella di bufala', 5),
            (41, 'Pesto', 'Pesto alla genovese', 8);

            INSERT OR IGNORE INTO Recipe (id, name, preparationTimeMinutes, numberOfServings, description, difficulty, category, note) VALUES
            (1, 'Pasta al Pomodoro', 20, 2, 'Tritare finemente la cipolla.\nIn una padella, scaldare l''olio e soffriggere la cipolla finché non diventa trasparente.\nAggiungere la passata di pomodoro e un pizzico di sale.\nLasciar cuocere a fuoco lento per circa 15 minuti.\nNel frattempo, cuocere la pasta in abbondante acqua salata.\nScolare la pasta al dente e saltarla in padella con il sugo.\nGuarnire con basilico fresco.', 1, 1, 'Aggiungere basilico fresco se disponibile.'),
            (2, 'Frittata Semplice', 15, 2, 'Rompere le uova in una ciotola.\nAggiungere un pizzico di sale e sbattere leggermente con una forchetta.\nScaldare un filo d''olio in una padella antiaderente.\nVersare le uova e cuocere a fuoco medio.\nQuando i bordi iniziano a staccarsi, girare la frittata con l''aiuto di un coperchio.\nCuocere per altri 2-3 minuti dall''altro lato.', 1, 2, 'Puoi aggiungere verdure a piacere.'),
            (3, 'Riso al Burro', 15, 1, 'Cuocere il riso in acqua bollente salata.\nScolare il riso al dente.\nRimettere il riso nella pentola calda e aggiungere il burro.\nMescolare finché il burro non si è sciolto completamente.\nServire subito.', 1, 1, 'Ottimo se si è di fretta.'),
            (4, 'Pasta alla Carbonara', 25, 2, 'Mettere a bollire l''acqua per la pasta.\nTagliare la pancetta a cubetti e rosolarla in padella senza olio finché non diventa croccante.\nIn una ciotola, mescolare i tuorli d''uovo con il pecorino grattugiato e abbondante pepe nero.\nCuocere la pasta e scolarla al dente, tenendo un po'' di acqua di cottura.\nVersare la pasta nella padella con la pancetta e mescolare.\nTogliere dal fuoco e aggiungere il composto di uova, mescolando velocemente per creare una crema.\nAggiungere acqua di cottura se necessario per la cremosità.', 2, 1, 'Non aggiungere l''uovo sul fuoco vivo per evitare l''effetto frittata.'),
            (5, 'Pollo al Forno con Patate', 60, 2, 'Pelare le patate e tagliarle a cubetti.\nDisporre il pollo e le patate in una teglia da forno.\nCondire con olio, sale, aglio e rosmarino.\nMescolare bene con le mani per distribuire il condimento.\nCuocere in forno statico a 200°C per circa 45-50 minuti.\nGirare a metà cottura per una doratura uniforme.', 2, 2, 'Utilizzare una teglia capiente per non sovrapporre gli ingredienti.'),
            (6, 'Insalata di Tonno e Fagioli', 10, 2, 'Scolare i fagioli cannellini e sciacquarli sotto acqua corrente.\nScolare il tonno dall''olio di conservazione e sminuzzarlo.\nAffettare finemente la cipolla.\nIn una ciotola, unire fagioli, tonno e cipolla.\nCondire con olio, sale, pepe e un po'' di prezzemolo tritato.\nMescolare delicatamente e servire.', 1, 6, 'Piatto freddo veloce e nutriente.'),
            (7, 'Zucchine Trifolate', 20, 2, 'Lavare le zucchine e tagliarle a rondelle sottili.\nIn una padella, scaldare l''olio con uno spicchio d''aglio.\nAggiungere le zucchine e cuocere a fuoco vivace per 10 minuti, mescolando spesso.\nSalare e pepare a fine cottura.\nSpolverare con prezzemolo fresco tritato.', 1, 3, 'Ottimo contorno per carne o pesce.'),
            (8, 'Torta di Mele Semplice', 60, 6, 'Sbucciare le mele e tagliarle a fettine.\nIn una ciotola, montare le uova con lo zucchero finché non diventano chiare.\nAggiungere il burro fuso tiepido e il latte, continuando a mescolare.\nIncorporare la farina setacciata e il lievito.\nVersare l''impasto in una tortiera imburrata e infarinata.\nDisporre le fettine di mela sulla superficie a raggiera.\nCuocere in forno a 180°C per circa 40-45 minuti.', 2, 4, 'Servire con una spolverata di zucchero a velo.'),
            (9, 'Yogurt con Miele e Noci', 5, 1, 'Versare lo yogurt in una ciotolina.\nAggiungere un cucchiaio di miele.\nTritare grossolanamente le noci e cospargerle sopra lo yogurt.\nMescolare leggermente prima di consumare.', 1, 4, 'Perfetto per colazione o spuntino.'),
            (10, 'Pane e Pomodoro', 5, 1, 'Tagliare il pane a fette e tostarlo leggermente.\nStrofinare uno spicchio d''aglio sulle fette di pane (opzionale).\nTagliare i pomodori a cubetti o strofinarli direttamente sul pane.\nCondire con un filo d''olio, sale e basilico fresco.', 1, 5, 'La merenda tradizionale italiana.'),
            (11, 'Salmone al Forno', 25, 2, 'Adagiare i filetti di salmone su una teglia.\nCondire con olio, sale e un po'' di succo di limone.\nCuocere in forno a 180°C per circa 15-20 minuti.\nServire caldo.', 1, 2, 'Semplice e salutare.'),
            (12, 'Pasta al Pesto', 15, 2, 'Cuocere la pasta in acqua bollente salata.\nIn una ciotola, diluire il pesto con un cucchiaio di acqua di cottura.\nScolare la pasta e mescolarla con il pesto.\nServire subito.', 1, 1, 'Il salvacena perfetto.'),
            (13, 'Polpette al Sugo', 45, 4, 'In una ciotola, mescolare carne macinata, uovo, sale e un po'' di pane ammollato.\nFormare delle palline con le mani.\nIn una padella, scaldare un po'' di sugo di pomodoro.\nAggiungere le polpette e cuocere a fuoco lento per 30 minuti.\nGirare delicatamente a metà cottura.', 2, 2, 'Piatto amato da grandi e piccini.');

            INSERT OR IGNORE INTO Ingredient (id, quantity, recipe, unitOfMeasure, food) VALUES
            (1, 160, 1, 1, 1),
            (2, 200, 1, 2, 2),
            (3, 15, 1, 2, 3),
            (4, 2, 1, 1, 4),
            (5, 4, 2, 3, 8),
            (6, 2, 2, 1, 4),
            (7, 10, 2, 1, 12),
            (8, 80, 3, 1, 14),
            (9, 10, 3, 1, 12),
            (10, 160, 4, 1, 1),
            (11, 100, 4, 1, 20),
            (12, 3, 4, 3, 8),
            (13, 40, 4, 1, 21),
            (14, 1, 4, 1, 22),
            (15, 300, 5, 1, 16),
            (16, 400, 5, 1, 17),
            (17, 30, 5, 2, 3),
            (18, 2, 5, 1, 4),
            (19, 1, 5, 3, 18),
            (20, 160, 6, 1, 24),
            (21, 240, 6, 1, 25),
            (22, 0.5, 6, 3, 5),
            (23, 15, 6, 2, 3),
            (24, 400, 7, 1, 19),
            (25, 30, 7, 2, 3),
            (26, 1, 7, 3, 6),
            (27, 3, 8, 3, 15),
            (28, 200, 8, 1, 10),
            (29, 150, 8, 1, 11),
            (30, 3, 8, 3, 8),
            (31, 100, 8, 2, 9),
            (32, 80, 8, 1, 12),
            (33, 1, 8, 3, 28),
            (34, 150, 9, 1, 29),
            (35, 15, 9, 2, 30),
            (36, 20, 9, 1, 31),
            (37, 100, 10, 1, 23),
            (38, 1, 10, 3, 2),
            (39, 15, 10, 2, 3),
            (40, 2, 10, 1, 4),
            (41, 300, 11, 1, 35),
            (42, 10, 11, 2, 3),
            (43, 2, 11, 1, 4),
            (44, 10, 11, 2, 27),
            (45, 160, 12, 1, 1),
            (46, 80, 12, 1, 41),
            (47, 400, 13, 1, 13),
            (48, 1, 13, 3, 8),
            (49, 300, 13, 2, 2),
            (50, 2, 13, 1, 4);

            INSERT OR IGNORE INTO Meal (id, recipe, dayOfWeek, timeSlot) VALUES
            (1, 1, 1, 3),
            (2, 2, 2, 5),
            (3, 3, 3, 3),
            (4, 4, 1, 5),
            (5, 5, 2, 3),
            (6, 6, 3, 5),
            (7, 7, 4, 3),
            (8, 11, 4, 5),
            (9, 12, 5, 3),
            (10, 13, 5, 5),
            (11, 1, 6, 3),
            (12, 2, 6, 5),
            (13, 3, 7, 3),
            (14, 5, 7, 5);

            INSERT OR IGNORE INTO PantryProduct (id, expirationDate, quantity, warningQuantity, unitOfMeasure, food, note) VALUES
            (1, '2026-12-31', 500, 100, 1, 1, 'Pasta di riserva'),
            (2, '2026-07-15', 3000, 1000, 1, 11, 'Zucchero scorta'),
            (3, '2026-06-20', 1000, 200, 2, 3, 'Olio aperto'),
            (4, '2026-06-02', 4, 2, 3, 8, 'Uova fresche'),
            (5, '2026-05-25', 200, 50, 2, 9, 'Latte aperto'),
            (6, '2026-06-10', 500, 100, 1, 13, 'Carne per polpette'),
            (7, '2026-06-15', 200, 50, 1, 41, 'Pesto fresco'),
            (8, '2026-06-05', 250, 50, 1, 40, 'Mozzarella fresca'),
            (9, '2026-06-03', 5, 2, 3, 36, 'Banane mature'),
            (10, '2027-12-31', 100, 200, 1, 24, 'Tonno in scatola quasi finito'),
            (11, '2026-06-02', 1, 2, 3, 29, 'Ultimo yogurt in scadenza');

            INSERT OR IGNORE INTO ShoppingItem (id, name, quantity, purchaseDate, unitOfMeasure, purchased) VALUES
            (1, 'Pane fresco', 2, '2026-06-01', 3, 0);
        `);

        console.log("[DB] default inseriti");
    } catch (error) {
        console.error("[DB] errore default:", error);
    }
}
