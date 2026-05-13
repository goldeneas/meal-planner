import { queryAsArray } from "./database";

export async function getShoppingItems(db) {
    return await queryAsArray(db, "SELECT * FROM ShoppingItem")
}

export async function insertShoppingItem(db, item) {
    await db.executeSql(`INSERT INTO ShoppingItem(name, quantity, food, purchaseDate, unitOfMeasure)
        VALUES ('${item.name}', ${item.quantity}, ${item.food}, '${item.purchaseDate}', ${item.unitOfMeasure})`)
}

export async function deleteShoppingItem(db, id) {
    await db.executeSql("DELETE FROM ShoppingItem WHERE id = " + id)
}

export async function updateShoppingItemQuantity(db, id, quantity) {
    await db.executeSql(`UPDATE ShoppingItem SET quantity = ${quantity} WHERE id = ${id}`)
}

export async function setShoppingItemPurchased(db, id, purchased) {
    await db.executeSql(`UPDATE ShoppingItem SET purchased = ${purchased} WHERE id = ${id}`)
}
