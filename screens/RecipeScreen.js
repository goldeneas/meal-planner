import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button, ScrollView, Alert } from 'react-native';
import { useActionSheet, ActionSheetProvider } from '@expo/react-native-action-sheet';

import { getRecipeCategories, getRecipeDifficulties, getRecipes, insertRecipe, updateRecipeById, removeRecipeById } from '../src/recipe';
import { getUnitsOfMeasure } from '../src/uom';
import { getFoods } from '../src/food';
import { getIngredients, insertIngredient, removeIngredientById } from '../src/ingredient';

// Componente per simulare un menu a tendina nativo
const ActionSheetPicker = ({ title, options, value, placeholder, onSelect }) => {
    const { showActionSheetWithOptions } = useActionSheet();

    const showPicker = () => {
        const actionOptions = [...options, 'Annulla'];
        const cancelButtonIndex = actionOptions.length - 1;

        showActionSheetWithOptions({
            options: actionOptions,
            cancelButtonIndex,
            title
        }, (buttonIndex) => {
            if (buttonIndex !== cancelButtonIndex) {
                onSelect(actionOptions[buttonIndex]);
            }
        });
    };

    return (
        <TouchableOpacity style={styles.pickerContainer} onPress={showPicker}>
            <Text style={[styles.pickerText, !value && styles.pickerPlaceholder]}>
                {value || placeholder}
            </Text>
        </TouchableOpacity>
    );
};

