import { queryAsArray } from "./database";

export async function getTimeSlots(db) {
    return await queryAsArray(db, "SELECT * FROM TimeSlot")
}

export async function getTimeSlotNameById(db, id) {
    return await queryAsArray(db, "SELECT name FROM TimeSlot WHERE id = " + id)
}
