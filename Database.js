import SQLite from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function setupDatabase(databaseName) {
    SQLite.enablePromise(true);
    const dbPromise = SQLite.openDatabase({ name: databaseName, location: 'default' })

    React.useEffect(() => {
        async function prepareDB() {
            const isInitialized = await AsyncStorage.getItem('db_initialized');
            if (!isInitialized) {
                const db = await dbPromise;
                createTables(db);
                await AsyncStorage.setItem('db_initialized', 'true');
            }
        }

        prepareDB();
    }, []);
}

function createTables(db) {

}
