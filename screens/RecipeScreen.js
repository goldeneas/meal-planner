import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, ScrollView, Alert } from 'react-native';

// TODO: wait for DB functions and then uncomment this and remove mock data in fetchRecipes

const RecipeScreen = () => {
    const [recipes, setRecipes] = useState([]);
    const [editingRecipe, setEditingRecipe] = useState(null);

    useEffect(() => {
        fetchRecipes();
    }, []);

    const fetchRecipes = async () => {
        const mockRecipes = [
            {
                id: 1,
                name: "Spaghetti al Pomodoro",
                preparationTimeMinutes: 20,
                numberOfServings: 2,
                description: "Una classica e semplice ricetta italiana, veloce e gustosa.",
                difficulty: "Facile", // Mockato per display, in DB sarà un ID (FK a Difficulty)
                category: "Primo" // Mockato per display, in DB sarà un ID (FK a RecipeCategory)
            },
            {
                id: 2,
                name: "Pollo al Forno con Patate",
                preparationTimeMinutes: 60,
                numberOfServings: 4,
                description: "Pollo arrosto con patate croccanti aromatizzate al rosmarino.",
                difficulty: "Medio",
                category: "Secondo"
            }
        ];
        setRecipes(mockRecipes);
    };

    const handleEditClick = (recipe) => {
        setEditingRecipe({ ...recipe });
    };

    const handleAddClick = () => {
        setEditingRecipe({
            name: '',
            preparationTimeMinutes: '',
            numberOfServings: '',
            description: '',
            difficulty: '',
            category: ''
        });
    };

    const saveEdit = () => {
        if (!editingRecipe.name || !editingRecipe.description || !editingRecipe.difficulty || !editingRecipe.category || editingRecipe.preparationTimeMinutes === '' || editingRecipe.numberOfServings === '') {
            Alert.alert("Errore", "Tutti i campi sono obbligatori.");
            return;
        }

        if (isNaN(editingRecipe.preparationTimeMinutes) || isNaN(editingRecipe.numberOfServings)) {
            Alert.alert("Errore", "I campi Tempo di Preparazione e Porzioni devono essere numeri validi.");
            return;
        }

        // TODO: DB update function and then update state
        const updatedRecipe = {
            ...editingRecipe,
            preparationTimeMinutes: parseInt(editingRecipe.preparationTimeMinutes, 10),
            numberOfServings: parseInt(editingRecipe.numberOfServings, 10)
        };

        if (updatedRecipe.id) {
            setRecipes((prev) => prev.map((item) => item.id === updatedRecipe.id ? updatedRecipe : item));
        } else {
            updatedRecipe.id = Date.now(); // ID Temporaneo
            setRecipes((prev) => [...prev, updatedRecipe]);
        }
        
        setEditingRecipe(null);
    };

    const removeRecipe = (id) => {
        // TODO: DB delete function and then update state
        setRecipes((prev) => prev.filter((item) => item.id !== id));
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                    <Text style={styles.title}>{item.name}</Text>
                    <Text style={styles.category}>{item.category}</Text>
                </View>
                <View style={styles.badgeAndAction}>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => removeRecipe(item.id)}>
                        <Text style={styles.actionIcon}>🗑</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editButton} onPress={() => handleEditClick(item)}>
                        <Text style={styles.actionIcon}>✏️</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.details}>
                    <Text style={styles.text}>⏱ Tempo: {item.preparationTimeMinutes} min</Text>
                    <Text style={styles.text}>🍽 Porzioni: {item.numberOfServings}</Text>
                    <Text style={styles.text}>📈 Difficoltà: {item.difficulty}</Text>
                    {item.description ? (
                        <Text style={styles.description}>Descrizione: {item.description}</Text>
                    ) : null}
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>Ricette</Text>
            <FlatList
                data={recipes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>Non ci sono ricette salvate.</Text>}
            />

            <TouchableOpacity style={styles.fab} onPress={handleAddClick}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>

            <Modal visible={!!editingRecipe} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{editingRecipe?.id ? 'Modifica Ricetta' : 'Nuova Ricetta'}</Text>
                        {editingRecipe && (
                            <ScrollView>
                                <Text style={styles.label}>Nome Ricetta</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editingRecipe.name}
                                    onChangeText={(text) => setEditingRecipe({ ...editingRecipe, name: text })}
                                />
                                
                                <Text style={styles.label}>Categoria</Text>
                                {/* TODO: Sostituire con un Picker che ottiene le categorie (RecipeCategory) dal DB */}
                                <TextInput
                                    style={styles.input}
                                    value={editingRecipe.category}
                                    onChangeText={(text) => setEditingRecipe({ ...editingRecipe, category: text })}
                                />
                                
                                <Text style={styles.label}>Difficoltà</Text>
                                {/* TODO: Sostituire con un Picker che ottiene le difficoltà (Difficulty) dal DB */}
                                <TextInput
                                    style={styles.input}
                                    value={editingRecipe.difficulty}
                                    onChangeText={(text) => setEditingRecipe({ ...editingRecipe, difficulty: text })}
                                />
                                
                                <Text style={styles.label}>Tempo di Preparazione (minuti)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editingRecipe.preparationTimeMinutes.toString()}
                                    keyboardType="numeric"
                                    onChangeText={(text) => setEditingRecipe({ ...editingRecipe, preparationTimeMinutes: text })}
                                />
                                
                                <Text style={styles.label}>Numero di Porzioni</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editingRecipe.numberOfServings.toString()}
                                    keyboardType="numeric"
                                    onChangeText={(text) => setEditingRecipe({ ...editingRecipe, numberOfServings: text })}
                                />
                                
                                <Text style={styles.label}>Descrizione/Istruzioni</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={editingRecipe.description}
                                    multiline
                                    numberOfLines={4}
                                    onChangeText={(text) => setEditingRecipe({ ...editingRecipe, description: text })}
                                />
                                
                                <View style={styles.modalActions}>
                                    <View style={styles.buttonWrapper}>
                                        <Button title="Annulla" onPress={() => setEditingRecipe(null)} color="#dc3545" />
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
    editButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
    deleteButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
    actionIcon: { fontSize: 20 },
    detailsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    details: { gap: 4, flex: 1 },
    text: { fontSize: 14, color: '#495057' },
    description: { fontSize: 14, color: '#868e96', fontStyle: 'italic', marginTop: 8 },
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
        maxHeight: '85%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1b5e20',
        textAlign: 'center',
    },
    label: { fontSize: 14, color: '#495057', marginBottom: 4, fontWeight: 'bold' },
    input: {
        borderWidth: 1, borderColor: '#c8e6c9', borderRadius: 8,
        padding: 10, marginBottom: 12, fontSize: 16, backgroundColor: '#f8f9fa',
    },
    textArea: { height: 100, textAlignVertical: 'top' },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
    buttonWrapper: { flex: 1, marginHorizontal: 8 },
    fab: {
        position: 'absolute', width: 60, height: 60, alignItems: 'center', justifyContent: 'center',
        right: 20, bottom: 40, backgroundColor: '#28a745', borderRadius: 30, elevation: 5,
    },
    fabIcon: { fontSize: 30, color: 'white', fontWeight: 'bold' },
});

export default RecipeScreen;