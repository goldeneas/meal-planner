import { executeAsync, queryAllAsync } from "./database";

export async function getMeals(db) {
    return await queryAllAsync(db, "SELECT * FROM Meal")
}

export async function getMealByRecipe(db, recipeId) {
    return await queryFirstAsync(db, "SELECT * FROM Meal WHERE recipe = " + recipeId)
}

export async function getMealsByDayOfWeek(db, dowId) {
    return await queryAllAsync(db, "SELECT * FROM Meal WHERE dayOfWeek = " + dowId)
}

export async function insertMeal(db, meal) {
    await executeAsync(db, `INSERT INTO Meal(recipe, dayOfWeek, timeSlot)
            VALUES(${meal.recipe}, ${meal.dayOfWeek}, ${meal.timeSlot})`)
}

export async function deleteMealByTimeSlot(db, timeSlotId) {
    await executeAsync(db, "DELETE FROM Meal WHERE timeSlot = " + timeSlotId)
}

export async function deleteMealById(db, id) {
    await executeAsync(db, "DELETE FROM Meal WHERE id = " + id)
}
