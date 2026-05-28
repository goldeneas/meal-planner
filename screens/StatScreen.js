import { View, StyleSheet, ScrollView, Text } from "react-native";
import StatTextHeader from "../components/StatTextHeader";
import StatCounter from "../components/StatCounter";
import StatPieChart from "../components/StatPieChart";
import StatBarChart from "../components/StatBarChart";
import { countAvgRecipePrepTime, countExpiredProducts, countExpiringProducts, countMissingFood, countPlannedMeals, countSavedRecipes, getMostMealsByCategory, getMostRecipesByCategory, getMostUsedIngredients } from "../src/stats";
import { useState, useEffect } from "react";

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        padding: 8,
        justifyContent: "center"
    },
    button: {
        width: '48%',
        height: 80,
        backgroundColor: '#4A90E2',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export const StatScreen = ({ navigation, db }) => {
    const [counters, setCounters] = useState([]);
    const [mostMealsByCategory, setMostMealsByCategory] = useState([]);
    const [mostRecipesByCategory, setMostRecipesByCategory] = useState([]);
    const [mostUsedIngredients, setMostUsedIngredients] = useState([]);

    // carica
    useEffect(() => {
        async function loadStats() {
            const [
                savedRecipesCount,
                plannedMealsCount,
                expiringProductsCount,
                expiredProductsCount,
                missingFoodCount,
                avgRecipePrepTimeMinutes,
                mui,
                mmbc,
                mrbc
            ] = await Promise.all([
                countSavedRecipes(db),
                countPlannedMeals(db),
                countExpiringProducts(db),
                countExpiredProducts(db),
                countMissingFood(db),
                countAvgRecipePrepTime(db),
                getMostUsedIngredients(db),
                getMostMealsByCategory(db),
                getMostRecipesByCategory(db)
            ]);

            setMostUsedIngredients(mui)
            setMostMealsByCategory(mmbc)
            setMostRecipesByCategory(mrbc)

            setCounters([
                { label: 'Ricette Salvate', value: savedRecipesCount.count },
                { label: 'Pasti Pianificati', value: plannedMealsCount.count },
                { label: 'Prodotti in Scadenza', value: expiringProductsCount.count },
                { label: 'Prodotti Scaduti', value: expiredProductsCount.count },
                { label: 'Prodotti Mancanti', value: missingFoodCount.count },
                { label: 'Tempo Medio\ndi Preparazione', value: avgRecipePrepTimeMinutes.count },
            ]);
        }

        loadStats();
    }, [db]);

    return (
        <ScrollView>
            <View style={styles.grid}>
                <StatTextHeader text={"Panoramica"} />
                {counters.map((entry, index) => (
                    <StatCounter key={index} counter={entry.value} label={entry.label} />
                ))}
                <StatTextHeader text={"Ingredienti Più Usati"} />
                <StatBarChart series={mostUsedIngredients} />
                <StatTextHeader text={"Categorie di Pasti Frequenti"} />
                <StatPieChart widthAndHeight={250} series={mostRecipesByCategory} />
                <StatTextHeader text={"Ricette per Categoria"} />
                <StatPieChart widthAndHeight={250} series={mostMealsByCategory} />
            </View>
        </ScrollView>
    );
};
