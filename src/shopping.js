import { executeAsync, queryAllAsync } from "./database";

export async function getShoppingItems(db) {
    return await queryAllAsync(db, "SELECT * FROM ShoppingItem");
}

export async function insertShoppingItem(db, item) {
    const query = `
        INSERT INTO ShoppingItem(name, quantity, food, purchaseDate, unitOfMeasure)
        VALUES (?, ?, ?, ?, ?)
    `;

    const params = [
        item.name,
        item.quantity,
        item.food,
        item.purchaseDate,
        item.unitOfMeasure
    ];

    await executeAsync(db, query, params);
}

export async function deleteShoppingItem(db, id) {
    await executeAsync(db, "DELETE FROM ShoppingItem WHERE id = ?", [id]);
}

export async function updateShoppingItemQuantity(db, id, quantity) {
    await executeAsync(db, "UPDATE ShoppingItem SET quantity = ? WHERE id = ?", [quantity, id]);
}

export async function setShoppingItemPurchased(db, id, purchased) {
    const isPurchased = typeof purchased === 'boolean' ? (purchased ? 1 : 0) : purchased;
    await executeAsync(db, "UPDATE ShoppingItem SET purchased = ? WHERE id = ?", [isPurchased, id]);
}
