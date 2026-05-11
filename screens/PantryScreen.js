import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, ScrollView, Alert } from 'react-native';

// TODO: wait for DB functions and then uncoment this and remove mock data in fetchPantryItems


const PantryScreen = () => {
    const [pantryItems, setPantryItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);

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

    const handleEditClick = (item) => {
        setEditingItem({ ...item });
    };

    const saveEdit = () => {
        if (!editingItem.name || !editingItem.category || !editingItem.unitOfMeasure || editingItem.quantity === '' || editingItem.quantity == null) {
            Alert.alert("Errore", "I campi Nome, Categoria, Quantità e Unità di misura sono obbligatori.");
            return;
        }

        // TODO: DB update function and then update state
        const updatedItem = {
            ...editingItem,
            quantity: parseFloat(editingItem.quantity) || 0
        };
        setPantryItems((prevItems) => prevItems.map((item) => item.id === updatedItem.id ? updatedItem : item));
        setEditingItem(null);
    };

    const removePantryItem = (id) => {
        // TODO: DB delete function and then update state
        setPantryItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.category}>{item.category}</Text>
                </View>
                <View style={styles.badgeAndAction}>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => removePantryItem(item.id)}>
                        <Text style={styles.actionIcon}>🗑</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEditClick(item)}>
                        <Text style={styles.actionIcon}>✏️</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.detailsContainer}>
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
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>Dispensa</Text>
            <FlatList
                data={pantryItems}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>La dispensa è vuota.</Text>}
            />

            <Modal visible={!!editingItem} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Modifica Prodotto</Text>
                        {editingItem && (
                            <ScrollView>
                                <Text style={styles.label}>Nome</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editingItem.name}
                                    onChangeText={(text) => setEditingItem({ ...editingItem, name: text })}
                                />
                                <Text style={styles.label}>Categoria</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editingItem.category}
                                    onChangeText={(text) => setEditingItem({ ...editingItem, category: text })}
                                />
                                <Text style={styles.label}>Quantità</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editingItem.quantity.toString()}
                                    keyboardType="numeric"
                                    onChangeText={(text) => setEditingItem({ ...editingItem, quantity: text })}
                                />
                                <Text style={styles.label}>Unità di misura</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editingItem.unitOfMeasure}
                                    onChangeText={(text) => setEditingItem({ ...editingItem, unitOfMeasure: text })}
                                />
                                <Text style={styles.label}>Scadenza (YYYY-MM-DD)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editingItem.expirationDate || ''}
                                    onChangeText={(text) => setEditingItem({ ...editingItem, expirationDate: text })}
                                />
                                <Text style={styles.label}>Note</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editingItem.note || ''}
                                    onChangeText={(text) => setEditingItem({ ...editingItem, note: text })}
                                />
                                <View style={styles.modalActions}>
                                    <View style={styles.buttonWrapper}>
                                        <Button title="Annulla" onPress={() => setEditingItem(null)} color="#dc3545" />
                                    </View>
                                    <View style={styles.buttonWrapper}>
                                        <Button title="Salva" onPress={saveEdit} color="#28a745" />
                                    </View>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8f5e9',
    },
    screenTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1b5e20',
        paddingHorizontal: 16,
        paddingTop: 24,
        textAlign: 'center',
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
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    headerLeft: {
        flex: 1,
        alignItems: 'flex-start',
    },
    badgeAndAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    title: { fontSize: 20, fontWeight: 'bold', color: '#1b5e20', marginBottom: 4 },
    category: {
        fontSize: 14, color: '#2e7d32', backgroundColor: '#c8e6c9',
        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, overflow: 'hidden', alignSelf: 'flex-start'
    },
    editButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    deleteButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionIcon: {
        fontSize: 20,
    },
    details: { gap: 4, flex: 1 },
    text: { fontSize: 14, color: '#495057' },
    note: { fontSize: 14, color: '#868e96', fontStyle: 'italic', marginTop: 4 },
    emptyText: { textAlign: 'center', color: '#868e96', marginTop: 20, fontSize: 16 },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1b5e20',
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        color: '#495057',
        marginBottom: 4,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#c8e6c9',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: '#f8f9fa',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    buttonWrapper: {
        flex: 1,
        marginHorizontal: 8,
    }
});

export default PantryScreen;
