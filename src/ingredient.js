import { executeAsync, queryAllAsync } from "./database"

export async function getIngredients(db) {
    return await queryAllAsync(db, "SELECT * FROM Ingredient")
}

export async function getIngredientById(db, id) {
    return await queryFirstAsync(db, "SELECT * FROM Ingredient WHERE id = " + id)
}

export async function getIngredientUnitOfMeasureSymbolById(db, id) {
    return await queryFirstAsync(db, "SELECT UOM.symbol FROM Ingredient AS I\
            JOIN UnitOfMeasure AS UOM ON (I.unitOfMeasure = UOM.id)\
            WHERE I.id = " + id)
}

export async function updateIngredientById(db, id, ingredient) {
    await executeAsync(db, `UPDATE Ingredient SET
        quantity = ${ingredient.quantity},
        recipe = ${ingredient.recipe},
        unitOfMeasure = ${ingredient.unitOfMeasure},
        food = ${ingredient.food}
        WHERE id = ${id}`)
}

export async function removeIngredientById(db, id) {
    await executeAsync(db, "DELETE FROM Ingredient WHERE id = " + id)
}
