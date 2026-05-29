import { executeAsync, queryAllAsync, queryFirstAsync } from "./database";

export async function getRecipeCategories(db) {
    return await queryAllAsync(db, "SELECT * FROM RecipeCategory")
}

export async function getRecipeDifficulties(db) {
    return await queryAllAsync(db, "SELECT * FROM RecipeDifficulty")
}

export async function getRecipes(db) {
    return await queryAllAsync(db, "SELECT * FROM Recipe")
}

export async function getRecipeIngredientsById(db, id) {
    return await queryAllAsync(db, `SELECT I.id FROM Recipe AS R
            JOIN Ingredient AS I ON (R.id = I.recipe)
            WHERE R.id = ?`, [id])
}

export async function getRecipeDifficultyById(db, id) {
    return await queryFirstAsync(db, `SELECT RD.description FROM Recipe AS R
            JOIN RecipeDifficulty AS RD ON (R.difficulty = RD.id)
            WHERE R.id = ?`, [id])
}

export async function getRecipeCategoryById(db, id) {
    return await queryFirstAsync(db, `SELECT RC.description FROM Recipe AS R
            JOIN RecipeCategory AS RC ON (R.category = RC.id)
            WHERE R.id = ?`, [id])
}

export async function insertRecipe(db, recipe) {
    const params = [recipe.name, recipe.preparationTimeMinutes, recipe.numberOfServings,
    recipe.description, recipe.difficulty, recipe.category, recipe.note]
    await executeAsync(db, `INSERT INTO Recipe(
            name, preparationTimeMinutes, numberOfServings,
            description, difficulty, category, note)
        VALUES (?, ?, ?, ?, ?, ?, ?)`, params)
}

export async function updateRecipeById(db, id, recipe) {
    const params = [
        recipe.name,
        recipe.preparationTimeMinutes,
        recipe.numberOfServings,
        recipe.description,
        recipe.difficulty,
        recipe.category,
        recipe.note,
        id
    ];

    await executeAsync(db, `
        UPDATE Recipe
        SET 
            name = ?, 
            preparationTimeMinutes = ?, 
            numberOfServings = ?,
            description = ?, 
            difficulty = ?, 
            category = ?, 
            note = ?
        WHERE id = ?`, params);
}

export async function deleteRecipeById(db, id) {
    await executeAsync(db, `DELETE FROM Recipe WHERE id = ?`, [id]);
}
