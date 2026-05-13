import { queryAsArray } from "./database";

export async function getUnitsOfMeasure(db) {
    return await queryAsArray(db, "SELECT * FROM UnitOfMeasure");
}

export async function getUnitOfMeasureSymbolById(db, id) {
    return await queryAsArray(db, "SELECT symbol FROM UnitOfMeasure WHERE id = " + id)
}
