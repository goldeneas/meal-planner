import { View, StyleSheet, ScrollView } from "react-native";
import StatTextHeader from "../components/StatTextHeader";
import StatCounter from "../components/StatCounter";
import StatPieChart from "../components/StatPieChart";
import StatBarChart from "../components/StatBarChart";

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
        <ScrollView>
            <View style={styles.grid}>
                <StatTextHeader text={"Panoramica"} />
                {['Ricette Salvate',
                    'Pasti Pianificati',
                    'Prodotti in Scadenza',
                    'Prodotti Scaduti',
                    'Prodotti Mancanti',
                    '  Tempo Medio \ndi Preparazione']
                    .map((label, index) => (
                        <StatCounter key={index} counter={index} label={label} />
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
