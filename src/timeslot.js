import { queryAllAsync } from "./database";

export async function getTimeSlots(db) {
    return await queryAllAsync(db, "SELECT * FROM TimeSlot")
}

export async function getTimeSlotNameById(db, id) {
    return await queryFirstAsync(db, "SELECT name FROM TimeSlot WHERE id = ?", [id])
}
