import { queryAllAsync } from "./database";

export async function getShoppingItems(db) {
    return await queryAllAsync(db, "SELECT * FROM ShoppingItem")
}

export async function insertShoppingItem(db, item) {
    await executeAsync(db, `INSERT INTO ShoppingItem(name, quantity, food, purchaseDate, unitOfMeasure)
        VALUES ('${item.name}', ${item.quantity}, ${item.food}, '${item.purchaseDate}', ${item.unitOfMeasure})`)
}

export async function deleteShoppingItem(db, id) {
    await executeAsync(db, "DELETE FROM ShoppingItem WHERE id = " + id)
}

export async function updateShoppingItemQuantity(db, id, quantity) {
    await executeAsync(db, `UPDATE ShoppingItem SET quantity = ${quantity} WHERE id = ${id}`)
}

export async function setShoppingItemPurchased(db, id, purchased) {
    await executeAsync(db, `UPDATE ShoppingItem SET purchased = ${purchased} WHERE id = ${id}`)
}
