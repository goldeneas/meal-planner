import { View, StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
    container: {
        width: '48%',
        height: 84,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F0FAF4',
        borderWidth: 1,
        borderColor: '#C6E8D2',
    },
    counter: {
        color: '#2D7A4F',
        fontWeight: '600',
        fontSize: 30,
    },
    label: {
        color: '#7AB894',
        fontWeight: '500',
        fontSize: 12,
    },
});

const StatCounter = ({ counter, label, style = '' }) => {
    return (
        <View style={[styles.container, style]}>
            <Text style={styles.counter}>{counter}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
};

export default StatCounter;
