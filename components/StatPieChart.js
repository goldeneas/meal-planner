import { View, StyleSheet, Text } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F0FAF4',
        borderWidth: 1,
        borderRadius: 20,
        borderColor: '#C6E8D2',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        padding: 20,
        shadowColor: '#2D7A4F',
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        alignItems: 'center',
        width: '100%'
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

const StatPieChart = ({ series }) => {
    const data = series.map((s, i) => ({
        value: s.value,
        color: colors[i % colors.length],
        label: s.label,
    }));

    const radius = 125;

    return (
        <View style={styles.container}>
            <PieChart
                data={data}
                radius={radius}
                innerRadius={radius * 0.45} // 45%
                centerLabelComponent={() => null}
            />
            <View style={styles.legend}>
                {data.map((s, i) => (
                    <View key={i} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: s.color }]} />
                        <Text style={styles.legendLabel}>{s.label ?? `default`}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default StatPieChart;
