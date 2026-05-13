import { queryAsArray } from "./database";

export async function getFoodCategories(db) {
    return await queryAsArray(db, "SELECT * FROM FoodCategory")
}

export async function getFoodCategoryById(db, id) {
    return await queryAsArray(db, "SELECT * FROM FoodCategory WHERE id = " + id)
}

export async function getFoods(db) {
    return await queryAsArray(db, "SELECT * FROM Food")
}

export async function updateFoodById(db, id, food) {
    await db.executeSql(`UPDATE Food SET
        name = ${food.name}
        description = ${food.description}
        category = ${food.category}
        WHERE id = ${id}`)
}

export async function removeFoodById(db, id) {
    await db.executeSql("DELETE FROM Food WHERE id = " + id)
}
