import React, { useEffect, useState } from 'react';
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

import * as SQLite from 'expo-sqlite';
import { createTables } from './src/database.js';
import { insertDefaultValues } from './src/defaults.js';

import PantryScreen from "./screens/PantryScreen";
import { StatScreen } from "./screens/StatScreen.js";
import ShoppingScreen from "./screens/ShoppingScreen.js";
import RecipeScreen from "./screens/RecipeScreen.js";
import PlanScreen from "./screens/PlanScreen.js";

const Tab = createBottomTabNavigator();

const App = () => {
    const [db, setDatabase] = useState(null);

    useEffect(() => {
        async function prepareDatabase() {
            try {
                const db = await SQLite.openDatabaseAsync("database.db");

                await createTables(db);
                await insertDefaultValues(db);

                setDatabase(db);
                console.log("[DB] caricato");
            } catch (error) {
                console.error("[DB] errore nel caricamento:", error);
            }
        }

        prepareDatabase();
    }, []);

    return (
        <ActionSheetProvider>
            <SafeAreaProvider>
                <NavigationContainer>
                    <Tab.Navigator
                        initialRouteName="Plan"
                        screenOptions={({ route }) => ({
                            tabBarIcon: ({ size }) => {
                                let icon;
                                if (route.name === 'Plan') icon = '📅';
                                else if (route.name === 'Recipes') icon = '🍲';
                                else if (route.name === 'Pantry') icon = '🥫';
                                else if (route.name === 'Shopping') icon = '🛒';
                                else if (route.name === 'Stats') icon = '📊';
                                return <Text style={{ fontSize: size }}>{icon}</Text>;
                            },
                            tabBarActiveTintColor: '#2D7A4F',
                            tabBarInactiveTintColor: 'gray',
                            tabBarStyle: { backgroundColor: '#ffffff', height: 85, paddingBottom: 10, paddingTop: 10 },
                            tabBarIconStyle: { marginBottom: 5 },
                            headerStyle: { backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#C6E8D2' },
                            headerTitleStyle: { fontWeight: 'bold', color: '#1c1f1d' },
                        })}
                    >
                        <Tab.Screen name="Plan" options={{ title: 'Piano' }}>
                            {props => <PlanScreen {...props} db={db} />}
                        </Tab.Screen>

                        <Tab.Screen name="Recipes" options={{ title: 'Ricette' }}>
                            {props => <RecipeScreen {...props} db={db} />}
                        </Tab.Screen>

                        <Tab.Screen name="Pantry" options={{ title: 'Dispensa' }}>
                            {props => <PantryScreen {...props} db={db} />}
                        </Tab.Screen>

                        <Tab.Screen name="Shopping" options={{ title: 'Spesa' }}>
                            {props => <ShoppingScreen {...props} db={db} />}
                        </Tab.Screen>

                        <Tab.Screen name="Stats" options={{ title: 'Stats' }}>
                            {props => <StatScreen {...props} db={db} />}
                        </Tab.Screen>
                    </Tab.Navigator>
                </NavigationContainer>
            </SafeAreaProvider>
        </ActionSheetProvider>
    );
};

export default App;
