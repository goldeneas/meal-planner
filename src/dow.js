import { queryAllAsync as queryAllAsync } from "./database";

export async function getDaysOfWeek(db) {
    return await queryAllAsync(db, "SELECT * FROM DayOfWeek")
}
