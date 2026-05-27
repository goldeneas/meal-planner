-- Unit Of Measure (Unità di Misura)
INSERT INTO UnitOfMeasure (id, symbol) VALUES (1, 'g');
INSERT INTO UnitOfMeasure (id, symbol) VALUES (2, 'kg');
INSERT INTO UnitOfMeasure (id, symbol) VALUES (3, 'ml');
INSERT INTO UnitOfMeasure (id, symbol) VALUES (4, 'l');
INSERT INTO UnitOfMeasure (id, symbol) VALUES (5, 'cucchiaino');
INSERT INTO UnitOfMeasure (id, symbol) VALUES (6, 'cucchiaio');
INSERT INTO UnitOfMeasure (id, symbol) VALUES (7, 'pezzo');

-- Day Of Week (Giorni della Settimana)
INSERT INTO DayOfWeek (id, name) VALUES (1, 'Lunedì');
INSERT INTO DayOfWeek (id, name) VALUES (2, 'Martedì');
INSERT INTO DayOfWeek (id, name) VALUES (3, 'Mercoledì');
INSERT INTO DayOfWeek (id, name) VALUES (4, 'Giovedì');
INSERT INTO DayOfWeek (id, name) VALUES (5, 'Venerdì');
INSERT INTO DayOfWeek (id, name) VALUES (6, 'Sabato');
INSERT INTO DayOfWeek (id, name) VALUES (7, 'Domenica');

-- Time Slot (Pasti della Giornata)
INSERT INTO TimeSlot (id, name) VALUES (1, 'Colazione');
INSERT INTO TimeSlot (id, name) VALUES (2, 'Pranzo');
INSERT INTO TimeSlot (id, name) VALUES (3, 'Cena');
INSERT INTO TimeSlot (id, name) VALUES (4, 'Spuntino');

-- Recipe Difficulty (Difficoltà Ricetta)
INSERT INTO RecipeDifficulty (id, description) VALUES (1, 'Facile');
INSERT INTO RecipeDifficulty (id, description) VALUES (2, 'Media');
INSERT INTO RecipeDifficulty (id, description) VALUES (3, 'Difficile');

-- Recipe Category (Categoria Ricetta)
INSERT INTO RecipeCategory (id, description) VALUES (1, 'Primo Piatto');
INSERT INTO RecipeCategory (id, description) VALUES (2, 'Secondo Piatto');
INSERT INTO RecipeCategory (id, description) VALUES (3, 'Contorno');
INSERT INTO RecipeCategory (id, description) VALUES (4, 'Dolce');
INSERT INTO RecipeCategory (id, description) VALUES (5, 'Antipasto');

-- Food Category (Categoria Cibo)
INSERT INTO FoodCategory (id, description) VALUES (1, 'Verdura');
INSERT INTO FoodCategory (id, description) VALUES (2, 'Frutta');
INSERT INTO FoodCategory (id, description) VALUES (3, 'Carne');
INSERT INTO FoodCategory (id, description) VALUES (4, 'Pesce');
INSERT INTO FoodCategory (id, description) VALUES (5, 'Latticini');
INSERT INTO FoodCategory (id, description) VALUES (6, 'Cereali');
INSERT INTO FoodCategory (id, description) VALUES (7, 'Spezie');
INSERT INTO FoodCategory (id, description) VALUES (8, 'Altro');
