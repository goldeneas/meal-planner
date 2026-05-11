import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

// TODO: wait for DB functions and then uncoment this and remove mock data in fetchPantryItems


const PantryScreen = () => {
    const [pantryItems, setPantryItems] = useState([]);

    useEffect(() => {
        fetchPantryItems();
    }, []);

    const fetchPantryItems = async () => {
       
        const mockItems = [
            {
                id: 1,
                name: "Spaghetti",
                category: "Cereali",
                quantity: 500,
                unitOfMeasure: "g",
                expirationDate: "2027-12-31",
                note: "Scadenza a lungo termine"
            },
            {
                id: 2,
                name: "Passata di pomodoro",
                category: "Verdura e ortaggi",
                quantity: 2,
                unitOfMeasure: "pz",
                expirationDate: "2026-10-15",
                note: "Fatte in casa, utilizzare prima per i sughi"
            },
            {
                id: 3,
                name: "Olio Extravergine d'Oliva",
                category: "Condimenti",
                quantity: 1,
                unitOfMeasure: "L",
                expirationDate: null,
                note: null
            }
        ];

        setPantryItems(mockItems);

    };

    const removePantryItem = (id) => {
        // TODO: Inserisci qui la logica per rimuovere l'ingrediente anche dal DB
        setPantryItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.name}</Text>
                <View style={styles.badgeAndAction}>
                    <Text style={styles.category}>{item.category}</Text>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => removePantryItem(item.id)}>
                        <Text style={styles.deleteIcon}>🗑</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.details}>
                <Text style={styles.text}>Quantità: {item.quantity} {item.unitOfMeasure}</Text>
                {item.expirationDate ? (
                    <Text style={styles.text}>Scadenza: {item.expirationDate}</Text>
                ) : null}
                {item.note ? (
                    <Text style={styles.note}>Note: {item.note}</Text>
                ) : null}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={pantryItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>La dispensa è vuota.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8f5e9',
    },
    list: {
        padding: 16,
        gap: 12,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#c8e6c9',
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    badgeAndAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: { fontSize: 18, fontWeight: 'bold', color: '#1b5e20' },
    category: {
        fontSize: 12, color: '#2e7d32', backgroundColor: '#c8e6c9',
        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, overflow: 'hidden'
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteIcon: {
        color: '#ffffff',
        fontSize: 16,
    },
    details: { gap: 4 },
    text: { fontSize: 14, color: '#495057' },
    note: { fontSize: 14, color: '#868e96', fontStyle: 'italic', marginTop: 4 },
    emptyText: { textAlign: 'center', color: '#868e96', marginTop: 20, fontSize: 16 }
});

export default PantryScreen;
