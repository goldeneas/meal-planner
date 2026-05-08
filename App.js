import { NavigationContainer } from "@react-navigation/native";
import { TouchableOpacity, View, Text, StyleSheet, Button } from "react-native";
import StatCounter from "./components/StatCounter";
import StatPieChart from "./components/StatPieChart";

const { createNativeStackNavigator } = require("@react-navigation/native-stack");

const Stack = createNativeStackNavigator();

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
        height: '80',
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

const HomeScreen = ({ navigation }) => {
    return (
        <View>
            <Text>HomeScreen</Text>
            <Button
                title="Vai alle stats"
                onPress={() => navigation.navigate("Stats")}
            />
        </View>
    )
}

const StatScreen = ({ navigation }) => {
    const series = [
        { value: 430, label: 'Pomodoro' },
        { value: 321, label: 'Cipolla rossa di Tropea' },
        { value: 185, label: 'Tartufo nero' },
        { value: 123, label: 'Cipolla ramata di Montoro' },
    ]

    return (
        <View>
            <View style={styles.grid}>
                {['Pasti Pianificati', 'Ingredienti Comprati', 'Stats', 'Stats'].map((label, index) => (
                    <StatCounter counter={index} label={label} />
                ))}
                <StatPieChart widthAndHeight={250} series={series} />
            </View>
        </View>
    );
};

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Stats" component={StatScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;
