import { queryAsArray } from "./database";

export async function getRecipeCategories(db) {
    return await queryAsArray(db, "SELECT * FROM RecipeCategory")
}

export async function getRecipeDifficulties(db) {
    return await queryAsArray(db, "SELECT * FROM RecipeDifficulty")
}

export async function getRecipes(db) {
    return await queryAsArray(db, "SELECT * FROM Recipe")
}

export async function getRecipeIngredientsById(db, id) {
    return await queryAsArray(db, "SELECT I.id FROM Recipe AS R\
            JOIN Ingredient AS I ON (R.id = I.recipe)\
            WHERE R.id = " + id)
}

export async function getRecipeDifficultyById(db, id) {
    return await queryAsArray(db, "SELECT RD.description FROM Recipe AS R\
            JOIN RecipeDifficulty AS RD ON (R.difficulty = RD.id)\
            WHERE R.id = " + id)
}

export async function getRecipeCategoryById(db, id) {
    return await queryAsArray(db, "SELECT RC.description FROM Recipe AS R\
            JOIN RecipeCategory AS RC ON (R.category = RC.id)\
            WHERE R.id = " + id)
}
