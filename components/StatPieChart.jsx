import { View, StyleSheet, Text } from "react-native"
import PieChart from "react-native-pie-chart"

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#F0FAF4',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#C6E8D2',
        padding: 20,
        shadowColor: '#2D7A4F',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2D7A4F',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
        marginBottom: 16,
    },
    legend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginTop: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendLabel: {
        fontSize: 12,
        color: '#52A876',
        fontWeight: '500',
    },
});

const colors = ['#1F5C3A', '#2D7A4F', '#52A876', '#A8D9BC'];

/*
    const series = [
        { value: 430, label: 'Pomodoro' },
        { value: 321, label: 'Cipolla rossa di Tropea' },
        { value: 185, label: 'Tartufo nero' },
        { value: 123, label: 'Cipolla ramata di Montoro' },
    ]
*/

const StatPieChart = ({ widthAndHeight, series, title }) => {
    const coloredSeries = series.map((s, i) => ({
        ...s,
        color: colors[i % colors.length],
    }));

    return (
        <View style={styles.container}>
            {title && <Text style={styles.title}>{title}</Text>}
            <PieChart cover={0.45} series={coloredSeries} widthAndHeight={widthAndHeight} />
            <View style={styles.legend}>
                {coloredSeries.map((s, i) => (
                    <View key={i} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: s.color }]} />
                        <Text style={styles.legendLabel}>{s.label ?? `Serie ${i + 1}`}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default StatPieChart;
