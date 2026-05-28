import { executeAsync, queryAllAsync } from "./database"

export async function getIngredients(db) {
    return await queryAllAsync(db, "SELECT * FROM Ingredient");
}

export async function getIngredientById(db, id) {
    return await queryFirstAsync(db, "SELECT * FROM Ingredient WHERE id = ?", [id]);
}

export async function getIngredientUnitOfMeasureSymbolById(db, id) {
    const query = `
        SELECT UOM.symbol 
        FROM Ingredient AS I
        JOIN UnitOfMeasure AS UOM ON I.unitOfMeasure = UOM.id
        WHERE I.id = ?
    `;

    const row = await queryFirstAsync(db, query, [id]);
    return row?.symbol ?? null;
}

export async function updateIngredientById(db, id, ingredient) {
    const query = `
        UPDATE Ingredient SET
        quantity = ?,
        recipe = ?,
        unitOfMeasure = ?,
        food = ?
        WHERE id = ?
    `;

    const params = [
        ingredient.quantity,
        ingredient.recipe,
        ingredient.unitOfMeasure,
        ingredient.food,
        id
    ];

    await executeAsync(db, query, params);
}

export async function removeIngredientById(db, id) {
    await executeAsync(db, "DELETE FROM Ingredient WHERE id = ?", [id]);
}
