import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, ScrollView, Alert } from 'react-native';

// TODO: wait for DB functions and then uncomment this and remove mock data in fetchRecipes

const RecipeScreen = ({ route }) => {
    const [recipes, setRecipes] = useState([]);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    useEffect(() => {
        //Se arriviamo da PlanScreen con un ID, espande automaticamente quella card
        if (route?.params?.openRecipeId) {
            setExpandedId(route.params.openRecipeId);
        }
    }, [route?.params?.openRecipeId]);

    // Stati per l'aggiunta di ingredienti
    const [foodSearchQuery, setFoodSearchQuery] = useState('');
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [ingredientQty, setIngredientQty] = useState('');
    const [ingredientUnit, setIngredientUnit] = useState('');

    // TODO: DB - Sostituire con 'SELECT * FROM UnitOfMeasure'
    const availableUnits = ['g', 'kg', 'ml', 'l', 'pz', 'spicchio', 'cucchiai', 'rametti'];

    // TODO: DB - Questa lista servirà per l'autocompletamento tramite 'SELECT * FROM Food WHERE name LIKE ...'
    const availableFoods = [
        { id: 1, name: 'Pesto' }, { id: 2, name: 'Pennette' },
        { id: 3, name: 'Pomodoro' }, { id: 4, name: 'Pollo' },
        { id: 5, name: 'Patate' }, { id: 6, name: 'Aglio' },
        { id: 7, name: "Olio Extravergine d'Oliva" },
        { id: 8, name: 'Spaghetti' },
        { id: 9, name: 'Passata di pomodoro' },
        { id: 10, name: 'Rosmarino' },
    ];

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
                description: "Metti a bollire l'acqua in una pentola.\nAggiungi il sale e la pasta.\nPrepara il sugo di pomodoro a parte.\nScola la pasta e mescolala con il sugo.",
                difficulty: "Facile",
                category: "Primo",
                ingredients: [
                    { name: "Spaghetti", quantity: 200, unit: "g" },
                    { name: "Passata di pomodoro", quantity: 300, unit: "ml" },
                    { name: "Aglio", quantity: 1, unit: "spicchio" },
                    { name: "Olio Extravergine d'Oliva", quantity: 2, unit: "cucchiai" }
                ]
            },
            {
                id: 2,
                name: "Pollo al Forno con Patate",
                preparationTimeMinutes: 60,
                numberOfServings: 4,
                description: "Taglia le patate a cubetti.\nCondisci il pollo e le patate con olio e rosmarino.\nInforna a 200 gradi per 60 minuti.",
                difficulty: "Medio",
                category: "Secondo",
                ingredients: [
                    { name: "Pollo", quantity: 1, unit: "kg" },
                    { name: "Patate", quantity: 800, unit: "g" },
                    { name: "Rosmarino", quantity: 2, unit: "rametti" },
                    { name: "Olio Extravergine d'Oliva", quantity: 3, unit: "cucchiai" }
                ]
            }
        ];
        setRecipes(mockRecipes);
    };

    const handleFoodSearch = (text) => {
        setFoodSearchQuery(text);
        setSelectedFood(null); // Resetta il cibo selezionato se l'utente ricomincia a scrivere

        if (text.trim().length > 0) {
            // TODO: DB - Sostituire con 'SELECT * FROM Food WHERE name LIKE '%text%''
            const filtered = availableFoods.filter(f => f.name.toLowerCase().includes(text.toLowerCase()));
            setFilteredFoods(filtered);
        } else {
            setFilteredFoods([]);
        }
    };

    const handleSelectFood = (food) => {
        setSelectedFood(food);
        setFoodSearchQuery(food.name);
        setFilteredFoods([]);
    };

    const handleAddIngredient = () => {
        if (!selectedFood || !ingredientQty || !ingredientUnit) {
            Alert.alert("Errore", "Seleziona un cibo, inserisci la quantità e scegli un'unità di misura.");
            return;
        }
        
        const newIngredient = {
            foodId: selectedFood.id,
            name: selectedFood.name,
            quantity: parseFloat(ingredientQty),
            unit: ingredientUnit, // TODO: DB - Qua in futuro salverai l'ID riferito a UnitOfMeasure
        };

        setEditingRecipe({
            ...editingRecipe,
            ingredients: [...(editingRecipe.ingredients || []), newIngredient]
        });

        // Reset dei campi dell'ingrediente per aggiungerne un altro
        setSelectedFood(null);
        setFoodSearchQuery('');
        setIngredientQty('');
        setIngredientUnit('');
    };

    const handleRemoveIngredient = (index) => {
        const updatedIngredients = [...(editingRecipe.ingredients || [])];
        updatedIngredients.splice(index, 1);
        setEditingRecipe({
            ...editingRecipe,
            ingredients: updatedIngredients
        });
    };

    const handleEditClick = (recipe) => {
        setEditingRecipe({ ...recipe });
        resetIngredientForm();
    };

    const handleAddClick = () => {
        setEditingRecipe({
            name: '',
            preparationTimeMinutes: '',
            numberOfServings: '',
            description: '',
            difficulty: '',
            category: '',
            ingredients: []
        });
        resetIngredientForm();
    };

    const resetIngredientForm = () => {
        setSelectedFood(null);
        setFoodSearchQuery('');
        setIngredientQty('');
        setIngredientUnit('');
        setFilteredFoods([]);
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

        // TODO: DB - Sostituire con query 'INSERT/UPDATE INTO Recipe' ed 'INSERT INTO Ingredient'
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

    const toggleExpand = (id) => {
        setExpandedId((prevId) => (prevId === id ? null : id));
    };

    const renderItem = ({ item }) => {
        const isExpanded = expandedId === item.id;

        return (
            <View style={styles.card}>
                <TouchableOpacity onPress={() => toggleExpand(item.id)} style={styles.cardHeader} activeOpacity={0.7}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.title}>{item.name}</Text>
                        <Text style={styles.category}>{item.category}</Text>
                    </View>
                    <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {isExpanded && (
                    <View style={styles.expandedContent}>
                        <View style={styles.badgeAndAction}>
                            <TouchableOpacity style={styles.deleteButton} onPress={() => removeRecipe(item.id)}>
                                <Text style={styles.actionIcon}>🗑</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.editButton} onPress={() => handleEditClick(item)}>
                                <Text style={styles.actionIcon}>✏️</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.detailsContainer}>
                            <View style={styles.details}>
                                <Text style={styles.text}>⏱ Tempo: {item.preparationTimeMinutes} min</Text>
                                <Text style={styles.text}>🍽 Porzioni: {item.numberOfServings}</Text>
                                <Text style={styles.text}>📈 Difficoltà: {item.difficulty}</Text>

                                {item.ingredients && item.ingredients.length > 0 && (
                                    <View style={styles.ingredientsContainer}>
                                        <Text style={styles.ingredientsTitle}>Ingredienti:</Text>
                                        {item.ingredients.map((ing, idx) => (
                                            <Text key={idx} style={styles.ingredientText}>
                                                • {ing.quantity} {ing.unit} {ing.name}
                                            </Text>
                                        ))}
                                    </View>
                                )}

                                {item.description ? (
                                    <View style={styles.procedureContainer}>
                                        <Text style={styles.procedureTitle}>Procedimento:</Text>
                                        {item.description.split('\n').filter(step => step.trim() !== '').map((step, idx) => (
                                            <Text key={idx} style={styles.procedureStep}>
                                                {idx + 1}. {step.trim()}
                                            </Text>
                                        ))}
                                    </View>
                                ) : null}
                            </View>
                        </View>
                    </View>
                )}
            </View>
        );
    };

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
                                
                                <Text style={styles.sectionTitle}>Ingredienti</Text>

                                {/* Lista degli ingredienti già aggiunti */}
                                {editingRecipe.ingredients && editingRecipe.ingredients.length > 0 && (
                                    <View style={styles.addedIngredientsList}>
                                        {editingRecipe.ingredients.map((ing, idx) => (
                                            <View key={idx} style={styles.addedIngredientRow}>
                                                <Text style={styles.addedIngredientText}>
                                                    • {ing.quantity} {ing.unit} {ing.name}
                                                </Text>
                                                <TouchableOpacity onPress={() => handleRemoveIngredient(idx)}>
                                                    <Text style={styles.removeIngredientText}>✕</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                )}

                                {/* Form di ricerca e aggiunta nuovo Ingrediente */}
                                <View style={styles.addIngredientContainer}>
                                    <Text style={styles.label}>Cerca Cibo (Autocompletamento)</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={foodSearchQuery}
                                        onChangeText={handleFoodSearch}
                                        placeholder="Es. penne, pomodoro..."
                                    />
                                    
                                    {filteredFoods.length > 0 && !selectedFood && (
                                        <View style={styles.autocompleteContainer}>
                                            {filteredFoods.map(food => (
                                                <TouchableOpacity key={food.id} style={styles.autocompleteItem} onPress={() => handleSelectFood(food)}>
                                                    <Text style={styles.autocompleteText}>{food.name}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}

                                    {selectedFood && (
                                        <View style={styles.ingredientDetailsContainer}>
                                            <Text style={styles.label}>Quantità</Text>
                                            <TextInput style={styles.input} value={ingredientQty} onChangeText={setIngredientQty} keyboardType="numeric" placeholder="Es. 100" />
                                            
                                            <Text style={styles.label}>Unità di misura</Text>
                                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.unitSelector}>
                                                {availableUnits.map(u => (
                                                    <TouchableOpacity key={u} style={[styles.unitBtn, ingredientUnit === u && styles.unitBtnActive]} onPress={() => setIngredientUnit(u)}>
                                                        <Text style={[styles.unitBtnText, ingredientUnit === u && styles.unitBtnTextActive]}>{u}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                            
                                            <View style={{ marginTop: 8 }}>
                                                <Button title="Aggiungi Ingrediente" onPress={handleAddIngredient} color="#28a745" />
                                            </View>
                                        </View>
                                    )}
                                </View>

                                <Text style={styles.label}>Procedimento (uno step per riga)</Text>
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
        alignItems: 'center',
    },
    headerLeft: {
        flex: 1,
        alignItems: 'flex-start',
    },
    badgeAndAction: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 8,
        marginBottom: 8,
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
    procedureContainer: {
        marginTop: 12,
    },
    procedureTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 4,
    },
    procedureStep: {
        fontSize: 14,
        color: '#495057',
        marginBottom: 4,
    },
    expandedContent: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#c8e6c9',
    },
    expandIcon: {
        color: '#1b5e20',
        fontSize: 24,
        marginLeft: 8,
    },
    ingredientsContainer: {
        marginTop: 12,
        marginBottom: 4,
    },
    ingredientsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 4,
    },
    ingredientText: {
        fontSize: 14,
        color: '#495057',
        marginLeft: 8,
        marginBottom: 2,
    },
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
    sectionTitle: {
        fontSize: 18, fontWeight: 'bold', color: '#1b5e20',
        marginTop: 16, marginBottom: 8,
    },
    addedIngredientsList: { marginBottom: 12 },
    addedIngredientRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#c8e6c9',
    },
    addedIngredientText: { fontSize: 14, color: '#495057', flex: 1 },
    removeIngredientText: { color: '#dc3545', fontSize: 18, fontWeight: 'bold', paddingHorizontal: 8 },
    addIngredientContainer: {
        backgroundColor: '#f1f8f1', padding: 12, borderRadius: 8,
        marginBottom: 16, borderWidth: 1, borderColor: '#c8e6c9',
    },
    autocompleteContainer: {
        backgroundColor: 'white', borderWidth: 1, borderColor: '#c8e6c9',
        borderRadius: 8, maxHeight: 150, marginBottom: 12,
    },
    autocompleteItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f1f8f1' },
    autocompleteText: { fontSize: 14, color: '#2e7d32' },
    ingredientDetailsContainer: { marginTop: 8 },
    unitSelector: { flexDirection: 'row', marginBottom: 12 },
    unitBtn: {
        paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8,
        borderWidth: 1, borderColor: '#c8e6c9', backgroundColor: '#fff', marginRight: 8,
    },
    unitBtnActive: { backgroundColor: '#28a745', borderColor: '#28a745' },
    unitBtnText: { fontSize: 14, color: '#28a745' },
    unitBtnTextActive: { color: '#fff', fontWeight: 'bold' },
});

export default RecipeScreen;