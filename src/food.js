import { executeAsync, queryAllAsync, queryFirstAsync } from "./database";

export async function getFoodCategories(db) {
    return await queryAllAsync(db, "SELECT * FROM FoodCategory");
}

export async function getFoodCategoryById(db, id) {
    return await queryFirstAsync(db, "SELECT * FROM FoodCategory WHERE id = ?", [id]);
}

export async function getFoods(db) {
    return await queryAllAsync(db, "SELECT * FROM Food");
}

export async function insertFood(db, food) {
    const params = [food.name, food.description, food.category]
    await executeAsync(db, "INSERT INTO Food(name, description, category) VALUES(?, ?, ?)", params)
}

export async function updateFoodById(db, id, food) {
    const query = `
        UPDATE Food SET
        name = ?,
        description = ?,
        category = ?
        WHERE id = ?
    `;

    const params = [
        food.name,
        food.description,
        food.category,
        id
    ];

    await executeAsync(db, query, params);
}

export async function removeFoodById(db, id) {
    await executeAsync(db, "DELETE FROM Food WHERE id = ?", [id]);
}
