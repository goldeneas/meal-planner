export async function getPantryItems(db) {
    return await queryAllAsync(db, `
                SELECT P.id, F.name, P.quantity, P.warningQuantity, P.expirationDate, P.note,
                       FC.description AS category, UOM.symbol AS unitOfMeasure
                FROM PantryProduct AS P
                JOIN Food AS F ON P.food = F.id
                LEFT JOIN FoodCategory AS FC ON F.category = FC.id
                LEFT JOIN UnitOfMeasure AS UOM ON P.unitOfMeasure = UOM.id
            `)
}

export async function updatePantryItem(db, id, pantry) {
    const params = [pantry.foodId, pantry.qty, pantry.warnQty,
    pantry.uomId, pantry.expDate, pantry.note, id]

    await executeAsync(db, `UPDATE PantryProduct SET food = ?, quantity = ?, warningQuantity = ?, unitOfMeasure = ?, expirationDate = ?, note = ? WHERE id = ?`, params)
}

export async function insertPantryItem(db, pantry) {
    const params = [pantry.foodId, pantry.qty, pantry.warnQty,
    pantry.uomId, pantry.expDate, pantry.note]

    await executeAsync(db, `INSERT INTO PantryProduct (food, quantity, warningQuantity, unitOfMeasure, expirationDate, note) VALUES (?, ?, ?, ?, ?, ?)`, params);
}

export async function deletePantryItem(db, id) {
    await executeAsync(db, `DELETE FROM PantryProduct WHERE id = ?`, [id]);
}
