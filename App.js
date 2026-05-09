import { NavigationContainer } from "@react-navigation/native";
import { TouchableOpacity, View, Text, StyleSheet, Button } from "react-native";
import StatCounter from "./components/StatCounter";
import StatPieChart from "./components/StatPieChart";

import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { createTables } from './src/database.js'

const { createNativeStackNavigator } = require("@react-navigation/native-stack");

const Stack = createNativeStackNavigator();

SQLite.enablePromise(true);
const dbPromise = SQLite.openDatabase({ name: "database.db", location: 'default' })

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
                {['Pasti Pianificati', 'Ingredienti Comprati'].map((label, index) => (
                    <StatCounter key={index} counter={index} label={label} />
                ))}
                <StatPieChart widthAndHeight={250} series={series} />
            </View>
        </View>
    );
};

const App = () => {
    useEffect(() => {
        async function prepareDB() {
            const db = await dbPromise;
            await createTables(db);
        }

        prepareDB();
    }, []);

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
