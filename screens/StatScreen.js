import { View, StyleSheet, ScrollView } from "react-native";
import StatTextHeader from "../components/StatTextHeader";
import StatCounter from "../components/StatCounter";
import StatPieChart from "../components/StatPieChart";
import StatBarChart from "../components/StatBarChart";
import { countAvgRecipePrepTime, countExpiredProducts, countExpiringProducts, countMissingFood, countPlannedMeals, countSavedRecipes, getMostMealByCategory, getMostUsedIngredients, mostMealByCategory, mostRecipesByCategory, mostUsedIngredients } from "../src/stats";
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
            ] = await Promise.all([
                countSavedRecipes(db),
                countPlannedMeals(db),
                countExpiringProducts(db),
                countExpiredProducts(db),
                countMissingFood(db),
                countAvgRecipePrepTime(db),
            ]);

            setCounters([
                { label: 'Ricette Salvate', value: savedRecipesCount },
                { label: 'Pasti Pianificati', value: plannedMealsCount },
                { label: 'Prodotti in Scadenza', value: expiringProductsCount },
                { label: 'Prodotti Scaduti', value: expiredProductsCount },
                { label: 'Prodotti Mancanti', value: missingFoodCount },
                { label: 'Tempo Medio\ndi Preparazione', value: avgRecipePrepTimeMinutes },
            ]);
        }

        loadStats();
    }, [db]);

    const series = [
        { value: 430, label: 'Pomodoro' },
        { value: 321, label: 'Cipolla rossa di Tropea' },
        { value: 185, label: 'Tartufo nero' },
        { value: 123, label: 'Cipolla ramata di Montoro' },
    ]

    return (
        <ScrollView>
            <View style={styles.grid}>
                <StatTextHeader text={"Panoramica"} />
                {counters.map((entry, index) => (
                    <StatCounter key={index} counter={entry.value} label={entry.label} />
                ))}
                <StatTextHeader text={"Ingredienti Più Usati"} />
                <StatBarChart series={series} />
                <StatTextHeader text={"Categorie di Pasti Frequenti"} />
                <StatPieChart widthAndHeight={250} series={series} />
                <StatTextHeader text={"Ricette per Categoria"} />
                <StatPieChart widthAndHeight={250} series={series} />
            </View>
        </ScrollView>
    );
};
