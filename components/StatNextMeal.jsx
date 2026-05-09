import { View, StyleSheet, Text } from "react-native";

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F0FAF4',
        borderWidth: 1,
        borderColor: '#C6E8D2',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 18,
        gap: 4,
        width: '100%'
    },
    meta: {
        color: '#7AB894',
        fontWeight: '500',
        fontSize: 12,
    },
    mealName: {
        color: '#2D7A4F',
        fontWeight: '600',
        fontSize: 18,
    },
});

const StatNextMeal = ({ date, mealCategory, mealName }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.meta}>{date} · {mealCategory}</Text>
            <Text style={styles.mealName}>{mealName}</Text>
        </View>
    );
};

export default StatNextMeal;
