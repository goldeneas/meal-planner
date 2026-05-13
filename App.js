import { NavigationContainer } from "@react-navigation/native";
import { View, Text, Button } from "react-native";

import SQLite from 'react-native-sqlite-storage';
import { useEffect } from 'react';
import { createTables } from './src/database.js'
import PantryScreen from "./screens/PantryScreen";
import { StatScreen } from "./screens/StatScreen.js";
import ShoppingScreen  from "./screens/ShoppingScreen.js";
import RecipeScreen from "./screens/RecipeScreen.js";
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
        </View>
    )
}

const App = () => {
    useEffect(() => {
        async function prepareDB() {
            const db = await dbPromise;
            await createTables(db);
        }

        prepareDB();
    }, []);
    
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Home">
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Stats" component={StatScreen} />
                        <Stack.Screen name="Pantry" component={PantryScreen} />
                        <Stack.Screen name="Shopping" component={ShoppingScreen} />
                        <Stack.Screen name="Recipes" component={RecipeScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default App;
