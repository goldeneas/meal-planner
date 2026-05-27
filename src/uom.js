import { queryAllAsync, queryFirstAsync } from "./database";

export async function getUnitsOfMeasure(db) {
    return await queryAllAsync(db, "SELECT * FROM UnitOfMeasure");
}

export async function getUnitOfMeasureIdBySymbol(db, symbol) {
    return await queryFirstAsync(db, "SELECT id FROM UnitOfMeasure WHERE symbol = " + symbol).id
}

export async function getUnitOfMeasureSymbolById(db, id) {
    return await queryFirstAsync(db, "SELECT symbol FROM UnitOfMeasure WHERE id = " + id).symbol
}

export async function getUnitOfMeasureSymbols(db) {
    const rows = await queryAllAsync(db, "SELECT symbol FROM UnitOfMeasure")

    let symbols = []
    for (const row of rows) {
        symbols.push(row.symbol)
    }

    return symbols
}
