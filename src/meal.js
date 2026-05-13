import { queryAsArray } from "./database";

export async function getMeals(db) {
    return await queryAsArray(db, "SELECT * FROM Meal")
}

export async function getMealByRecipe(db, recipeId) {
    return await queryAsArray(db, "SELECT * FROM Meal WHERE recipe = " + recipeId)
}

export async function getMealByDayOfWeek(db, dowId) {
    return await queryAsArray(db, "SELECT * FROM Meal WHERE dayOfWeek = " + dowId)
}

export async function insertMeal(db, meal) {
    await db.executeSql(`INSERT INTO Meal(recipe, dayOfWeek, timeSlot)
            VALUES(${meal.recipe}, ${meal.dayOfWeek}, ${meal.timeSlot})`)
}

export async function deleteMealByTimeSlot(db, timeSlotId) {
    await db.executeSql("DELETE FROM Meal WHERE timeSlot = " + timeSlotId)
}

export async function deleteMealById(db, id) {
    await db.executeSql("DELETE FROM Meal WHERE id = " + id)
}
