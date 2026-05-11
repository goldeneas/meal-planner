export async function countPlannedMeals(db) {
    return await db.executeSql("SELECT COUNT(*) FROM Meal")
}

export async function countSavedRecipes(db) {
    return await db.executeSql("SELECT COUNT(*) FROM Recipe")
}

export async function countExpiringProducts(db) {
    return await db.executeSql("SELECT COUNT(*) FROM PantryProduct\
WHERE expirationDate BETWEEN datetime('now') AND datetime('now', '+3 days')")
}

export async function countExpiredProducts(db) {
    return await db.executeSql("SELECT COUNT(*) FROM PantryProduct\
        WHERE expirationDate <= datetime('now', '+3 days')")
}

export async function countMissingFood(db) {
    return await db.executeSql("SELECT DISTINCT food FROM Ingredient AS I\
    WHERE\
        (SELECT COALESCE(SUM(quantity), 0) FROM Ingredient WHERE unitOfMeasure = I.unitOfMeasure AND food = I.food)\
        <\
        (SELECT COALESCE(SUM(quantity), 0) FROM PantryProduct WHERE unitOfMeasure = I.unitOfMeasure AND food = I.food)")
}

export async function countAvgRecipePrepTime(db) {
    return await db.executeSql("SELECT AVG(preparationTimeMinutes) FROM Recipe")
}

export async function mostUsedIngredients(db) {
    return await db.executeSql("SELECT F.name, COUNT(I.id) FROM Ingredient AS I\
        JOIN Food AS F ON (I.food = F.id)\
        GROUP BY F.id\
        ORDER BY COUNT(id) DESC\
        LIMIT 5\
    ")
}

export async function mostMealByCategory(db) {
    return await db.executeSql("SELECT RC.description, COUNT(M.id) FROM Meal AS M\
        JOIN Recipe AS R ON (R.id = M.recipe)\
        JOIN RecipeCategory AS RC ON (R.category = RC.id)\
        GROUP BY R.category\
        ORDER BY COUNT(M.id) DESC\
        LIMIT 5\
        ")
}

export async function mostRecipesByCategory(db) {
    return await db.executeSql("SELECT RC.description, COUNT(R.id) FROM Recipe AS R\
        JOIN RecipeCategory AS RC ON (R.id = RC.id)\
        GROUP BY R.category\
        ORDER BY COUNT(R.id) DESC\
        LIMIT 5\
        ")
}
