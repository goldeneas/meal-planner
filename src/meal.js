import { executeAsync, queryAllAsync, queryFirstAsync } from "./database";

export async function getMeals(db) {
    return await queryAllAsync(db, "SELECT * FROM Meal");
}

export async function getMealByRecipe(db, recipeId) {
    return await queryFirstAsync(db, "SELECT * FROM Meal WHERE recipe = ?", [recipeId]);
}

export async function getMealsByDayOfWeek(db, dowId) {
    return await queryAllAsync(db, "SELECT * FROM Meal WHERE dayOfWeek = ?", [dowId]);
}

export async function insertMeal(db, meal) {
    const query = `
        INSERT INTO Meal (recipe, dayOfWeek, timeSlot)
        VALUES (?, ?, ?)
    `;

    const params = [meal.recipe, meal.dayOfWeek, meal.timeSlot];
    await executeAsync(db, query, params);
}

export async function deleteMealByTimeSlotAndDay(db, timeSlotId, dayOfWeekId) {
    await executeAsync(
        db,
        "DELETE FROM Meal WHERE timeSlot = ? AND dayOfWeek = ?",
        [timeSlotId, dayOfWeekId]
    );
}
export async function deleteMealById(db, id) {
    await executeAsync(db, "DELETE FROM Meal WHERE id = ?", [id]);
}
