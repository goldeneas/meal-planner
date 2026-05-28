import { NavigationContainer } from "@react-navigation/native";
import { View, Text, Button } from "react-native";

import * as SQLite from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { createTables } from './src/database.js'
import { insertDefaultValues } from './src/defaults.js'
import PantryScreen from "./screens/PantryScreen";
import { StatScreen } from "./screens/StatScreen.js";
import ShoppingScreen from "./screens/ShoppingScreen.js";
import RecipeScreen from "./screens/RecipeScreen.js";
import PlanScreen from "./screens/PlanScreen.js";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const { createNativeStackNavigator } = require("@react-navigation/native-stack");

const Stack = createNativeStackNavigator();

const HomeScreen = ({ navigation }) => {
    return (
        <View>
            <Text>HomeScreen</Text>
            <Button
                title="Vai alle stats"
                onPress={() => navigation.navigate("Stats")}
            />
            <Button
                title="Gestione Dispensa"
                onPress={() => navigation.navigate("Pantry")}
            />
            <Button
                title="Vai alla Spesa"
                onPress={() => navigation.navigate("Shopping")}
            />
            <Button
                title="Gestione Ricette"
                onPress={() => navigation.navigate("Recipes")}
            />
            <Button
                title="Pianificazione Pasti"
                onPress={() => navigation.navigate("Plan")}
            />
        </View>
    )
}

const App = () => {
    const [db, setDatabase] = useState(null)

    useEffect(() => {
        async function prepareDatabase() {
            try {
                const db = await SQLite.openDatabaseAsync("database.db");

                await createTables(db);
                await insertDefaultValues(db);

                setDatabase(db);
                console.log("[DB] caricato")
            } catch (error) {
                console.error("[DB] errore nel caricamento:", error);
            }
        }

        prepareDatabase();
    }, []);

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Home">
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Stats">{props => <StatScreen {...props} db={db} />}</Stack.Screen>
                        <Stack.Screen name="Pantry">{props => <PantryScreen {...props} db={db} />}</Stack.Screen>
                        <Stack.Screen name="Shopping">{props => <ShoppingScreen {...props} db={db} />}</Stack.Screen>
                        <Stack.Screen name="Recipes">{props => <RecipeScreen {...props} db={db} />}</Stack.Screen>
                        <Stack.Screen name="Plan">{props => <PlanScreen {...props} db={db} />}</Stack.Screen>
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default App;
