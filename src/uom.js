import { queryAllAsync, queryFirstAsync } from "./database";

export async function getUnitsOfMeasure(db) {
    return await queryAllAsync(db, "SELECT * FROM UnitOfMeasure");
}

export async function getUnitOfMeasureIdBySymbol(db, symbol) {
    const res = await queryFirstAsync(db, "SELECT id FROM UnitOfMeasure WHERE symbol = ?", [symbol])
    return res.id
}

export async function getUnitOfMeasureSymbolById(db, id) {
    const res = await queryFirstAsync(db, "SELECT symbol FROM UnitOfMeasure WHERE id = ?", [id])
    return res.symbol
}

export async function getUnitOfMeasureSymbols(db) {
    const rows = await queryAllAsync(db, "SELECT symbol FROM UnitOfMeasure")

    let symbols = []
    for (const row of rows) {
        symbols.push(row.symbol)
    }

    return symbols
}
