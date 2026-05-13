import { queryAsArray } from "./database";

export async function getDaysOfWeek(db) {
    return await queryAsArray(db, "SELECT * FROM DayOfWeek")
}
