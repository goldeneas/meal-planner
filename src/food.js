import { executeAsync, queryAllAsync } from "./database";

export async function getFoodCategories(db) {
    return await queryAllAsync(db, "SELECT * FROM FoodCategory")
}

export async function getFoodCategoryById(db, id) {
    return await queryFirstAsync(db, "SELECT * FROM FoodCategory WHERE id = " + id)
}

export async function getFoods(db) {
    return await queryAllAsync(db, "SELECT * FROM Food")
}

export async function updateFoodById(db, id, food) {
    await executeAsync(db, `UPDATE Food SET
        name = '${food.name}',
        description = '${food.description}',
        category = ${food.category}
        WHERE id = ${id}`)
}

export async function removeFoodById(db, id) {
    await executeAsync(db, "DELETE FROM Food WHERE id = " + id)
}
