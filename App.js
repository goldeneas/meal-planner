import { NavigationContainer } from "@react-navigation/native";
import { View, Text, Button } from "react-native";

import SQLite from 'react-native-sqlite-storage';
import { useEffect, useState } from 'react';
import { createTables } from './src/database.js'
import PantryScreen from "./screens/PantryScreen";
import { StatScreen } from "./screens/StatScreen.js";
import ShoppingScreen  from "./screens/ShoppingScreen.js";
import RecipeScreen from "./screens/RecipeScreen.js";
import PlanScreen from "./screens/PlanScreen.js";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const { createNativeStackNavigator } = require("@react-navigation/native-stack");

const Stack = createNativeStackNavigator();

SQLite.enablePromise(true);
const dbPromise = SQLite.openDatabase({ name: "database.db", location: 'default' })

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
    const [db, setDb] = useState(null);

    useEffect(() => {
        async function prepareDB() {
            const database = await dbPromise;
            await createTables(database);
            setDb(database);
        }

        prepareDB();
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
