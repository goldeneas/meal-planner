import { View, StyleSheet } from "react-native";
import StatTextHeader from "../components/StatTextHeader";
import StatCounter from "../components/StatCounter";
import StatPieChart from "../components/StatPieChart";
import StatNextMeal from "../components/StatNextMeal";

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

export const StatScreen = ({ navigation }) => {
    const series = [
        { value: 430, label: 'Pomodoro' },
        { value: 321, label: 'Cipolla rossa di Tropea' },
        { value: 185, label: 'Tartufo nero' },
        { value: 123, label: 'Cipolla ramata di Montoro' },
    ]

    return (
        <View>
            <View style={styles.grid}>
                <StatTextHeader text={"Panoramica"} />
                {['Pasti Pianificati',
                    'Ingredienti Comprati',
                    'Ricette in Archivio',
                    'Prodotti in Scadenza',
                    'Prodotti Mancanti',
                    'Tempo Medio di Preparazione']
                    .map((label, index) => (
                        <StatCounter key={index} counter={index} label={label} />
                    ))}
                <StatTextHeader text={"Ingredienti Più Usati"} />
                <StatPieChart widthAndHeight={250} series={series} />
                <StatTextHeader text={"Prossimi Pasti"} />
                <StatNextMeal date={"2026-05-04"} mealCategory={"Pranzo"} mealName={"Pasta al pomodoro"} />
            </View>
        </View>
    );
};