const RecipeScreen = ({ route, db }) => {
    const [recipes, setRecipes] = useState([]);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    const [recipeSearchQuery, setRecipeSearchQuery] = useState('');
    const [filteredRecipeNames, setFilteredRecipeNames] = useState([]);
    const [selectedRecipeFilter, setSelectedRecipeFilter] = useState('');
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(null);
    const [sortByPrepTime, setSortByPrepTime] = useState(false);

    useFocusEffect(
        useCallback(() => {
            // Se arriviamo da PlanScreen con un ID, espande automaticamente quella card
            if (route?.params?.openRecipeId) {
                setExpandedId(route.params.openRecipeId);
            }
        }, [route?.params?.openRecipeId]));

    // Stati per la gestione della ricerca e aggiunta ingredienti
    const [foodSearchQuery, setFoodSearchQuery] = useState('');
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [ingredientQty, setIngredientQty] = useState('');
    const [ingredientUnit, setIngredientUnit] = useState('');

    const [availableUnits, setAvailableUnits] = useState([]);
    const [availableFoods, setAvailableFoods] = useState([]);
    const [categories, setCategories] = useState([]);
    const [difficulties, setDifficulties] = useState([]);

    // Caricamento dei dati quando la schermata riceve il focus
    useFocusEffect(
        useCallback(() => {
            if (db) {
                loadStaticData();
                fetchRecipes();
            }
        }, [db]));

    // Recupera i dati di appoggio necessari dal database (unità, cibi, categorie, difficoltà)
    const loadStaticData = async () => {
        try {
            const uoms = await getUnitsOfMeasure(db);
            setAvailableUnits(uoms);
            const foods = await getFoods(db);
            setAvailableFoods(foods);
            const cats = await getRecipeCategories(db);
            setCategories(cats);
            const diffs = await getRecipeDifficulties(db);
            setDifficulties(diffs);
        } catch (error) {
            console.error("Error loading static data:", error);
        }
    };

    // Recupera le ricette e unisce i dati degli ingredienti per ogni riceta
    const fetchRecipes = async () => {
        if (!db) return;
        try {
            const rawRecipes = await getRecipes(db);
            const allIngredients = await getIngredients(db);
            const cats = await getRecipeCategories(db);
            const diffs = await getRecipeDifficulties(db);
            const uoms = await getUnitsOfMeasure(db);
            const foods = await getFoods(db);

            const formattedRecipes = rawRecipes.map(recipe => {
                const catDesc = cats.find(c => c.id === recipe.category)?.description || '';
                const diffDesc = diffs.find(d => d.id === recipe.difficulty)?.description || '';

                const recipeIngredients = allIngredients
                    .filter(ing => ing.recipe === recipe.id)
                    .map(ing => ({
                        foodId: ing.food,
                        quantity: ing.quantity,
                        unit: uoms.find(u => u.id === ing.unitOfMeasure)?.symbol || '',
                        name: foods.find(f => f.id === ing.food)?.name || ''
                    }));

                return {
                    ...recipe,
                    category: catDesc,
                    difficulty: diffDesc,
                    ingredients: recipeIngredients
                };
            });
            setRecipes(formattedRecipes);
        } catch (error) {
            console.error("Error fetching recipes:", error);
            Alert.alert("Errore", "Impossibile caricare le ricette.");
        }
    };

    // Filtra l'autocompletamento per la ricerca ricette testuale
    const handleRecipeSearch = (text) => {
        setRecipeSearchQuery(text);
        setSelectedRecipeFilter('');

        if (text.trim().length > 0) {
            const filtered = recipes.filter(r => r.name.toLowerCase().includes(text.toLowerCase()));
            setFilteredRecipeNames(filtered);
        } else {
            setFilteredRecipeNames([]);
        }
    };

    // Seleziona la ricetta dall'autocompletamento di ricerca
    const handleSelectRecipeFilter = (recipe) => {
        setSelectedRecipeFilter(recipe.name);
        setRecipeSearchQuery(recipe.name);
        setFilteredRecipeNames([]);
    };

    // Cerca il cibo nel db per poterlo aggiungere come ingrediente
    const handleFoodSearch = (text) => {
        setFoodSearchQuery(text);
        setSelectedFood(null);

        if (text.trim().length > 0) {
            const filtered = availableFoods.filter(f => f.name.toLowerCase().includes(text.toLowerCase()));
            setFilteredFoods(filtered);
        } else {
            setFilteredFoods([]);
        }
    };

    // Seleziona un cibo specifico dall'autocompletamento degli ingredienti
    const handleSelectFood = (food) => {
        setSelectedFood(food);
        setFoodSearchQuery(food.name);
        setFilteredFoods([]);
    };

    // Aggiunge temporaneamente l'ingrediente allo state della ricetta
    const handleAddIngredient = () => {
        if (!selectedFood || !ingredientQty || !ingredientUnit) {
            Alert.alert("Errore", "Seleziona un cibo, inserisci la quantità e scegli un'unità di misura.");
            return;
        }

        const newIngredient = {
            foodId: selectedFood.id,
            name: selectedFood.name,
            quantity: parseFloat(ingredientQty),
            unit: ingredientUnit,
        };

        setEditingRecipe({
            ...editingRecipe,
            ingredients: [...(editingRecipe.ingredients || []), newIngredient]
        });

        setSelectedFood(null);
        setFoodSearchQuery('');
        setIngredientQty('');
        setIngredientUnit('');
    };

    // Rimuove un ingrediente temporaneamente dalla lista in modifica
    const handleRemoveIngredient = (index) => {
        const updatedIngredients = [...(editingRecipe.ingredients || [])];
        updatedIngredients.splice(index, 1);
        setEditingRecipe({
            ...editingRecipe,
            ingredients: updatedIngredients
        });
    };

    // Prepara il form per la modifica
    const handleEditClick = (recipe) => {
        setEditingRecipe({ ...recipe });
        resetIngredientForm();
    };

    // Prepara il form per aggiungere una nuova ricetta
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

    // Resetta i campi di inserimento per il singolo ingrediente
    const resetIngredientForm = () => {
        setSelectedFood(null);
        setFoodSearchQuery('');
        setIngredientQty('');
        setIngredientUnit('');
        setFilteredFoods([]);
    };

    // Valida i campi e salva ricetta e ingredienti nel db
    const saveEdit = () => {
        if (!db) {
            Alert.alert("Errore", "Database non pronto. Riprova tra qualche istante.");
            return;
        }

        if (!editingRecipe.name || !editingRecipe.description || !editingRecipe.difficulty || !editingRecipe.category || editingRecipe.preparationTimeMinutes === '' || editingRecipe.numberOfServings === '') {
            Alert.alert("Errore", "Tutti i campi sono obbligatori.");
            return;
        }

        if (!editingRecipe.ingredients || editingRecipe.ingredients.length === 0) {
            Alert.alert("Errore", "Non puoi creare una ricetta se prima non inserisci almeno un ingrediente!");
            return;
        }

        if (isNaN(editingRecipe.preparationTimeMinutes) || isNaN(editingRecipe.numberOfServings)) {
            Alert.alert("Errore", "I campi Tempo di Preparazione e Porzioni devono essere numeri validi.");
            return;
        }

        const saveToDb = async () => {
            try {
                let categoryId = categories.find(c => c.description.toLowerCase() === editingRecipe.category.trim().toLowerCase())?.id;
                let difficultyId = difficulties.find(d => d.description.toLowerCase() === editingRecipe.difficulty.trim().toLowerCase())?.id;

                if (!categoryId || !difficultyId) {
                    Alert.alert("Errore", "Seleziona una categoria e una difficoltà valide.");
                    return;
                }

                let recipeId = editingRecipe.id;
                const safeName = editingRecipe.name.trim();
                const safeDesc = editingRecipe.description.trim();
                const prepTime = parseInt(editingRecipe.preparationTimeMinutes, 10);
                const servings = parseInt(editingRecipe.numberOfServings, 10);

                const recipeData = { name: safeName, preparationTimeMinutes: prepTime, numberOfServings: servings, description: safeDesc, difficulty: difficultyId, category: categoryId };

                if (recipeId) {
                    await updateRecipeById(db, recipeId, recipeData);
                    const allDbIngredients = await getIngredients(db);
                    const recipeIngredients = allDbIngredients.filter(ing => ing.recipe === recipeId);
                    for (const oldIng of recipeIngredients) {
                        await removeIngredientById(db, oldIng.id);
                    }
                } else {
                    recipeId = await insertRecipe(db, recipeData);
                }

                if (editingRecipe.ingredients) {
                    for (const ing of editingRecipe.ingredients) {
                        let uomId = availableUnits.find(u => u.symbol === ing.unit)?.id;
                        if (uomId) {
                            await insertIngredient(db, {
                                quantity: ing.quantity,
                                recipe: recipeId,
                                unitOfMeasure: uomId,
                                food: ing.foodId
                            });
                        }
                    }
                }

                await loadStaticData();
                await fetchRecipes();
                setEditingRecipe(null);
            } catch (error) {
                console.error("Error saving recipe:", error);
                Alert.alert("Errore", "Impossibile salvare la ricetta.");
            }
        };

        saveToDb();
    };

    // Rimuove la ricetta e (tramite vincoli/logica nel db) i suoi ingredienti
    const removeRecipe = async (id) => {
        if (!db) return;
        try {
            await removeRecipeById(db, id);
            await fetchRecipes();
        } catch (error) {
            console.error("Error deleting recipe:", error);
            Alert.alert("Errore", "Impossibile rimuovere la ricetta.");
        }
    };

    // Apre/chiude l'accordion della ricetta
    const toggleExpand = (id) => {
        setExpandedId((prevId) => (prevId === id ? null : id));
    };

    // Disegna la singola card di una ricetta
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
                    <TouchableOpacity style={styles.deleteButton} onPress={() => removeRecipe(item.id)}>
                        <Text style={styles.expandIcon}>✖</Text>
                    </TouchableOpacity>
                </TouchableOpacity>

                {isExpanded && (
                    <View style={styles.expandedContent}>
                        <View style={styles.detailsContainer}>
                            <View style={styles.details}>
                                <Text style={styles.boldInfo}> Tempo: {item.preparationTimeMinutes} min</Text>
                                <Text style={styles.boldInfo}> Porzioni: {item.numberOfServings}</Text>
                                <Text style={styles.boldInfo}> Difficoltà: {item.difficulty}</Text>

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

                                <TouchableOpacity style={styles.editButton} onPress={() => handleEditClick(item)}>
                                    <Text style={styles.editText}>Modifica</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    // Filtra e ordina la lista in base alla categoria, ricerca testuale e tempo
    let displayedRecipes = recipes.filter(r => {
        let matchName = true;
        if (selectedRecipeFilter) {
            matchName = r.name === selectedRecipeFilter;
        } else if (recipeSearchQuery.trim().length > 0) {
            matchName = r.name.toLowerCase().includes(recipeSearchQuery.toLowerCase());
        }
        let matchCat = selectedCategoryFilter ? r.category === selectedCategoryFilter : true;
        return matchName && matchCat;
    });

    if (sortByPrepTime) {
        displayedRecipes.sort((a, b) => a.preparationTimeMinutes - b.preparationTimeMinutes);
    }

    return (
        <View style={styles.container}>
            {/* Contenitore filtri e barra di ricerca */}
            <View style={styles.filtersContainer}>
                <View style={{ zIndex: 10 }}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cerca ricetta per nome..."
                        value={recipeSearchQuery}
                        onChangeText={handleRecipeSearch}
                    />
                    {filteredRecipeNames.length > 0 && !selectedRecipeFilter && (
                        <ScrollView style={styles.recipeAutocompleteContainer} keyboardShouldPersistTaps="handled">
                            {filteredRecipeNames.map(r => (
                                <TouchableOpacity key={r.id} style={styles.autocompleteItem} onPress={() => handleSelectRecipeFilter(r)}>
                                    <Text style={styles.autocompleteText}>{r.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilterContainer}>
                    <TouchableOpacity style={[styles.filterChip, selectedCategoryFilter === null && styles.filterChipActive]} onPress={() => setSelectedCategoryFilter(null)}>
                        <Text style={[styles.filterChipText, selectedCategoryFilter === null && styles.filterChipTextActive]}>Tutte</Text>
                    </TouchableOpacity>
                    {categories.map(cat => (
                        <TouchableOpacity key={cat.id} style={[styles.filterChip, selectedCategoryFilter === cat.description && styles.filterChipActive]} onPress={() => setSelectedCategoryFilter(cat.description)}>
                            <Text style={[styles.filterChipText, selectedCategoryFilter === cat.description && styles.filterChipTextActive]}>{cat.description}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity style={[styles.sortButton, sortByPrepTime && styles.sortButtonActive]} onPress={() => setSortByPrepTime(!sortByPrepTime)}>
                    <Text style={[styles.sortButtonText, sortByPrepTime && styles.sortButtonTextActive]}>Ordina per tempo di preparazione</Text>
                </TouchableOpacity>
            </View>

            {/* Lista delle ricette */}
            <FlatList
                data={displayedRecipes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.emptyText}>Non ci sono ricette salvate.</Text>}
            />

            {/* Pulsante aggiungi */}
            <TouchableOpacity style={styles.fab} onPress={handleAddClick}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>

            {/* Modale inserimento / modifica */}
            <Modal visible={!!editingRecipe} animationType="slide" transparent={true}>
                <ActionSheetProvider>
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
                                <ActionSheetPicker
                                    title="Seleziona Categoria"
                                    options={categories.map(cat => cat.description)}
                                    value={editingRecipe.category}
                                    placeholder="Seleziona una categoria..."
                                    onSelect={(val) => setEditingRecipe({ ...editingRecipe, category: val })}
                                />

                                <Text style={styles.label}>Difficoltà</Text>
                                <ActionSheetPicker
                                    title="Seleziona Difficoltà"
                                    options={difficulties.map(diff => diff.description)}
                                    value={editingRecipe.difficulty}
                                    placeholder="Seleziona una difficoltà..."
                                    onSelect={(val) => setEditingRecipe({ ...editingRecipe, difficulty: val })}
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
                                                    <TouchableOpacity key={u.id} style={[styles.unitBtn, ingredientUnit === u.symbol && styles.unitBtnActive]} onPress={() => setIngredientUnit(u.symbol)}>
                                                        <Text style={[styles.unitBtnText, ingredientUnit === u.symbol && styles.unitBtnTextActive]}>{u.symbol}</Text>
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
                </ActionSheetProvider>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    screenTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1c1f1d',
        paddingHorizontal: 20,
        paddingTop: 24,
        textAlign: 'left',
    },
    list: {
        padding: 20,
        gap: 12,
    },
    card: {
        backgroundColor: '#F0FAF4',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#C6E8D2',
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
    title: { fontSize: 18, fontWeight: 'bold', color: '#1F5C3A', marginBottom: 4 },
    category: {
        fontSize: 12, color: '#52A876', backgroundColor: '#fff',
        paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#C6E8D2', overflow: 'hidden', alignSelf: 'flex-start'
    },
    editButton: { justifyContent: 'center', alignItems: 'center' },
    deleteButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
    actionIcon: { fontSize: 18, color: '#2D7A4F' },
    detailsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    details: { gap: 4, flex: 1 },
    text: { fontSize: 14, color: '#52A876' },
    procedureContainer: {
        marginTop: 12,
    },
    procedureTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2D7A4F',
        marginBottom: 4,
    },
    boldInfo: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2D7A4F',
    },
    procedureStep: {
        fontSize: 14,
        color: '#52A876',
        marginBottom: 4,
    },
    expandedContent: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#C6E8D2',
    },
    expandIcon: {
        fontSize: 18,
        marginLeft: 8,
    },
    editText: {
        fontSize: 16,
        marginLeft: 8,
        marginTop: 18,
        color: '#2D7A4F',
        fontWeight: 'bold',
    },
    ingredientsContainer: {
        marginTop: 12,
        marginBottom: 4,
    },
    ingredientsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2D7A4F',
        marginBottom: 4,
    },
    ingredientText: {
        fontSize: 14,
        color: '#52A876',
        marginLeft: 8,
        marginBottom: 2,
    },
    emptyText: { textAlign: 'center', color: '#7AB894', marginTop: 20, fontSize: 16 },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        maxHeight: '85%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#1F5C3A',
        textAlign: 'center',
    },
    label: { fontSize: 14, color: '#1F5C3A', marginBottom: 4, fontWeight: 'bold' },
    input: {
        borderWidth: 1, borderColor: '#C6E8D2', borderRadius: 10,
        padding: 12, marginBottom: 12, fontSize: 16, backgroundColor: '#F0FAF4',
        color: '#1F5C3A',
    },
    textArea: { height: 100, textAlignVertical: 'top' },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, gap: 12 },
    buttonWrapper: { flex: 1 },
    fab: {
        position: 'absolute', width: 56, height: 56, alignItems: 'center', justifyContent: 'center',
        right: 20, bottom: 30, backgroundColor: '#2D7A4F', borderRadius: 28, elevation: 4,
        shadowColor: '#2D7A4F', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4,
    },
    fabIcon: { fontSize: 28, color: 'white', fontWeight: 'bold' },
    sectionTitle: {
        fontSize: 18, fontWeight: 'bold', color: '#1c1f1d',
        marginTop: 16, marginBottom: 12,
    },
    addedIngredientsList: { marginBottom: 12 },
    addedIngredientRow: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#C6E8D2',
    },
    addedIngredientText: { fontSize: 14, color: '#1F5C3A', flex: 1 },
    removeIngredientText: { color: '#dc3545', fontSize: 18, fontWeight: 'bold', paddingHorizontal: 8 },
    addIngredientContainer: {
        backgroundColor: '#F0FAF4', padding: 12, borderRadius: 12,
        marginBottom: 16, borderWidth: 1, borderColor: '#C6E8D2',
    },
    autocompleteContainer: {
        backgroundColor: 'white', borderWidth: 1, borderColor: '#C6E8D2',
        borderRadius: 10, maxHeight: 150, marginBottom: 12,
    },
    autocompleteItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F0FAF4' },
    autocompleteText: { fontSize: 14, color: '#2D7A4F' },
    ingredientDetailsContainer: { marginTop: 8 },
    unitSelector: { flexDirection: 'row', marginBottom: 12, gap: 8 },
    unitBtn: {
        paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8,
        borderWidth: 1, borderColor: '#C6E8D2', backgroundColor: '#fff',
    },
    unitBtnActive: { backgroundColor: '#2D7A4F', borderColor: '#2D7A4F' },
    unitBtnText: { fontSize: 14, color: '#2D7A4F' },
    unitBtnTextActive: { color: '#fff', fontWeight: 'bold' },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#C6E8D2',
        borderRadius: 10,
        marginBottom: 12,
        backgroundColor: '#F0FAF4',
        justifyContent: 'center',
        height: 50,
        paddingHorizontal: 12,
    },
    pickerText: {
        fontSize: 16,
        color: '#1F5C3A',
    },
    pickerPlaceholder: {
        color: '#7AB894',
    },
    filtersContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 5,
        backgroundColor: '#fff',
        zIndex: 10,
    },
    searchInput: {
        borderWidth: 1, borderColor: '#C6E8D2', borderRadius: 10,
        padding: 10, marginBottom: 10, fontSize: 16, backgroundColor: '#F0FAF4',
        color: '#1F5C3A',
    },
    recipeAutocompleteContainer: {
        backgroundColor: 'white', borderWidth: 1, borderColor: '#C6E8D2',
        borderRadius: 10, maxHeight: 150, marginBottom: 10,
        position: 'absolute', top: 55, left: 0, right: 0, zIndex: 1000,
        elevation: 5,
    },
    categoryFilterContainer: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    filterChip: {
        paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16,
        borderWidth: 1, borderColor: '#C6E8D2', backgroundColor: '#fff',
        marginRight: 8,
    },
    filterChipActive: { backgroundColor: '#2D7A4F', borderColor: '#2D7A4F' },
    filterChipText: { fontSize: 14, color: '#2D7A4F' },
    filterChipTextActive: { color: '#fff', fontWeight: 'bold' },
    sortButton: {
        paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10,
        borderWidth: 1, borderColor: '#C6E8D2', backgroundColor: '#fff',
        alignItems: 'center', marginBottom: 10,
    },
    sortButtonActive: { backgroundColor: '#2D7A4F', borderColor: '#2D7A4F' },
    sortButtonText: { fontSize: 14, color: '#2D7A4F', fontWeight: 'bold' },
    sortButtonTextActive: { color: '#fff' },
});

export default RecipeScreen;
