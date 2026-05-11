import { View, StyleSheet, Text } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#C6E8D2',
        shadowOffset: { width: 0, height: 2 },
        padding: 20,
        shadowOpacity: 0.08,
        shadowColor: '#2D7A4F',
        backgroundColor: '#F0FAF4',
        elevation: 3,
        borderRadius: 20,
        width: '100%',
    },
});

const colors = ['#1F5C3A', '#2D7A4F', '#52A876', '#A8D9BC'];

const StatBarChart = ({ series }) => {
    const data = series.map((s, i) => ({
        value: s.value,
        label: s.label,
        frontColor: colors[i % colors.length],
        topLabelComponent: () => (
            <Text style={{ fontSize: 10, marginBottom: 4 }}>
                {s.value}
            </Text>
        ),
    }));

    return (
        <View style={styles.container}>
            <BarChart
                data={data}
                width={270}
                yAxisTextStyle={{ fontSize: 11 }}
                xAxisLabelTextStyle={{ fontSize: 10, width: 48, textAlign: 'center' }}
                noOfSections={4}
            />
        </View>
    );
};

export default StatBarChart;
