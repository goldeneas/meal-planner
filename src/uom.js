import { queryAllAsync } from "./database";

export async function getUnitsOfMeasure(db) {
    return await queryAllAsync(db, "SELECT * FROM UnitOfMeasure");
}

export async function getUnitOfMeasureSymbolById(db, id) {
    return await queryFirstAsync(db, "SELECT symbol FROM UnitOfMeasure WHERE id = " + id)
}
